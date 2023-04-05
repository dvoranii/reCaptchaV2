"use strict";
import renderNavigation from "./views/global-components/navigation/nav.js";
import renderFooter from "./views/global-components/footer/footer.js";

renderNavigation();
renderFooter();

document.addEventListener("DOMContentLoaded", function () {
  const flickityElem = document.querySelector(".carousel");

  if (!flickityElem) return;
  console.log("hello");
  var flickity = new Flickity(flickityElem, {
    cellAlign: "left",
    contain: true,
    autoPlay: 3000,
    friction: 0.8, // Adjust this value to change the scroll speed
    selectedAttraction: 0.03,
    // wrapAround: true,
  });
});
