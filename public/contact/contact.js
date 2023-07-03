import {
  handleCaptcha,
  sanitizeInput,
  fetchAndSetCsrfToken,
  getCsrfToken,
} from "../../formUtils.js";

const fullName = document.querySelector(".name-input");
const email = document.querySelector(".email-input");
const myForm = document.querySelector(".form");

// Error messages
let errorCap = document.querySelector(".error-captcha");
let errorName = document.querySelector(".contact-name--error");
let errorEmailEmpty = document.querySelector(".contact-email--error-1");
let errorEmailInvalid = document.querySelector(".contact-email--error-2");

window.addEventListener("DOMContentLoaded", () => {
  fetchAndSetCsrfToken("csrf-token");
});

if (myForm) {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendContactFormData();
  });
}

let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateContactForm(name, email, emailRegex) {
  let isValid = true;
  // Check if name is empty
  if (name.trim() === "") {
    errorName.classList.add("active");
    isValid = false;
  } else {
    errorName.classList.remove("active");
  }

  // Check if email is empty
  if (email.trim() === "") {
    errorEmailEmpty.classList.add("active");
    errorEmailInvalid.classList.remove("active");
    isValid = false;
  } else {
    errorEmailEmpty.classList.remove("active");
    // Check if email matches the regex
    if (emailRegex.test(email.trim())) {
      errorEmailInvalid.classList.remove("active");
    } else {
      errorEmailInvalid.classList.add("active");
      isValid = false;
    }
  }
  return isValid;
}

const { captcha, getCaptchaRes } = handleCaptcha();

function sendContactFormData() {
  let nameValue = sanitizeInput(fullName.value);
  let emailValue = sanitizeInput(email.value);

  const captchaRes = getCaptchaRes();

  const csrfToken = getCsrfToken("csrf-token");

  let isFormValid = validateContactForm(nameValue, emailValue, emailRegEx);

  if (!isFormValid || !captchaRes) {
    console.error("Invalid form data");
    return;
  }

  errorCap.innerHTML = "";
  errorCap.classList.remove("active");

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
      if (data.success == true) {
        // window.location.href = "/success";
        console.log("success");
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
