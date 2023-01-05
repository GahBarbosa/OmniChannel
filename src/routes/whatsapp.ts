import { Request, Response, Router } from "express";
var router = Router();

import Sender from "../sender";
const sender = new Sender();

router.post('/send', async (req: Request, res: Response) => {
    const { to, message } = req.body
    try{
        // await sender.sendText("5521974381362@c.us","Teste 2")
        await sender.sendText(to, message)
        res.status(200).send({});
    } catch(error) {
        console.log(error)
        res.status(500).json({status:"error", message:error })
    }
  
});

router.get('/status', async (req: Request, res: Response) => {
    res.send({
        qr_code: sender.qrCode,
        connected: sender.isConnected
    })
  
});


module.exports = router;