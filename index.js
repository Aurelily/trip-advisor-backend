const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const { json } = require("body-parser");
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

// CONNEXION A MAILGUN
const API_KEY = process.env.MG_API_KEY;
const DOMAIN = process.env.MG_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

//Route d'accueil pour MongoDB ATLAS
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to Form Trip Advisor API by Lily !" });
});

//Route post : envoyer les données du formulaire
app.post("/form", async (req, res) => {
  try {
    console.log("Entrée dans le route Form");

    const data = {
      from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}`,
      to: "aurelie.preaud@gmail.com",
      subject: `Formulaire contact par ${req.fields.email}`,
      text: `${req.fields.message}`,
    };

    mailgun.messages().send(data, (error, body) => {
      console.log(body);
      console.log(error);
    });

    res.json({ message: "Données reçues, mail envoyé" });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "All routes" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started 😎 !");
});
