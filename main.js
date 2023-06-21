"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const {
  addFirebaseContact,
  addQuoteRequestFormData,
} = require("./third_party_modules/firebase");
const { addSIBContact } = require("./third_party_modules/sendinblue");

const app = express();

const csurf = require("csurf");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes);

app.use(cookieParser());
app.use(csurf({ cookie: true }));

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post("/submit-contact", async (req, res) => {
  let reqCap = req.body.captcha;
  let reqName = req.body.name;
  let reqEmail = req.body.email;
  let csrfToken = req.body._csrf;

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
      return res.json({ success: false, msg: "Please select captcha" });
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

app.post("/submit-quote", async (req, res) => {
  let reqCap = req.body.captchaRes;
  let reqCSRF = req.body._csrf;
  console.log(reqCSRF);

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
      return res.json({ success: false, msg: "Please select captcha" });
    }

    const formData = req.body.formData;
    const {
      fullName,
      companyName,
      email,
      phone,
      pickupInfo,
      shippingInfo,
      shipmentServiceType,
      additionalInfo,
    } = formData;

    const { numSkids, numPieces, weight, weightUnits, hazardous, hsCodes } =
      formData.skids.skidsMetaInfo;

    const skidDetails = formData.skids.skidDetails;

    try {
      const docId = await addQuoteRequestFormData(
        fullName,
        email,
        companyName,
        phone,
        pickupInfo,
        shippingInfo,
        numSkids,
        skidDetails,
        shipmentServiceType,
        numPieces,
        weight,
        weightUnits,
        hazardous,
        hsCodes,
        additionalInfo
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Quote request saved successfully",
          docId,
        });
    } catch (error) {
      console.error("Error adding quote request data:", error);
      res
        .status(500)
        .json({ message: "Error adding quote request data", error });
    }
  } catch (err) {
    return res.json({
      success: false,
      msg: "An error occurred while verifying the captcha",
    });
  }
});

module.exports = app;
