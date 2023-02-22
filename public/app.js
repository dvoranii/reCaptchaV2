"use strict";

const fullName = document.querySelector(".name-input");
const email = document.querySelector(".email-input");
const submitBtn = document.querySelector(".submit");
const myForm = document.querySelector(".form");

let errorCap = document.querySelector(".error-captcha");
// let captcha = document.querySelector(".g-recaptcha");
let captchaRes;

import renderNavigation from "./views/global-components/navigation/nav.js";
import renderFooter from "./views/global-components/footer/footer.js";

renderNavigation();
renderFooter();

// need to explicitly load page before selecting recaptcha to get access to its response object
window.onload = function () {
  if (grecaptcha) {
    captchaRes = document.querySelector("#g-recaptcha-response");
  }
};

if (myForm) {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendFormData();
  });
}

// is being done for quote request form
// let isValid = false;
// function validateForm() {}

function sanitizeInput(input) {
  return input.replace(/[^\w\s@.]/gi, "");
}

function generateCSRFToken() {
  const csrfToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem("csrfToken", csrfToken);
  return csrfToken;
}

function getCSRFToken() {
  return sessionStorage.getItem("csrfToken");
}

// Should change this to VerifyCaptcha
// this needs to be on the quote request form also
function sendFormData() {
  let nameValue = sanitizeInput(fullName.value);
  let emailValue = sanitizeInput(email.value);

  console.log(nameValue, emailValue);

  // pass the csrf
  let formValues = JSON.stringify({
    name: nameValue,
    email: emailValue,
    captcha: captchaRes.value,
  });

  console.log(formValues);

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formValues,
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if (data.success == true) {
        console.log("true");

        // this is being rendered server side
        // figure out a way to do this so when it's deployed it still works
        window.location.href = "http://localhost:5000/success";
      }
      if (data.success == false) {
        console.error(data);
        errorCap.innerHTML = `${data.msg}`;
        errorCap.classList.add("active");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
