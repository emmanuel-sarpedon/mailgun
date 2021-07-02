// -- DEPENDENCIES --
require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(formidable());

app.post("/sendmail", (req, res) => {
  // -- .ENV VARIABLES
  const API_KEY = process.env.MAILGUN_APIKEY;
  const DOMAIN = process.env.MAILGUN_DOMAIN;

  // -- MAILGUN INITIALIZATION
  const mg = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

  const { firstName, lastName, company, email, tel, subject, message } =
    req.fields;

  if (!firstName || !lastName | !email | !subject | !message) {
    res.status(400).json({
      Error:
        "Missing parameters. The query needs parameters: firstName, lastName, email, object, message",
    });
  } else {
    const data = {
      from: `${firstName} ${lastName} <${email}>`,
      to: process.env.MAILGUN_MAILDESTINATION,
      subject: `${subject} - Société : ${company} - Tel : ${tel}`,
      text: `${message}`,
    };

    mg.messages().send(data, (error, body) => {
      if (error) {
        res.status(400).json({ Erreur: error });
      } else if (body) {
        res
          .status(200)
          .json({
            Message: "Message sent ! ✅",
            Body: {
              from: data.from,
              subject: data.subject,
              message: data.text,
            },
          });
      } else {
        res.status(400).json({ Error: "No response from mailgun" });
      }
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server Has Started. Listening Port " + process.env.PORT);
});
