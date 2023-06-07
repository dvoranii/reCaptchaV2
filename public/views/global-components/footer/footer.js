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
          <li>
            <a href="/">Home</a
            ><span style="font-size: 14px" class="divider"> |</span>
          </li>
          <li>
            <a href="/about">About</a
            ><span style="font-size: 14px" class="divider"> |</span>
          </li>
          <li>
            <a href="/services/transportation">Transportation</a
            ><span style="font-size: 14px" class="divider"> |</span>
          </li>
          <li>
            <a href="/services/sporting-goods">Sporting&nbsp;Goods</a
            ><span style="font-size: 14px" class="divider"> |</span>
          </li>
          <li>
            <a href="/quote-request">Request&nbsp;a&nbsp;Quote</a
            ><span style="font-size: 14px" class="divider"> |</span>
          </li>
          <li><a href="/contact-on">Contact</a></li>
        </ul>
      </div>
    </div>

    <div class="legal">
      <p>
        Copyright &copy; 2021 &mdash; Canadian Global Logistics Inc.<sup>®</sup>
        &mdash; All Rights Reserved.
      </p>
      <p>Located in Ontario, Canada</p>
    </div>
  `;

  render(footerHtml, footerContainer);
}
