const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

// CONNEXION A MAILGUN
const API_KEY = process.env.MG_API_KEY;
const DOMAIN = process.env.MG_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

//Route d'accueil pour MongoDB ATLAS et HEROKU
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to Form Trip Advisor API by Lily !" });
});

//Route post : envoyer les données du formulaire
app.post("/form", (req, res) => {
  console.log("Entrée dans le route Form");
  ///Destructuring des variables
  const { firstname, lastname, email, message } = req.fields;
  ///Création de l'objet data
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "aurelie.preaud@gmail.com",
    subject: `Un message de la part de ${email}`,
    text: `${message}`,
  };
  ///Envoie de l'objet data via Mailgun
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.status(200).json(body);
    }
    res.status(401).json(error);
  });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "All routes" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started 😎 !");
});
