const fullName = document.querySelector(".name-input");
const email = document.querySelector(".email-input");
const submitBtn = document.querySelector(".submit");
const myForm = document.querySelector(".form");
let navContainer = document.querySelector("#navigation");
let errorCap = document.querySelector(".error-captcha");
let captcha;

// need to explicitly load page before captcha
window.onload = function () {
  // if (captcha) {
  captcha = document.querySelector("#g-recaptcha-response");
  // }
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
// this needs to be on the quote request form also
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

// Might want to do this in a separate module and import it here
function initBurgerMenu(burger, nav, navLinks) {
  if (burger) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("nav-active");
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = "";
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7}s`;
        }
      });
      // Burger animation
      burger.classList.toggle("toggle");
    });
  }
}

function getNav() {
  fetch("/views/global-components/navigation.html")
    .then((res) => res.text())
    .then((navHtml) => {
      navContainer.innerHTML = navHtml;

      const burger = document.querySelector(".burger");
      const nav = document.querySelector(".nav-links");
      const navLinks = document.querySelectorAll(".nav__link");

      initBurgerMenu(burger, nav, navLinks);
    });
}

getNav();
