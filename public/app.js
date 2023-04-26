"use strict";
import renderNavigation from "./views/global-components/navigation/nav.js";
import renderFooter from "./views/global-components/footer/footer.js";

renderNavigation();
renderFooter();

// Home page code
if (window.location.pathname === "/") {
  const heroLogo = document.querySelector(".cgl-logo");

  window.addEventListener("DOMContentLoaded", () => {
    heroLogo.classList.add("active");
  });

  // THREE JS Spinning Globe
  const vertexShaderResponse = await fetch("./views/shaders/vertexShader.glsl");
  const fragmentShaderResponse = await fetch(
    "./views/shaders/fragmentShader.glsl"
  );
  const vertexShader = await vertexShaderResponse.text();
  const fragmentShader = await fragmentShaderResponse.text();

  const atmosphereVertexResponse = await fetch(
    "./views/shaders/atmosphereVertex.glsl"
  );
  const atmosphereFragmentResponse = await fetch(
    "./views/shaders/atmosphereFragment.glsl"
  );

  const atmosphereVertex = await atmosphereVertexResponse.text();
  const atmosphereFragment = await atmosphereFragmentResponse.text();

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
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: {
          value: new THREE.TextureLoader().load("./three-img/earth-uv.jpg"),
        },
      },
    })
  );

  // atmosphere
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVertex,
      fragmentShader: atmosphereFragment,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
  );

  atmosphere.scale.set(1.25, 1.25, 1.25);
  scene.add(atmosphere);

  const group = new THREE.Group();
  group.add(sphere);
  scene.add(group);

  const starGeometry = new THREE.BufferGeometry();

  function createCircleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: true,
    map: createCircleTexture(),
    transparent: true,
    depthWrite: false,
  });

  const starVertices = [];

  for (let i = 0; i < 50000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 10000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(starVertices), 3)
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  camera.position.z = 50;

  const mouse = {
    x: 0,
    y: 0,
  };

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sphere.rotation.y += 0.003;
    gsap.to(group.rotation, {
      x: -mouse.y * 0.5,
      y: mouse.x * 0.5,
      duration: 1,
    });
  }

  animate();

  addEventListener("mousemove", () => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
    console.log(mouse);
  });
}

// flickity

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
