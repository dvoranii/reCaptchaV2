const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/", "index.html"));
});

router.get("/quote-request/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/quote-request/", "index.html")
  );
});

//services middlwares
// transportation
router.get("/services/transportation/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/services/transportation/", "index.html")
  );
});

// // ocean
router.get("/services/transportation/ocean", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/public/views/services/transportation/ocean",
      "index.html"
    )
  );
});

// // air
router.get("/services/transportation/air", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/public/views/services/transportation/air",
      "index.html"
    )
  );
});

// // truck
router.get("/services/transportation/truck", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/public/views/services/transportation/truck",
      "index.html"
    )
  );
});

// // warehouse
router.get("/services/transportation/warehouse", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/public/views/services/transportation/warehouse",
      "index.html"
    )
  );
});

// contact
router.get("/contact-on", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/contact/contact-on/", "contact-on.html")
  );
});
router.get("/contact-qc", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/contact/contact-qc/", "contact-qc.html")
  );
});

router.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/", "success.html"));
});
router.get("/failure", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/", "failure.html"));
});

module.exports = router;
