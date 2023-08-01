"use strict";
import { html, render } from "https://cdn.skypack.dev/lit-html";

export default function renderNavigation() {
  let navContainer = document.querySelector("#navigation");
  let navHtml = html`
    <nav class="desktop-nav">
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
                  Transportation▾</a>
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
              <li><a href="/contact/contact-on" data-link>Ontario Office</a></li>
              <li><a href="/contact/contact-qc" data-link>Quebec Office</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  `;

  let mobileNavHtml = html`
    <nav class="mobile-nav">
      <ul>
        <li><a href="/">Home</a></li>
        <li class="about-list-item">
          <a href="/about" class="about-link-mobile" data-link>About</a>
        </li>
        <li class="services-list-item">
          <a href="#" data-link class="services-link-mobile">Services&nbsp;▾</a>
          <ul class="services-submenu-mobile">
            <li class="transportation-list-item">
              <a href="#" id="transportation-link-mobile"
                >Transportation&nbsp;▾</a
              >
              <ul class="transportation-submenu-mobile">
                <li style="padding-top: 1.2rem;">
                  <a href="/services/transportation">• Overview</a>
                </li>
                <li style="padding-top: 1.2rem;">
                  <a href="/services/transportation/air">• Air</a>
                </li>
                <li style="padding-top: 0.8rem;">
                  <a href="/services/transportation/ocean">• Ocean</a>
                </li>
                <li style="padding-top: 0.8rem;">
                  <a href="/services/transportation/truck">• Truck</a>
                </li>
                <li style="padding-top: 0.8rem;">
                  <a href="/services/transportation/warehouse">• Warehouse</a>
                </li>
              </ul>
            </li>
            <li class="sporting-list-item">
              <a
                class="sporting-goods-mobile"
                href="/services/sporting-goods"
                data-link
                >Sporting Goods</a
              >
            </li>
          </ul>
        </li>

        <li class="quote-request-list-item">
          <a href="/quote-request/" data-link id="quote-mobile"
            >Request&nbsp;a&nbsp;Quote</a
          >
        </li>
        <li class="contact-menu-mobile">
          <a href="#" class="contact-link-mobile">Contact&nbsp;▾</a>
          <ul class="contact-submenu-mobile">
            <li style="padding-top: 1.2rem;">
              <a href="/contact/contact-on" data-link>• Ontario Office</a>
            </li>
            <li style="padding-top: 0.8rem;">
              <a href="/contact/contact-qc" data-link>• Quebec Office</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <button class="nav-toggle">
      <div class="line1">&nbsp;</div>
      <div class="line2">&nbsp;</div>
      <div class="line3">&nbsp;</div>
    </button>
  `;

  let combinedHTML = html`${navHtml}${mobileNavHtml}`;
  render(combinedHTML, navContainer);

  const transportationLinkMobile = document.querySelector(
    "#transportation-link-mobile"
  );

  const transportationSubmenuMobile = document.querySelector(
    ".transportation-submenu-mobile"
  );

  const quoteListItem = document.querySelector(".quote-request-list-item");
  const aboutListItem = document.querySelector(".about-list-item");
  const transportationListItem = document.querySelector(
    ".transportation-list-item"
  );
  const sportingListItem = document.querySelector(".sporting-list-item");
  const servicesListItem = document.querySelector(".services-list-item");

  transportationLinkMobile.addEventListener("click", () => {
    setTimeout(() => {
      console.log(sportingListItem);
      const isTransportationExpanded =
        transportationSubmenuMobile.classList.contains("active");
      if (isTransportationExpanded) {
        quoteListItem.style.marginTop = "2.4rem";
        aboutListItem.style.marginTop = "2.4rem";
        transportationListItem.style.marginTop = "2.4rem";
        sportingListItem.style.marginTop = "2.4rem";
        servicesListItem.style.marginTop = "2.4rem";
      }
      if (!isTransportationExpanded) {
        quoteListItem.style.marginTop = "0";
        aboutListItem.style.marginTop = "0";
        servicesListItem.style.marginTop = "0";
      }
    }, 0);
  });

  let contactLinkMobile = document.querySelector(".contact-link-mobile");
  let contactSubmenuMobile = document.querySelector(".contact-submenu-mobile");
  const contactMenuListItem = document.querySelector(".contact-menu-mobile");

  contactLinkMobile.addEventListener("click", () => {
    setTimeout(() => {
      const isContactExpanded =
        contactSubmenuMobile.classList.contains("active");
      if (isContactExpanded) {
        contactMenuListItem.style.marginTop = "1.2rem";
      }
      if (!isTransportationExpanded) {
        contactMenuListItem.style.marginTop = "0";
      }
    }, 0);
  });

  const servicesLinkMobile = document.querySelector(".services-link-mobile");
  const servicesSubmenu = document.querySelector(".services-submenu-mobile");

  servicesLinkMobile.addEventListener("click", (event) => {
    event.preventDefault();

    const isTransportationExpanded =
      transportationSubmenuMobile.classList.contains("active");

    if (isTransportationExpanded) {
      transportationSubmenuMobile.classList.remove("active");
    }

    servicesSubmenu.classList.toggle("services-active");
  });

  transportationLinkMobile.addEventListener("click", (e) => {
    e.preventDefault();
    transportationSubmenuMobile.classList.toggle("active");
  });

  contactLinkMobile.addEventListener("click", (e) => {
    e.preventDefault();
    contactSubmenuMobile.classList.toggle("active");
  });

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

  servicesLink.addEventListener("mouseenter", () => setUnderlineWidth(145));
  servicesLink.addEventListener("mouseleave", () => setUnderlineWidth(0));

  transportationLink.addEventListener("mouseenter", () =>
    setUnderlineWidth(249)
  );
  transportationLink.addEventListener("mouseleave", () =>
    setUnderlineWidth(145)
  );

  transportationSubmenu.addEventListener("mouseenter", () =>
    setUnderlineWidth(249)
  );
  transportationSubmenu.addEventListener("mouseleave", () =>
    setUnderlineWidth(145)
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

  const mobileNav = document.querySelector(".mobile-nav");
  let navToggle = document.querySelector(".nav-toggle");

  // if the mobile nav is toggled on, and I resize the window it will
  // close the mobile nav and reset the burger menu button
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 820) {
      mobileNav.classList.remove("show");
      if (navToggle) {
        navToggle.classList.remove("toggle-on");
      }
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    updateNavOnCurrentPage();

    let burgerLines = document.querySelectorAll(".nav-toggle div");
    const isHomePage = window.location.pathname === "/";
    const isToggledOn = navToggle.classList.contains("toggle-on");

    if (isHomePage) {
      burgerLines.forEach((line) => {
        line.style.backgroundColor = "#eeeeee";
      });
    }

    const isMobile = window.matchMedia(
      "only screen and (max-width: 820px)"
    ).matches;
    const clickEvent = isMobile ? "touchstart" : "click";

    navToggle.addEventListener(clickEvent, function () {
      document.querySelector(".mobile-nav").classList.toggle("show");

      navToggle.classList.toggle("toggle-on");

      const isToggledOn = navToggle.classList.contains("toggle-on");

      // Look into this margin issue
      if (isToggledOn) {
        burgerLines.forEach((line) => {
          line.style.margin = "6px 0px";
        });
      } else {
        burgerLines.forEach((line) => {
          line.style.margin = "4px 0px";
        });
      }

      if (isHomePage && isToggledOn) {
        burgerLines.forEach((line) => {
          line.style.backgroundColor = "#333333";
        });
      }

      if (isHomePage && !isToggledOn) {
        burgerLines.forEach((line) => {
          line.style.backgroundColor = "#eeeeee";
        });
      }
    });
  });
}

// Need to re do the mobile responsiveness here -> burger menu
