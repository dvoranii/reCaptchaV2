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
  let camera = new THREE.PerspectiveCamera(
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

  let sphere = null;
  let atmosphere = null;
  let group = new THREE.Group();

  function createSphere(radius) {
    // Remove the old sphere from the group, if it exists
    if (sphere) {
      group.remove(sphere);
    }

    // Remove the old atmosphere from the scene, if it exists
    if (atmosphere) {
      scene.remove(atmosphere);
    }

    sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 50, 50),
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

    atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 50, 50),
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })
    );

    atmosphere.scale.set(1.25, 1.25, 1.25);

    group.add(sphere);
    scene.add(atmosphere);
    scene.add(group);
  }

  function handleResizeAndCreateSphere() {
    let radius;
    if (window.innerWidth <= 820) {
      radius = 3.5;
    } else {
      radius = 5;
    }
    createSphere(radius);
  }

  handleResizeAndCreateSphere();

  // Creating
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

  for (let i = 0; i < 90000; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const y = (Math.random() - 0.5) * 1500;
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

  let boxes = [];
  function createBox({ lat, long, country, flag }) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.15, 0.6),
      new THREE.MeshBasicMaterial({
        color: "#3bf7ff",
        opacity: 0.4,
        transparent: true,
      })
    );

    let radius;
    if (window.innerWidth <= 820) {
      // small screens
      radius = 3.5;
    } else {
      // large screens
      radius = 5;
    }

    const latitude = (lat / 180) * Math.PI;
    const longitude = (long / 180) * Math.PI;
    // const radius = 5;

    boxes.push({ box, lat, long });

    const x = radius * Math.cos(latitude) * Math.sin(longitude);
    const y = radius * Math.sin(latitude);
    const z = radius * Math.cos(latitude) * Math.cos(longitude);

    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    box.lookAt(0, 0, 0);
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.3));

    group.add(box);

    gsap.fromTo(
      box.scale,
      { z: 0 }, // start scale
      {
        z: 1.6, // end scale
        duration: 2,
        yoyo: true,
        delay: Math.random(),
        repeat: -1,
        ease: "linear",
      }
    );

    box.country = country;
    box.flag = flag;
  }

  // Going to add a tooltip on hover
  // City and country name with flag
  createBox({
    lat: 19.4326,
    long: -99.1332,
    country: "Mexico City,<br> Mexico",
    flag: "./assets/mexico-flag.png",
  });
  createBox({
    lat: 43.65107,
    long: 79.347015,
    country: "Toronto, Canada",
    flag: "./assets/canada-flag.png",
  });
  createBox({
    lat: 6.5244,
    long: 3.3792,
    country: "Lagos, Nigeria",
    flag: "./assets/nigeria-flag.png",
  });
  createBox({
    lat: -33.8688,
    long: 151.2093,
    country: "Sydney, Australia",
    flag: "./assets/australia-flag.png",
  });
  createBox({
    lat: -23.5505,
    long: -46.6333,
    country: "Sao Paulo,<br> Brazil",
    flag: "./assets/brazil-flag.png",
  });
  createBox({
    lat: -33.9249,
    long: 18.4241,
    country: "Cape Town,<br> South Africa",
    flag: "./assets/SA-flag.png",
  });
  createBox({
    lat: 48.8566,
    long: 2.3522,
    country: "Paris,<br> France",
    flag: "./assets/FR-flag.png",
  });
  createBox({
    lat: 40.7128,
    long: -74.006,
    country: "New York City,<br> USA",
    flag: "./assets/US-flag.png",
  });
  createBox({
    lat: 35.6895,
    long: 139.6917,
    country: "Tokyo,<br> Japan",
    flag: "./assets/JP-flag.png",
  });

  sphere.rotation.y = -Math.PI / 2;

  const mouse = {
    x: undefined,
    y: undefined,
  };

  const raycaster = new THREE.Raycaster();

  const globeTooltip = document.querySelector(".globe-tooltip");
  const cityEl = document.getElementById("cityEl");
  const flagEl = document.getElementById("flagEl");

  function animateScene() {
    requestAnimationFrame(animateScene);
    renderer.render(scene, camera);
    group.rotation.y += 0.002;

    // if (mouse.x) {
    //   gsap.to(group.rotation, {
    //     x: -mouse.y * 0.4,
    //     y: mouse.x * 0.4,
    //     duration: 1,
    //   });
    // }

    renderer.render(scene, camera);
  }

  animateScene();

  addEventListener("mousemove", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    gsap.set(globeTooltip, {
      x: event.clientX,
      y: event.clientY,
    });

    raycaster.setFromCamera(mouse, camera);

    const boxMeshes = group.children.filter(
      (mesh) => mesh.geometry.type === "BoxGeometry"
    );

    boxMeshes.forEach((box) => {
      box.material.opacity = 0.4;
    });

    const intersects = raycaster.intersectObjects(boxMeshes);

    gsap.set(globeTooltip, {
      display: "none",
    });

    for (let i = 0; i < intersects.length; i++) {
      const box = intersects[i].object;
      intersects[i].object.material.opacity = 1;
      gsap.set(globeTooltip, {
        display: "flex",
      });

      cityEl.innerHTML = box.country;
      flagEl.src = box.flag;
    }
  });

  addEventListener("resize", () => {
    handleResizeAndCreateSphere();

    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);

    camera = new THREE.PerspectiveCamera(
      17,
      canvasContainer.offsetWidth / canvasContainer.offsetHeight,
      0.1,
      1000
    );

    camera.position.z = 50;

    let radius;
    if (window.innerWidth <= 820) {
      // small screens
      radius = 3.5;
    } else {
      // large screens
      radius = 5;
    }

    // Update the position of each box based on the new radius
    // might refactor this to look like the handleResizeAndCreateSphere() function
    boxes.forEach(({ box, lat, long }) => {
      const latitude = (lat / 180) * Math.PI;
      const longitude = (long / 180) * Math.PI;

      const x = radius * Math.cos(latitude) * Math.sin(longitude);
      const y = radius * Math.sin(latitude);
      const z = radius * Math.cos(latitude) * Math.cos(longitude);

      box.position.x = x;
      box.position.y = y;
      box.position.z = z;
    });
  });

  const anim3 = basicScroll.create({
    elem: document.querySelector(".bg"),
    from: "viewport-top",
    to: "top-top",
    direct: true,
    duration: 1000,
    props: {
      "--bg-opacity": {
        from: "1",
        to: "0.01",
      },
    },
  });

  anim3.start();
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
