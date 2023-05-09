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

  function createPoint(lat, long) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.8),
      new THREE.MeshBasicMaterial({
        color: "#3bf7ff",
        opacity: 0.4,
        transparent: true,
      })
    );

    const latitude = (lat / 180) * Math.PI;
    const longitude = (long / 180) * Math.PI;
    const radius = 5;

    const x = radius * Math.cos(latitude) * Math.sin(longitude);
    const y = radius * Math.sin(latitude);
    const z = radius * Math.cos(latitude) * Math.cos(longitude);

    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    box.lookAt(0, 0, 0);
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4));

    group.add(box);

    // box.scale.z = 0;

    gsap.to(box.scale, {
      z: 1.4,
      duration: 2,
      yoyo: true,
      delay: Math.random(),
      repeat: -1,
      ease: "linear",
    });
  }

  createPoint(23.6345, -102.5528);
  createPoint(46.8625, 103.8467);
  createPoint(9.082, 8.6753);
  createPoint(-25.2744, 133.7751);
  createPoint(-14.235, -51.9253);
  createPoint(-30.5595, 22.9375);

  sphere.rotation.y = -Math.PI / 2;

  const mouse = {
    x: undefined,
    y: undefined,
  };

  const raycaster = new THREE.Raycaster();

  function animateScene() {
    requestAnimationFrame(animateScene);
    renderer.render(scene, camera);
    group.rotation.y += 0.003;
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

    raycaster.setFromCamera(mouse, camera);

    const boxMeshes = group.children.filter(
      (mesh) => mesh.geometry.type === "BoxGeometry"
    );

    boxMeshes.forEach((box) => {
      box.material.opacity = 0.4;
    });

    const intersects = raycaster.intersectObjects(boxMeshes);

    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material.opacity = 1;
    }
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
