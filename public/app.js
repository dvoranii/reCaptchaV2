const fullName = document.querySelector(".name-input");
const email = document.querySelector(".email-input");
const submitBtn = document.querySelector(".submit");
const myForm = document.querySelector(".form");
let navContainer = document.querySelector("#navigation");
let errorCap = document.querySelector(".error-captcha");
let captcha;

// need to explicitly load page before captcha
window.onload = function () {
  if (captcha) {
    captcha = document.querySelector("#g-recaptcha-response");
  }
};

if (myForm) {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendFormData();
  });
}

let isValid = false;
function validateForm() {}

// Should change this to VerifyCaptcha
function sendFormData() {
  let formValues = JSON.stringify({
    name: fullName.value,
    email: email.value,
    captcha: captcha.value,
  });

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formValues,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success == true) {
        console.log("true");

        // this is being rendered server side
        window.location.href += "success";
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

function getNav() {
  fetch("/views/navigation.html")
    .then((res) => res.text())
    .then((navHtml) => {
      navContainer.innerHTML = navHtml;
      console.log(navHtml);
    });
}

getNav();
