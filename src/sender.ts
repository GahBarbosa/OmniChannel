import { create, Whatsapp, Message, SocketState } from "venom-bot"
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js"

export type QRCode = {
    base64Qr: string;
    asciiQR: string;
    attemps: number;
    urlCode?: string;
} 

const chromiumArgs = [
  '--disable-web-security', '--no-sandbox', '--disable-web-security',
  '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
  '--disable-offline-load-stale-cache', '--disk-cache-size=0',
  '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
  '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
  '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
  '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'
];

class Sender {
    private client: Whatsapp
    private connected: boolean
    private qr: QRCode

    get isConnected(): boolean {
        return this.connected
    }

    get qrCode(): QRCode {
        return this.qr
    }

    constructor() {
        this.initialize()
    }

    private initialize() {
        const start = (client: Whatsapp) => {
            this.client = client;
            // this.sendText("5521974381362@c.us","Teste")
            client.onStateChange((state) => {
                this.connected = state === SocketState.CONNECTED
            })
        }

        const qr = (
            base64Qr:string,
            asciiQR:string,
            attemps:number,
        ) => {
            this.qr = {base64Qr, asciiQR, attemps}
        }
    
        // const status = (statusFind:string) => {
        //     this.connected = ['isLogged', 'qrReadSuccess', "chatsAvaiable"]
        //     .includes(statusFind)
        // }    
       
        // create('ws-sender-dev', qr)
        create('ws-sender-dev', qr, undefined, { useChrome: false, browserArgs: chromiumArgs })
        // status
        .then( (client) => start(client) )
        .catch( (error) => console.log(error) )
    }

    async sendText(to:string, body:string) {
        // to 5521974381362@c.us
        if(!isValidPhoneNumber(to,"BR")){
            throw new Error('Phone number not valid')
        }
        let phoneNumber = parsePhoneNumber(to,"BR")
            ?.format("E.164")
            ?.replace("+","") as string
        phoneNumber = phoneNumber.includes("@c.us")
        ? phoneNumber
        : `${phoneNumber}@c.us`

        await this.client.sendText(phoneNumber, body)
    }

}

export default Sender;