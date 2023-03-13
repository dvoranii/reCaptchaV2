// TODO: Finish the error messages and form validation
// TODO: Connect this to firebase
// TODO: Add sendinblue email campaign

// here's the form
const myForm = document.querySelector(".quote-request-form");
const numPieces = document.querySelector(".number-pieces");
const shipmentServiceType = document.querySelector(".shipment-service-type");
const hsCodes = document.querySelector(".hs-codes");
const weight = document.querySelector(".weight");
const weightUnits = document.querySelector(".weight-units");
const hazardous = document.querySelector(".hazardous");
const checkbox = document.querySelector(".checkbox");
const clearBtn = document.querySelector(".clear-btn");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const companyName = document.getElementById("companyName");
const fullName = document.getElementById("fullName");
const pickupInfo = document.getElementById("pickupInfo");
const shippingInfo = document.getElementById("shippingInfo");
const numSkids = document.querySelector(".number-skids");
const skidDimensions = document.querySelector(".skid-dimensions");
const skidTypeWrapper = document.querySelector(".skid-type-wrapper");

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

let submitBtn = document.querySelector(".submit");

// need to explain why I'm doing this (state management)
function setSkidTemplate(position, i) {
  let templateSkidTypes = `<input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="${i}" id="skid-type-${i}" class="skid-type" name='skid-type'>
                            <p class='error-skid-type'>Please enter a skid type</p>
  `;
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

(function () {
  if (!skidTypeWrapper) {
    return;
  }
  window.addEventListener("DOMContentLoaded", () => {
    setSkidTemplate("afterbegin", 0);
    displaySkidInputs();
  });
})();

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

const captcha = document.querySelector(".g-recaptcha");
let captchaRes;
let csrfToken;

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

function validateNumSkidsOnInput() {
  let skidsRegex = /^\d+$/;
  let isNumber = skidsRegex.test(numSkids.value);

  if (numSkids.value > 20 && isNumber) {
    numSkidsErrorMax.classList.add("active");
    numSkidsErrorInvalid.classList.remove("active");
    return false;
  }

  if (numSkidsErrorMax.classList.contains("active") && numSkids.value < 20) {
    numSkidsErrorMax.classList.remove("active");
  }

  if (
    numSkidsErrorEmpty.classList.contains("active") &&
    !numSkids.value == ""
  ) {
    numSkidsErrorEmpty.classList.remove("active");
  }

  if (!isNumber) {
    numSkidsErrorInvalid.classList.add("active");
  }

  if (
    (numSkidsErrorInvalid.classList.contains("active") && isNumber) ||
    (numSkidsErrorInvalid.classList.contains("active") && numSkids.value == "")
  ) {
    numSkidsErrorInvalid.classList.remove("active");
  }

  if (
    numSkidsErrorInvalid.classList.contains("active") &&
    numSkidsErrorMax.classList.contains("active")
  ) {
    numSkidsErrorMax.classList.remove("active");
  }
}

function validateInput(
  inputValue,
  regEx = "",
  errorMsg,
  errorMsg2 = "",
  errorSkidType
) {
  let isValid;
  if (regEx !== "") {
    isValid = regEx.test(inputValue);

    if (!isValid) {
      errorMsg.classList.add("active");
    }

    if (isValid) {
      errorMsg.classList.remove("active");
    }
  }

  // need to make sure regEx exists first
  if (errorMsg2) {
    if (!inputValue == "" && !isValid) {
      errorMsg.classList.remove("active");
      errorMsg2.classList.add("active");
    }

    if (errorMsg2.classList.contains("active") && inputValue == "") {
      errorMsg.classList.add("active");
      errorMsg2.classList.remove("active");
    }

    if (isValid && errorMsg2.classList.contains("active")) {
      errorMsg2.classList.remove("active");
    }
  }

  if (inputValue == "") {
    errorMsg.classList.add("active");
  }

  if (inputValue !== "") {
    errorMsg.classList.remove("active");
  }
}

function displaySkidInputs() {
  numSkids.addEventListener("input", () => {
    skidTypeWrapper.innerHTML = "";
    skidDimensions.innerHTML = "";

    validateNumSkidsOnInput();
    // prevents UI from displaying more than 20 rows
    if (validateNumSkidsOnInput() === false) {
      return;
    }

    for (let i = 0; i < numSkids.value; i++) {
      setSkidTemplate("beforeend", i);
    }
  });
}

// ----------------------------------------------------------

if (myForm) {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phoneRegEx = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/;
    let positiveIntegerRegEx = /^\d+$/;
    let csrfToken = getCSRFToken();

    validateInput(phone.value, phoneRegEx, phoneErrorMsg);
    validateInput(email.value, emailRegEx, emailErrorMsg);
    validateInput(fullName.value, "", nameErrorMsg);
    validateInput(companyName.value, "", companyNameErrorMsg);
    validateInput(numSkids.value, "", numSkidsErrorEmpty);
    validateInput(pickupInfo.value, "", pickupInfoErrorMsg);
    validateInput(shippingInfo.value, "", shippingInfoErrorMsg);
    validateInput(hsCodes.value, "", errorHsCode);
    validateInput(shipmentServiceType.value, "", errorServiceType);
    validateInput(
      numPieces.value,
      positiveIntegerRegEx,
      errorNumPiecesEmpty,
      errorNumPiecesInvalid
    );
    validateInput(
      weight.value,
      positiveIntegerRegEx,
      errorWeightEmpty,
      errorWeightInvalid
    );
    validateInput(weightUnits.value, "", errorUnit);
    validateInput(hazardous.value, "", errorOption);

    // Add guard clause for captcha and csrfToken
    if (!captcha || !captchaRes || !csrfToken) {
      console.error("Captcha or CSRF token is missing");
      return;
    }

    // Create an object to hold the form data
    let formData = {};

    // Add the basic form fields to the object
    formData.fullName = fullName.value;
    formData.companyName = companyName.value;
    formData.email = email.value;
    formData.phone = phone.value;
    formData.pickupInfo = pickupInfo.value;
    formData.shippingInfo = shippingInfo.value;
    formData.hsCodes = hsCodes.value;
    formData.shipmentServiceType = shipmentServiceType.value;
    formData.numSkids = numSkids.value;
    formData.numPieces = numPieces.value;
    formData.weight = weight.value;
    formData.weightUnits = weightUnits.value;
    formData.hazardous = hazardous.value;

    let inputs = document.querySelectorAll(".dimensions-input");
    let skidTypes = document.querySelectorAll(".skid-type");
    // Add the skid dimensions to the object as a map
    let skidsMap = new Map();
    inputs.forEach((input) => {
      skidTypes.forEach((type, i) => {
        if (input.dataset.count === type.dataset.count) {
          let key = `${type.value} ${i}`;
          if (!skidsMap.has(key)) {
            skidsMap.set(key, {});
          }
          skidsMap.get(key)[input.placeholder] = input.value;
        }
      });
    });
    formData.skids = Object.fromEntries(skidsMap);
    console.log(formData);

    // Send the form data to the backend
    fetch("/submit-quote", {
      method: "POST",
      body: JSON.stringify({
        formData,
        captchaRes: captchaRes.value,
        csrfToken: csrfToken.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  });
}
