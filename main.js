"use strict";

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const SibApiV3Sdk = require("sib-api-v3-sdk");

dotenv.config();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes);

// * FIREBASE
const firebase = require("firebase/app");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

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
let db = getFirestore(fb);
let contactRef = collection(db, "contact");

async function addDocument_AutoID(ref, email, fullName) {
  const docRef = await addDoc(ref, {
    email: email,
    fullName: fullName,
  });
}

// SendInBlue
const sibAPIKey = process.env.SIB_API_KEY;
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = sibAPIKey;
let apiInstance = new SibApiV3Sdk.ContactsApi();
let createContact = new SibApiV3Sdk.CreateContact();

function sanitizeInput(input) {
  return input.replace(/[^\w\s@.]/gi, "");
}

app.post("/submit", (req, res) => {
  let reqCap = req.body.captcha;
  let reqName = sanitizeInput(req.body.name);
  let reqEmail = sanitizeInput(req.body.email);

  createContact.email = reqEmail;
  createContact.listIds = [2];
  createContact.attributes = {
    FIRSTNAME: reqName,
  };

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

    // adding to firebase if the captcha is selected!!!
    addDocument_AutoID(contactRef, reqName, reqEmail);
    apiInstance.createContact(createContact).then(
      (data) => {
        console.log(data);
      },
      function (error) {
        console.log(error);
      }
    );
    return res.json({ success: true, msg: "Captcha passed!" });
  });
});

module.exports = app;
