const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

const PORT = 5000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/", "index.html"));
});

app.get("/quote-request/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/quote-request/", "index.html")
  );
});

//services middlwares
// transportation
app.get("/services/transportation/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/services/transportation/", "index.html")
  );
});

// // ocean
app.get("/services/transportation/ocean", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/public/views/services/transportation/ocean",
      "index.html"
    )
  );
});

// // air
app.get("/services/transportation/air", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/public/views/services/transportation/air",
      "index.html"
    )
  );
});

// // truck
app.get("/services/transportation/truck", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/public/views/services/transportation/truck",
      "index.html"
    )
  );
});

// // truck
app.get("/services/transportation/warehouse", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/public/views/services/transportation/warehouse",
      "index.html"
    )
  );
});

// contact
app.get("/contact-on", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/contact/contact-on/", "contact-on.html")
  );
});
app.get("/contact-qc", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/contact/contact-qc/", "contact-qc.html")
  );
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/", "success.html"));
});
app.get("/failure", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/", "failure.html"));
});

// get req object and if captcha is truthy
// send back res object and create the new contact
// save the contact in google firebase as well
app.post("/submit", (req, res) => {
  let reqCap = req.body.captcha;
  if (reqCap === undefined || reqCap === "" || reqCap === null) {
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

    if (body.success !== undefined && !body.success) {
      return res.json({ success: false, msg: "Failed verification" });
    }

    return res.json({ success: true, msg: "Captcha passed!" });
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
