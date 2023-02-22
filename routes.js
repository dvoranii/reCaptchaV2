"use strict";

const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/", "index.html"));
});
router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/about", "index.html"));
});

// quote request

router.get("/quote-request/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/quote-request/", "index.html")
  );
});

// transportation
router.get("/services/transportation/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/services/transportation/", "index.html")
  );
});
router.get("/services/sporting-goods/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/public/views/services/sporting-goods/", "index.html")
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

module.exports = router;
