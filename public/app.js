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

  function createPoint(lat, long, delay) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.8),
      new THREE.MeshBasicMaterial({
        color: "#ff0000",
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
      z: 0,
      duration: 2,
      yoyo: true,
      delay: delay,
      repeat: -1,
      ease: "linear",
    });
  }

  createPoint(23.6345, -102.5528, 0);
  createPoint(46.8625, 103.8467, 1);
  createPoint(9.082, 8.6753, 2);
  createPoint(-25.2744, 133.7751, 3);
  createPoint(-14.235, -51.9253, 4);

  sphere.rotation.y = -Math.PI / 2;

  const mouse = {
    x: undefined,
    y: undefined,
  };

  function animateScene() {
    requestAnimationFrame(animateScene);
    renderer.render(scene, camera);
    // group.rotation.y += 0.003;
    if (mouse.x) {
      gsap.to(group.rotation, {
        x: -mouse.y * 0.4,
        y: mouse.x * 0.4,
        duration: 1,
      });
    }
  }

  animateScene();

  addEventListener("mousemove", (event) => {
    mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  });

  // truck moving
  const anim = basicScroll.create({
    elem: document.querySelector(".truck-element"),
    from: "top-bottom",
    to: "top-top",
    direct: true,
    props: {
      "--my-prop": {
        from: "-1000px",
        to: "30px",
      },
    },
  });

  anim.start();

  const path = "M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80";

  const tl = gsap.timeline({ repeat: -1 });

  tl.to(".truck-element", {
    duration: 5,
    motionPath: {
      path: path,
      align: path,
      autoRotate: true,
    },
  });
  // Spinning wheels

  let allWheels = document.querySelectorAll(".wheel");

  allWheels.forEach((wheel) => {
    const anim2 = basicScroll.create({
      elem: wheel,
      from: "top-bottom",
      to: "top-top",
      direct: true,
      props: {
        "--rotation": {
          from: "0",
          to: "4turn",
        },
      },
    });

    anim2.start();
  });

  // background fade

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

  // TRUCK BACKGROUNF CLOUDS
  const canvas = document.getElementById("cloudCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const cloudImage = document.getElementById("cloudImage");

  class Cloud {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = Math.random() * 0.5 + 0.1;
    }

    draw() {
      ctx.drawImage(cloudImage, this.x, this.y, this.size, this.size);
    }

    update() {
      this.x += this.speed;
      if (this.x > canvas.width + this.size) {
        this.x = -this.size;
      }
    }
  }

  class Star {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  const stars2 = [];
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.5 + 0.5;
    stars2.push(new Star(x, y, size));
  }

  const clouds = [];
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * canvas.width - 150;
    const y = Math.random() * canvas.height * 0.5;
    const size = Math.random() * 600 + 90;
    clouds.push(new Cloud(x, y, size));
  }

  let isNight;

  let toggleBtn = document.querySelector("#toggle");

  toggleBtn.addEventListener("change", () => {
    console.log(toggleBtn.checked);
    if (toggleBtn.checked === true) {
      isNight = true;
    }

    if (toggleBtn.checked === false) {
      isNight = false;
    }
  });

  function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!isNight) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#FFFFFF");
      ctx.fillStyle = gradient;

      clouds.forEach((cloud) => {
        cloud.update();
        cloud.draw();
      });

      document.querySelector(".high-beam-light").style.display = "none";
      document.querySelector(".truck-element").style.filter = `brightness(1)`;
      document.querySelector(".truck-bg-inner").style.background = `
    url("./assets/side-road-view.png")`;
    }

    if (isNight) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      document.querySelector(
        ".truck-bg-inner"
      ).style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)),
    url("./assets/side-road-view.png")`;

      document.querySelector(".truck-element").style.filter = `brightness(0.9)`;

      stars2.forEach((star) => {
        star.draw(ctx);
      });

      document.querySelector(".high-beam-light").style.display = "block";
    }

    requestAnimationFrame(updateCanvas);
  }

  updateCanvas();
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
