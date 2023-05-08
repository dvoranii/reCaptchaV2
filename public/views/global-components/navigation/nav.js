"use strict";
import { html, render } from "https://cdn.skypack.dev/lit-html";

// function initBurgerMenu(burger, nav, navLinks) {
//   if (burger) {
//     burger.addEventListener("click", () => {
//       nav.classList.toggle("nav-active");
//       navLinks.forEach((link, index) => {
//         if (link.style.animation) {
//           link.style.animation = "";
//         } else {
//           link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7}s`;
//         }
//       });

//       burger.classList.toggle("toggle");
//     });
//   }
// }

// might be better to make this a custom web component
// might also be better to save this html in a separate file and then fetch it
// to make it easier to update the html

export default function renderNavigation() {
  let navContainer = document.querySelector("#navigation");
  let navHtml = html`
    <nav>
      <div class="nav-logo-container">
        <a href="/">
          <img
            src="/three-img/cgl-logo-no-text.png"
            class="cgl-logo-nav"
            alt=""
          />
        </a>
      </div>

      <div class="nav-menu-container">
        <ul class="nav-menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about" class="about-link" data-link>About</a>
          </li>
          <li>
            <a href="#" data-link class="services-link">Services&nbsp;▾</a>
            <ul class="services-submenu">
              <li class="transportation-submenu-wrapper">
                <a
                  href="/services/transportation"
                  data-link
                  class="transportation-link"
                >
                  Transportation▾
                  <ul class="transportation-submenu">
                    <li><a href="/services/transportation/air">Air</a></li>
                    <li><a href="/services/transportation/ocean">Ocean</a></li>
                    <li><a href="/services/transportation/truck">Truck</a></li>
                    <li>
                      <a href="/services/transportation/warehouse">Warehouse</a>
                    </li>
                  </ul>
                </a>
              </li>

              <li class="sporting-link">
                <a href="/services/sporting-goods" data-link>Sporting Goods</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/quote-request/" data-link>Request&nbsp;a&nbsp;Quote</a>
          </li>
          <li class="contact-link">
            <a href="#" class="contact-link">Contact&nbsp;▾</a>
            <ul class="contact-submenu">
              <li><a href="/contact-on" data-link>Ontario Office</a></li>
              <li><a href="/contact-qc" data-link>Quebec Office</a></li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="burger">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
      </div>
    </nav>
  `;

  render(navHtml, navContainer);

  // Need to use CSS to update hover state of a different element
  // than the one I am currently hovering over
  const servicesLink = document.querySelector(".nav-menu > li:nth-child(3)");
  const transportationLink = document.querySelector(".transportation-link");
  const transportationSubmenu = document.querySelector(
    ".transportation-submenu"
  );

  function setUnderlineWidth(width) {
    document.documentElement.style.setProperty(
      "--underline-width",
      width + "px"
    );
  }

  servicesLink.addEventListener("mouseenter", () => setUnderlineWidth(137));
  servicesLink.addEventListener("mouseleave", () => setUnderlineWidth(0));

  transportationLink.addEventListener("mouseenter", () =>
    setUnderlineWidth(228)
  );
  transportationLink.addEventListener("mouseleave", () =>
    setUnderlineWidth(137)
  );

  transportationSubmenu.addEventListener("mouseenter", () =>
    setUnderlineWidth(228)
  );
  transportationSubmenu.addEventListener("mouseleave", () =>
    setUnderlineWidth(0)
  );

  function updateNavOnCurrentPage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll("nav a");

    links.forEach((link) => {
      if (link.childNodes.length == 3) {
        return;
      }
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("currentPage");
      } else {
        link.classList.remove("currentPage");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateNavOnCurrentPage();
  });

  // const burger = document.querySelector(".burger");
  // const nav = document.querySelector(".nav-links");
  // const navLinks = document.querySelectorAll(".nav__link");

  // if (burger) {
  //   initBurgerMenu(burger, nav, navLinks);
  // }

  // ! IMPORTANT - I NEED TO MAKE A COMPLETELY SEPARATE NAVIGATION BAR FOR MOBILE
  // ! THERE ARE TOO MANY DIFFERENCES BETWEEN THE TWO VIEWS THAT IT ALMOST MAKES NO SENSE
  // ! TO MUTATE THE ORIGINAL DESKTOP NAV BAR CAUSES TOO MUCH CONFUSION
}

// Need to re do the mobile responsiveness here -> burger menu
