"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const { addFirebaseContact } = require("./third_party_modules/firebase");
const { addSIBContact } = require("./third_party_modules/sendinblue");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes);

function sanitizeInput(input) {
  return input.replace(/[^\w\s@.]/gi, "");
}

function sanitizeInputMiddleware(req, res, next) {
  req.body.name = sanitizeInput(req.body.name);
  req.body.email = sanitizeInput(req.body.email);
  next();
}

app.post("/submit-contact", sanitizeInputMiddleware, async (req, res) => {
  let reqCap = req.body.captcha;
  let reqName = req.body.name;
  let reqEmail = req.body.email;
  let csrfToken = req.body._csrf;

  // Verify CSRF token
  if (req.headers["x-csrf-token"] !== csrfToken) {
    return res.status(403).json({ success: false, msg: "Invalid CSRF token" });
  }

  if (reqCap === undefined || reqCap == "" || reqCap === null) {
    return res.json({
      success: false,
      msg: "Please select captcha",
      hostname: "localhost",
    });
  }

  const secretKey = process.env.SECRET_KEY;
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reqCap}&remoteip=${req.connection.remoteAddress}`;

  try {
    const response = await fetch(verifyUrl);
    const body = await response.json();

    if (body.success !== undefined && !body.success) {
      return res.json({ success: false, msg: "Failed verification" });
    }

    try {
      addSIBContact(reqName, reqEmail);
      addFirebaseContact(reqEmail, reqName);

      return res.json({ success: true, msg: "Captcha passed!" });
    } catch (error) {
      let errorMessage;
      if (error.response && error.response.text) {
        const errorResponse = JSON.parse(error.response.text);
        errorMessage = errorResponse.message;
      }
      return res.status(500).json({ success: false, msg: `${errorMessage}` });
    }
  } catch (err) {
    return res.json({
      success: false,
      msg: "An error occurred while verifying the captcha",
    });
  }
});

module.exports = app;
