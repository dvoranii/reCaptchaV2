"use strict";
import renderNavigation from "./views/global-components/navigation/nav.js";
import renderFooter from "./views/global-components/footer/footer.js";

// import vertexShader from "./views/shaders/vertex.glsl";

renderNavigation();
renderFooter();

const heroLogo = document.querySelector(".cgl-logo");

window.addEventListener("DOMContentLoaded", () => {
  heroLogo.classList.add("active");
});

// THREE JS Spinning Globe
const canvasContainer = document.querySelector("#canvasContainer");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  17,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas"),
});

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./three-img/earth-uv.jpg"),
  })
);

scene.add(sphere);
camera.position.z = 50;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// document.addEventListener("DOMContentLoaded", function () {
//   const flickityElem = document.querySelector(".carousel");

//   if (!flickityElem) return;
//   var flickity = new Flickity(flickityElem, {
//     cellAlign: "left",
//     contain: true,
//     autoPlay: 3000,
//     friction: 0.8, // Adjust this value to change the scroll speed
//     selectedAttraction: 0.03,
//     // wrapAround: true,
//   });
// });

// THREE JS
