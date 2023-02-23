"use strict";

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

dotenv.config();

const app = express();
const SibApiV3Sdk = require("sib-api-v3-sdk");

const sibAPIKey = process.env.SIB_API_KEY;
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = sibAPIKey;
let apiInstance = new SibApiV3Sdk.ContactsApi();
let createContact = new SibApiV3Sdk.CreateContact();

async function addSIBContact(reqName, reqEmail) {
  createContact.email = reqEmail;
  createContact.listIds = [2];
  createContact.attributes = {
    FIRSTNAME: reqName,
  };

  try {
    const sibResponse = await apiInstance.createContact(createContact);
    return sibResponse;
  } catch (error) {
    let errorMessage;
    if (error.response && error.response.text) {
      const errorResponse = JSON.parse(error.response.text);
      errorMessage = errorResponse.message;
    }
    throw new Error(`Failed to add contact to Sendinblue: ${errorMessage}`);
  }
}

const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_KEY}`,
  authDomain: "cgl-forms.firebaseapp.com",
  databaseURL: "https://cgl-forms-default-rtdb.firebaseio.com",
  projectId: "cgl-forms",
  storageBucket: "cgl-forms.appspot.com",
  messagingSenderId: "1008506608692",
  appId: "1:1008506608692:web:47818afefcc2935608be61",
};

const fb = initializeApp(firebaseConfig);
const db = getFirestore(fb);
const contactRef = collection(db, "contact");

async function addFirebaseContact(email, fullName) {
  const docRef = await addDoc(contactRef, {
    email: email,
    fullName: fullName,
  });
  return docRef.id;
}
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

app.post("/submit", sanitizeInputMiddleware, async (req, res) => {
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
      console.log(error);
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
