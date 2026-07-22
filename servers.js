// Mount Sinai Center - WhatsApp Webhook Server

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Verify Token (weka token yako hapa au kwenye .env)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;


// ===============================
// META WEBHOOK VERIFICATION
// ===============================

app.get("/webhook", (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];


    if (mode && token) {

        if (mode === "subscribe" && token === VERIFY_TOKEN) {

            console.log("Webhook Verified Successfully");

            res.status(200).send(challenge);

        } else {

            res.sendStatus(403);

        }

    }

});


// ===============================
// RECEIVE WHATSAPP MESSAGES
// ===============================

app.post("/webhook", (req, res) => {

    const body = req.body;

    console.log(
        "Incoming Message:",
        JSON.stringify(body, null, 2)
    );


    if(body.object){

        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;


        if(value?.messages){

            const message = value.messages[0];

            const sender = message.from;

            const text =
            message.text?.body || "No text";


            console.log(
                `Message from ${sender}: ${text}`
            );


            // Hapa baadaye tutaunganisha AI response
        }


        res.sendStatus(200);

    } else {

        res.sendStatus(404);

    }

});


// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req,res)=>{

    res.send(
        "Mount Sinai Center WhatsApp Automation Server Running"
    );

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, ()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});
