// TODO: Finish the error messages and form validation
// TODO: Connect this to firebase
// TODO: Add sendinblue email campaign

import {
  handleCaptcha,
  sanitizeInput,
  fetchAndSetCsrfToken,
  getCsrfToken,
} from "../formUtils.js";

const myForm = document.querySelector(".quote-request-form");
const numPieces = document.querySelector(".number-pieces");
const shipmentServiceType = document.querySelector(".shipment-service-type");
const hsCodes = document.querySelector(".hs-codes");
const weight = document.querySelector(".weight");
const weightUnits = document.querySelector(".weight-units");
const hazardous = document.querySelector(".hazardous");
// const checkbox = document.querySelector(".checkbox");
// const clearBtn = document.querySelector(".clear-btn");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const companyName = document.getElementById("companyName");
const fullName = document.getElementById("fullName");
const pickupInfo = document.getElementById("pickupInfo");
const shippingInfo = document.getElementById("shippingInfo");
const numSkids = document.querySelector(".number-skids");
const skidDimensions = document.querySelector(".skids .skid-dimensions");
const skidTypeWrapper = document.querySelector(".skids .skid-type-wrapper");
const additionalInfo = document.querySelector(".additional-info textarea");

// Error messages
let numSkidsErrorMax = document.querySelector(".quote-error--numSkids-max");
let numSkidsErrorInvalid = document.querySelector(
  ".quote-error--numSkids-invalid"
);
let numSkidsErrorEmpty = document.querySelector(".quote-error--numSkids-empty");
let nameErrorMsg = document.querySelector(".quote-error--name");
let companyNameErrorMsg = document.querySelector(".quote-error--companyName");
let emailErrorMsg = document.querySelector(".quote-error--email");
let phoneErrorMsg = document.querySelector(".quote-error--phone");
let pickupInfoErrorMsg = document.querySelector(".quote-error--pickupInfo");
let shippingInfoErrorMsg = document.querySelector(".quote-error--shippingInfo");
let errorServiceType = document.querySelector(".error-service-msg");
let errorHsCode = document.querySelector(".error-hsCode-msg");
let errorNumPiecesEmpty = document.querySelector(".error-service-msg-1");
let errorNumPiecesInvalid = document.querySelector(".error-service-msg-2");
let errorWeightEmpty = document.querySelector(".error-weight-empty");
let errorWeightInvalid = document.querySelector(".error-weight-invalid");
let errorUnit = document.querySelector(".error-unit");
let errorOption = document.querySelector(".error-option");
let errorSkidType;

let errorCap = document.querySelector(".error-captcha");

let submitBtn = document.querySelector(".submit");

const { captcha, getCaptchaRes } = handleCaptcha();

// need to explain why I'm doing this (state management)
function setSkidTemplate(position, i) {
  let templateSkidTypes = `<input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="${i}" id="skid-type-${i}" class="skid-type" name='skid-type'>
                            <p class='error-skid-type'>Please enter a skid type</p>`;
  errorSkidType = document.querySelectorAll(".error-skid-type");

  let templateSkidDimensions = `<div class="dimensions-container">
                                          <div class="dimension-wrapper">
                                          <input type="text" placeholder="Length" class="dimensions-input length" data-count="${i}" name='length'>
                                          </div>
                                         
                                          <div class="dimension-wrapper">
                                          <input type="text" placeholder="Width" class="dimensions-input width" data-count="${i}" name='width'>
                                          </div>

                                          <div class="dimension-wrapper">
                                          <input type="text" placeholder="Height" class="dimensions-input height" data-count="${i}" name='height'>
                                          </div>                                     
                                        </div>`;

  skidTypeWrapper.insertAdjacentHTML(position, templateSkidTypes);
  skidDimensions.insertAdjacentHTML(position, templateSkidDimensions);
}

window.addEventListener("DOMContentLoaded", () => {
  fetchAndSetCsrfToken("csrf-token");
  setSkidTemplate("afterbegin", 0);
  setSkidInputs();
});

window.reCaptchaVerified = function () {
  errorCap.classList.remove("active");
};

if (myForm) {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitQuoteForm();
  });
}

function toggleErrorMessage(element, condition) {
  if (condition) {
    element.classList.add("active");
  } else {
    element.classList.remove("active");
  }
}

function validateNumSkidsOnInput() {
  let skidsRegex = /^\d+$/;
  let isNumber = skidsRegex.test(numSkids.value);
  let isMoreThan20 = numSkids.value > 20 && isNumber;
  let isEmpty = numSkids.value === "";

  toggleErrorMessage(numSkidsErrorMax, isMoreThan20);
  toggleErrorMessage(numSkidsErrorInvalid, !isNumber && !isEmpty);
  toggleErrorMessage(numSkidsErrorEmpty, isEmpty);

  return !isMoreThan20;
}

