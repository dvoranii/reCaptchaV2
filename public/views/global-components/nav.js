const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav__link");

if (burger) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");

    console.log("clicked");
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
