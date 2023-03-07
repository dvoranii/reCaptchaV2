"use strict";

const fullName = document.querySelector(".name-input");
const email = document.querySelector(".email-input");
// const submitBtn = document.querySelector(".submit");
const myForm = document.querySelector(".form");
const captcha = document.querySelector(".g-recaptcha");

// Error messages
let errorCap = document.querySelector(".error-captcha");
let errorName = document.querySelector(".contact-name--error");
let errorEmailEmpty = document.querySelector(".contact-email--error-1");
let errorEmailInvalid = document.querySelector(".contact-email--error-2");

let captchaRes;
let csrfToken;

import renderNavigation from "./views/global-components/navigation/nav.js";
import renderFooter from "./views/global-components/footer/footer.js";

renderNavigation();
renderFooter();

// need to explicitly load page before selecting recaptcha to get access to its response object
// CSRF token only generated on pages with forms meaning pages w/ a captcha
window.onload = function () {
  if (captcha) {
    captchaRes = document.querySelector("#g-recaptcha-response");
    csrfToken = generateCSRFToken();
    let csrfTokenEl = document.getElementById("csrf-token");
    if (csrfTokenEl) {
      csrfTokenEl.value = csrfToken;
    }
  }
};

if (myForm) {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendContactFormData();
  });
}

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

let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateContactForm(name, email, emailRegex) {
  // Check if name is empty
  if (name.trim() === "") {
    errorName.classList.add("active");
  } else {
    errorName.classList.remove("active");
  }

  // Check if email is empty
  if (email.trim() === "") {
    errorEmailEmpty.classList.add("active");
    errorEmailInvalid.classList.remove("active");
  } else {
    errorEmailEmpty.classList.remove("active");
    // Check if email matches the regex
    if (emailRegex.test(email.trim())) {
      errorEmailInvalid.classList.remove("active");
    } else {
      errorEmailInvalid.classList.add("active");
      return;
    }
  }
}

function sendContactFormData() {
  let nameValue = sanitizeInput(fullName.value);
  let emailValue = sanitizeInput(email.value);
  let csrfToken = getCSRFToken();

  validateContactForm(nameValue, emailValue, emailRegEx);

  // guard clauses to prevent form submission
  if (nameValue.trim() === "" || emailValue.trim() === "") {
    return;
  }

  if (!emailRegEx.test(emailValue.trim())) {
    return;
  }
  // pass the csrf
  let formValues = JSON.stringify({
    name: nameValue,
    email: emailValue,
    captcha: captchaRes.value,
    _csrf: csrfToken,
  });

  fetch("/submit-contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: formValues,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success == true) {
        window.location.href = "/success";
      }
      if (data.success == false) {
        errorCap.innerHTML = `${data.msg}`;
        errorCap.classList.add("active");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
