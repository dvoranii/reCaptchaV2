"use strict";
import renderNavigation from "./views/global-components/navigation/nav.js";
import renderFooter from "./views/global-components/footer/footer.js";
// import Flickity from "/flickity.js";
// import Flickity from "https://cdn.skypack.dev/flickity";

renderNavigation();
renderFooter();

// Home page flickity carousel

document.addEventListener("DOMContentLoaded", function () {
  const flickityElem = document.querySelector(".carousel");

  if (flickityElem) {
    console.log("hello");
    var flickity = new Flickity(flickityElem, {
      cellAlign: "left",
      contain: true,
    });
    console.log(flickity);
  }
});
