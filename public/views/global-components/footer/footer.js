"use-strict";

let footerContainer = document.querySelector(".footer-container");

export default function getFooter() {
  fetch("/views/global-components/footer/footer.html")
    .then((res) => res.text())
    .then((footerHtml) => {
      footerContainer.innerHTML = footerHtml;

      console.log(footerHtml);
    });
}
