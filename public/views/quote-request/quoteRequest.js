const myForm = document.getElementById("myForm");
const numPieces = document.querySelector(".number-pieces");
const shipmentServiceType = document.querySelector(".shipment-service-type");
const hsCodes = document.querySelector(".hs-codes");
const weight = document.querySelector(".weight");
const weightUnits = document.querySelector(".weight-units");
const hazardous = document.querySelector(".hazardous");
const checkbox = document.querySelector(".checkbox");
// const fullName = document.getElementById("fullName");
// const email = document.getElementById("email");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const companyName = document.getElementById("companyName");
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
let nameErrorMsg = document.querySelector(".quote-error--name");
let companyNameErrorMsg = document.querySelector(".quote-error--companyName");
let emailErrorMsg = document.querySelector(".quote-error--email");
let phoneErrorMsg = document.querySelector(".quote-error--phone");

let submitBtn = document.querySelector(".submit");

(function () {
  if (!skidTypeWrapper) {
    return;
  }
  // if (window.location.href.split("/")[3]) {
  window.addEventListener("DOMContentLoaded", () => {
    let templateSkidTypes = `<input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="0" class="skid-type" name='skid-type'>`;

    let templateSkidDimensions = `<div class="dimensions-wrapper">
                                          <input type="text" placeholder="Length" class="dimensions-input length" data-count="0" name='length'>
                                          <input type="text" placeholder="Width" class="dimensions-input width" data-count="0" name='width'>
                                          <input type="text" placeholder="Height" class="dimensions-input height" data-count="0" name='height'>
                                        </div>`;

    skidTypeWrapper.insertAdjacentHTML("afterbegin", templateSkidTypes);
    skidDimensions.insertAdjacentHTML("afterbegin", templateSkidDimensions);

    displaySkidInputs();
  });
  // }
})();

function validateNumSkids() {
  let skidsRegex = /^\d+$/;
  let isNumber = skidsRegex.test(numSkids.value);

  if (numSkids.value > 20 && isNumber) {
    numSkidsErrorMax.classList.add("active");
    numSkidsErrorInvalid.classList.remove("active");
  }

  if (numSkidsErrorMax.classList.contains("active") && numSkids.value < 20) {
    numSkidsErrorMax.classList.remove("active");
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

function validateEmail() {
  let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let isValidEmail = emailRegEx.test(email.value);

  if (!isValidEmail) {
    emailErrorMsg.classList.add("active");
  }
  if (isValidEmail) {
    emailErrorMsg.classList.remove("active");
  }
}

function validatePhone() {
  let phoneRegEx = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/;
  let isValidPhone = phoneRegEx.test(phone.value);
  if (!isValidPhone) {
    phoneErrorMsg.classList.add("active");
  }
  if (isValidPhone) {
    phoneErrorMsg.classList.remove("active");
  }
}

// change to submit event
myForm.addEventListener("input", (e) => {
  e.preventDefault();
  validateEmail();
  validatePhone();
});

function displaySkidInputs() {
  numSkids.addEventListener("input", () => {
    skidTypeWrapper.innerHTML = "";
    skidDimensions.innerHTML = "";
    validateNumSkids();
    for (let i = 0; i < numSkids.value; i++) {
      let templateSkidTypes = `<input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="${i}" class="skid-type" name='skid-type'>`;
      // if value exceeds 20 set default number on UI to 1 row
      if (numSkids.value > 20) {
        skidTypeWrapper.insertAdjacentHTML("beforeend", templateSkidTypes);
      }
      let templateSkidDimensions = `<div class="dimensions-wrapper">
                                    <input type="text"  placeholder="Length" class="dimensions-input length" data-count="${i}" name='length'>
                                    <input type="text" placeholder="Width" class="dimensions-input width" data-count="${i}" name='width'>
                                    <input type="text" placeholder="Height" class="dimensions-input height" data-count="${i}" name='height'>
                                  </div>`;
      skidTypeWrapper.insertAdjacentHTML("beforeend", templateSkidTypes);
      skidDimensions.insertAdjacentHTML("beforeend", templateSkidDimensions);
    }
  });
}

// need to merge the submit functionality from the contact form
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let inputs = document.querySelectorAll(".dimensions-input");
    let skidTypes = document.querySelectorAll(".skid-type");

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
