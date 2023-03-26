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

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes);

function sanitizeInput(input) {
  return input.replace(/[^\w\s@.]/gi, "");
}

function sanitizeNestedObject(obj, parentKey = "") {
  for (const key in obj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeNestedObject(obj[key], fullKey);
    } else if (typeof obj[key] === "string") {
      obj[key] = sanitizeInput(obj[key]);
    } else if (typeof obj[key] === "number") {
      obj[key] = parseFloat(sanitizeInput(obj[key].toString()));
    }
  }
}

// update to work with quote request
function sanitizeInputMiddleware(req, res, next) {
  if (req.path === "/submit-contact") {
    req.body.name = sanitizeInput(req.body.name);
    req.body.email = sanitizeInput(req.body.email);
  } else if (req.path === "/submit-quote") {
    sanitizeNestedObject(req.body.formData);
  }
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

app.post("/submit-quote", sanitizeInputMiddleware, async (req, res) => {
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
      .json({ message: "Quote request saved successfully", docId });
  } catch (error) {
    console.error("Error adding quote request data:", error);
    res.status(500).json({ message: "Error adding quote request data", error });
  }
});

module.exports = app;