function validateInput(inputValue, regEx = "", errorMsg, errorMsg2 = "") {
  let isEmpty = inputValue.trim() === "";
  let isValid = true;

  if (regEx !== "") {
    isValid = regEx.test(inputValue);
    toggleErrorMessage(errorMsg, !isValid && !isEmpty);
  }

  toggleErrorMessage(errorMsg, isEmpty);

  if (errorMsg2) {
    toggleErrorMessage(errorMsg2, !isEmpty && !isValid);
  }

  return isValid;
}

function setSkidInputs() {
  numSkids.addEventListener("input", () => {
    skidTypeWrapper.innerHTML = "";
    skidDimensions.innerHTML = "";

    const isNumSkidsValid = validateNumSkidsOnInput();

    // prevents UI from displaying more than 20 rows
    if (isNumSkidsValid === false) {
      return;
    }

    for (let i = 0; i < numSkids.value; i++) {
      setSkidTemplate("beforeend", i);
    }
  });
}

function sendQuoteFormData(formData, captchaRes, csrfToken) {
  fetch("/submit-quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({
      formData,
      captchaRes: captchaRes.value,
      _csrf: csrfToken,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success == true) {
        // window.location.href = "/success";
        console.log("success");
      }
      if (data.success == false) {
        errorCap.innerHTML = `${data.msg}`;
        errorCap.classList.add("active");
      }
    })
    .catch((err) => console.log(err));
}

function validateQuoteForm() {
  const fields = [
    {
      input: phone,
      regex: /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
      errorMsg: phoneErrorMsg,
    },
    {
      input: email,
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errorMsg: emailErrorMsg,
    },
    { input: fullName, regex: "", errorMsg: nameErrorMsg },
    { input: companyName, regex: "", errorMsg: companyNameErrorMsg },
    { input: numSkids, regex: "", errorMsg: numSkidsErrorEmpty },
    { input: pickupInfo, regex: "", errorMsg: pickupInfoErrorMsg },
    { input: shippingInfo, regex: "", errorMsg: shippingInfoErrorMsg },
    { input: hsCodes, regex: "", errorMsg: errorHsCode },
    { input: shipmentServiceType, regex: "", errorMsg: errorServiceType },
    {
      input: numPieces,
      regex: /^\d+$/,
      errorMsg: errorNumPiecesEmpty,
      errorMsg2: errorNumPiecesInvalid,
    },
    {
      input: weight,
      regex: /^\d+$/,
      errorMsg: errorWeightEmpty,
      errorMsg2: errorWeightInvalid,
    },
    { input: weightUnits, regex: "", errorMsg: errorUnit },
    { input: hazardous, regex: "", errorMsg: errorOption },
  ];

  let isValid = true;

  fields.forEach((field) => {
    validateInput(
      field.input.value,
      field.regex,
      field.errorMsg,
      field.errorMsg2
    );
    if (field.errorMsg2 && !field.regex.test(field.input.value.trim())) {
      isValid = false;
    }
  });

  return isValid;
}

function submitQuoteForm() {
  const captchaRes = getCaptchaRes();

  // might move this directly to sendQuoteFormData
  const csrfToken = getCsrfToken("csrf-token");
  const isValid = validateQuoteForm();

  let errorMessages = document.querySelectorAll(".active");

  if (errorMessages.length > 0) {
    console.error("Form contains errors. Please fix them before submitting.");
    return;
  }

  errorCap.classList.remove("active");

  // Add guard clause for captcha and csrfToken
  if (!captcha || !captchaRes) {
    console.error("Captcha is missing");
    return;
  } else if (!isValid) {
    console.error("Invalid form submission");
    return;
  }

  let formData = {};

  // Add the basic form fields to the object
  formData.fullName = sanitizeInput(fullName.value);
  formData.companyName = sanitizeInput(companyName.value);
  formData.email = sanitizeInput(email.value);
  formData.phone = sanitizeInput(phone.value);
  formData.pickupInfo = sanitizeInput(pickupInfo.value);
  formData.shippingInfo = sanitizeInput(shippingInfo.value);
  formData.shipmentServiceType = sanitizeInput(shipmentServiceType.value);
  formData.additionalInfo = sanitizeInput(additionalInfo.value);

  let skidsMetaInfo = {
    numSkids: sanitizeInput(numSkids.value),
    numPieces: sanitizeInput(numPieces.value),
    weight: sanitizeInput(weight.value),
    weightUnits: sanitizeInput(weightUnits.value),
    hazardous: sanitizeInput(hazardous.value),
    hsCodes: sanitizeInput(hsCodes.value),
  };
  let skidDetails = {};

  let inputs = document.querySelectorAll(".dimensions-input");
  let skidTypes = document.querySelectorAll(".skid-type");

  // Add the skid dimensions to the object as google firestore map
  inputs.forEach((input) => {
    skidTypes.forEach((type, i) => {
      if (input.dataset.count === type.dataset.count) {
        let key = `${type.value} ${i}`;
        if (!skidDetails[key]) {
          skidDetails[key] = {};
        }
        skidDetails[key][input.placeholder] = input.value;
      }
    });
  });

  formData.skids = {
    skidsMetaInfo,
    skidDetails,
  };

  sendQuoteFormData(formData, captchaRes, csrfToken);
}
