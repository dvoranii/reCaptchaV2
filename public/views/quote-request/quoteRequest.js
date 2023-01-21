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
const companyName = document.getElementById("companyName");
const pickupInfo = document.getElementById("pickupInfo");
const shippingInfo = document.getElementById("shippingInfo");
const numSkids = document.querySelector(".number-skids");
const skidDimensions = document.querySelector(".skid-dimensions");
const skidTypeWrapper = document.querySelector(".skid-type-wrapper");

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

function displaySkidInputs() {
  numSkids.addEventListener("input", () => {
    skidTypeWrapper.innerHTML = "";
    skidDimensions.innerHTML = "";
    for (let i = 0; i < numSkids.value; i++) {
      let templateSkidTypes = `<input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="${i}" class="skid-type" name='skid-type'>`;
      let templateSkidDimensions = `<div class="dimensions-wrapper">
                                    <input type="text" placeholder="Length" class="dimensions-input length" data-count="${i}" name='length'>
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
