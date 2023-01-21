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

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/", "success.html"));
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
