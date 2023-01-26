"use strict";

let navContainer = document.querySelector("#navigation");

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

      burger.classList.toggle("toggle");
    });
  }
}

export default function getNav() {
  fetch("/views/global-components/navigation/navigation.html")
    .then((res) => res.text())
    .then((navHtml) => {
      navContainer.innerHTML = navHtml;

      const burger = document.querySelector(".burger");
      const nav = document.querySelector(".nav-links");
      const navLinks = document.querySelectorAll(".nav__link");

      if (burger) {
        initBurgerMenu(burger, nav, navLinks);
      }
    });
}
