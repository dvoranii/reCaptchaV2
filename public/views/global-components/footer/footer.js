"use-strict";
import { html, render } from "https://cdn.skypack.dev/lit-html";

export default function renderFooter() {
  let footerContainer = document.querySelector(".footer-container");
  let footerHtml = html`
    <div class="logo-nav-container">
      <div class="footer-logo">
        <img src="/assets/CGL-logo.png" alt="Logo" />
      </div>

      <div class="footer-nav-container">
        <ul class="footer-nav">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>

          <li><a href="/quote-request">Request a Quote</a></li>
          <li><a href="/contact-on">Contact</a></li>
        </ul>
      </div>
    </div>

    <div class="legal">
      <p>Copyright &copy; 2021 XYZ Inc. All Rights Reserved.</p>
      <p>Located in Ontario, Canada</p>
    </div>
  `;

  render(footerHtml, footerContainer);
}
