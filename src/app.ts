import express, { Request, Response } from "express";

var whatsappRouter = require('./routes/whatsapp');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/whatsapp', whatsappRouter);


const port = process.env.PORT || 5001;
app.listen(port, function () {
    console.log(`App listening on port ${port}.`);
});