"use strict";

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const cors = require("cors");

const routes = require("./routes");

dotenv.config();

const app = express();
app.use(cors());

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", routes);
// get req object and if captcha is truthy
// send back res object and create the new contact
// save the contact in google firebase as well

// look into modularizing validation and sanitization
function sanitizeInput(input) {
  return input.replace(/[^\w\s@.]/gi, "");
}

app.post("/submit", (req, res) => {
  let reqCap = req.body.captcha;
  let reqName = sanitizeInput(req.body.name);
  let reqEmail = sanitizeInput(req.body.email);

  console.log(reqName, reqEmail);

  console.log(req.body);
  if (reqCap === undefined || reqCap == "" || reqCap === null) {
    return res.json({
      success: false,
      msg: "Please select captcha",
      hostname: "localhost",
    });
  }

  const secretKey = process.env.SECRET_KEY;
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reqCap}&remoteip=${req.connection.remoteAddress}`;

  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    console.log(body);

    if (body.success !== undefined && !body.success) {
      return res.json({ success: false, msg: "Failed verification" });
    }

    return res.json({ success: true, msg: "Captcha passed!" });
  });
});

module.exports = app;
