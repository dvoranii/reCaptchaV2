const myForm = document.getElementById("myForm");
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

let submitBtn = document.querySelector(".submit");

// need to explain why I'm doing this (state management)
function setSkidTemplate(position, i) {
  let templateSkidTypes = `<input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="${i}" class="skid-type" name='skid-type'>`;
  let templateSkidDimensions = `<div class="dimensions-wrapper">
                                          <input type="text" placeholder="Length" class="dimensions-input length" data-count="${i}" name='length'>
                                          <input type="text" placeholder="Width" class="dimensions-input width" data-count="${i}" name='width'>
                                          <input type="text" placeholder="Height" class="dimensions-input height" data-count="${i}" name='height'>
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

function validateInput(inputValue, regEx = "", errorMsg) {
  if (regEx !== "") {
    let isValid = regEx.test(inputValue);

    if (!isValid) {
      errorMsg.classList.add("active");
    }

    if (isValid) {
      errorMsg.classList.remove("active");
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

// need to merge the submit functionality from the contact form
if (myForm) {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phoneRegEx = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/;

    validateInput(phone.value, phoneRegEx, phoneErrorMsg);
    validateInput(email.value, emailRegEx, emailErrorMsg);
    validateInput(fullName.value, "", nameErrorMsg);
    validateInput(companyName.value, "", companyNameErrorMsg);
    validateInput(numSkids.value, "", numSkidsErrorEmpty);
    validateInput(pickupInfo.value, "", pickupInfoErrorMsg);
    validateInput(shippingInfo.value, "", shippingInfoErrorMsg);

    let inputs = document.querySelectorAll(".dimensions-input");
    let skidTypes = document.querySelectorAll(".skid-type");

    // need to refactor this to make it more presentable in the DB
    let arrInput = [];
    inputs.forEach((input) => {
      skidTypes.forEach((type, i) => {
        if (input.dataset.count === type.dataset.count) {
          arrInput.push(
            `${type.value} ${i} - ${input.placeholder}: ${input.value}`
          );
        }
      });
    });
    console.log(arrInput);
    // addDocument_AutoID(arrInput);
  });
}
