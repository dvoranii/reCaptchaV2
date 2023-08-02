"use strict";
import renderNavigation from "./global-components/navigation/nav.js";
import renderFooter from "./global-components/footer/footer.js";

renderNavigation();
renderFooter();

//   window.matchMedia("(min-width: 481px)").matches || window.innerWidth > 480

// Home page code
if (window.location.pathname === "/") {
  const heroLogo = document.querySelector(".cgl-logo");

  window.addEventListener("DOMContentLoaded", () => {
    heroLogo.classList.add("active");
    let cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      VanillaTilt.init(card, {
        max: 10,
        speed: 300,
        glare: true,
        "max-glare": 0.8,
        reverse: true,
        reset: true,
      });
    });

    const flickityElem = document.querySelector(".home-carousel");

    if (!flickityElem) return;
    var flickity = new Flickity(flickityElem, {
      cellAlign: "left",
      autoPlay: false,
      friction: 0.8,
      selectedAttraction: 0.03,
      lazyLoad: true,
    });
  });

  // THREE JS Spinning Globe
  const vertexShaderResponse = await fetch("./shaders/vertexShader.glsl");
  const fragmentShaderResponse = await fetch("./shaders/fragmentShader.glsl");
  const vertexShader = await vertexShaderResponse.text();
  const fragmentShader = await fragmentShaderResponse.text();

  const atmosphereVertexResponse = await fetch(
    "./shaders/atmosphereVertex.glsl"
  );
  const atmosphereFragmentResponse = await fetch(
    "./shaders/atmosphereFragment.glsl"
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

  let initialSphereRotation = new THREE.Euler();

  function createSphere(radius) {
    if (sphere) {
      initialSphereRotation.copy(sphere.rotation);
      group.remove(sphere);
    }

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

    sphere.rotation.copy(initialSphereRotation);

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
      radius = 3.5;
    } else {
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
      { z: 0 },
      {
        z: 1.6,
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

  createBox({
    lat: 19.4326,
    long: -99.1332,
    country: "Mexico City,<br> Mexico",
    flag: "./assets/mexico-flag.png",
  });

  createBox({
    lat: 43.65107,
    long: -79.347015,
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
      radius = 3.5;
    } else {
      radius = 5;
    }

    boxes.forEach(({ box, lat, long }) => {
      // let { x, y, z } = box.relativePos;
      const latitude = (lat / 180) * Math.PI;
      const longitude = (long / 180) * Math.PI;

      const x = radius * Math.cos(latitude) * Math.sin(longitude);
      const y = radius * Math.sin(latitude);
      const z = radius * Math.cos(latitude) * Math.cos(longitude);

      // x *= radius;
      // y *= radius;
      // z *= radius;

      box.position.x = x;
      box.position.y = y;
      box.position.z = z;
    });
  });

  // Only use basic scroll on tablet and desktop
  // will test if it works on tablet
  if (
    window.matchMedia("(min-width: 481px)").matches ||
    window.innerWidth > 480
  ) {
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

    // rectangle grid
    const gridPattern1 = document.querySelector(".scroll-img");
    const gridPattern2 = document.querySelector(".scroll-img-2");

    const gridPattern3 = document.querySelector(".scroll-img_last");
    const gridPattern4 = document.querySelector(".scroll-img-2_last");

    const scrollImgInstance1 = basicScroll.create({
      elem: gridPattern1,
      from: "top-bottom",
      to: "bottom-top",
      direct: true,
      props: {
        "--translateX": {
          from: "0vw",
          to: "20vw",
        },
      },
    });

    scrollImgInstance1.start();

    const scrollImgInstance2 = basicScroll.create({
      elem: gridPattern2,
      from: "top-bottom",
      to: "bottom-top",
      direct: true,
      props: {
        "--translateX": {
          from: "-20vw",
          to: "0vw",
        },
      },
    });

    scrollImgInstance2.start();

    // =========================

    const scrollImgInstance3 = basicScroll.create({
      elem: gridPattern3,
      from: "top-bottom",
      to: "bottom-top",
      direct: true,
      props: {
        "--translateX": {
          from: "0vw",
          to: "20vw",
        },
      },
    });

    scrollImgInstance3.start();

    const scrollImgInstance4 = basicScroll.create({
      elem: gridPattern4,
      from: "top-bottom",
      to: "bottom-top",
      direct: true,
      props: {
        "--translateX": {
          from: "-20vw",
          to: "0vw",
        },
      },
    });

    scrollImgInstance4.start();

    document.querySelectorAll(".card").forEach((card, i) => {
      basicScroll
        .create({
          elem: card,
          from: "top-bottom",
          to: "bottom-center",
          direct: true,
          props: {
            "--shadowOpacity": {
              from: "0.1",
              to: "0.6",
            },
            "--shadowBlur": {
              from: "5px",
              to: "25px",
            },

            "--imgOpacity": {
              from: "0",
              to: "1",
            },
          },
        })
        .start();
    });

    document.querySelectorAll(".card img").forEach((cardImg, i) => {
      basicScroll
        .create({
          elem: cardImg,
          from: "top-bottom",
          to: "bottom-center",
          direct: true,
          props: {
            "--imgBrightness": {
              from: "1",
              to: "1.1",
            },

            "--imgSize": {
              from: "1",
              to: "1.25",
            },
          },
        })
        .start();
    });

    const logoWrapper = document.querySelector(".logo-wrapper");
    scrollImgInstance1.start();
    const bgDarken = basicScroll.create({
      elem: logoWrapper,
      from: "top-bottom",
      to: "top-center",
      direct: true,
      props: {
        "--bgOpacity": {
          from: "0",
          to: "0.45",
        },
      },
    });

    bgDarken.start();
  }

  const cglLogo = document.querySelector(".logistics-deal-logo");

  // let observer = new IntersectionObserver(
  //   (entries, observer) => {
  //     entries.forEach((entry) => {
  //       if (entry.intersectionRatio > 0.5) {
  //         entry.target.classList.add("logo-visible");
  //       } else {
  //         entry.target.classList.remove("logo-visible");
  //       }
  //     });
  //   },
  //   {
  //     root: null,
  //     rootMargin: "-150px",
  //     threshold: 0.5,
  //   }
  // );

  // observer.observe(cglLogo);
}

// vercel environment: /services/transportation/warehouse
// dev env includes trailing /

if (window.location.pathname === "/services/transportation/warehouse") {
  document.addEventListener("DOMContentLoaded", function () {
    const flickityElem = document.querySelector(".carousel");

    if (!flickityElem) return;
    var flickity = new Flickity(flickityElem, {
      cellAlign: "left",
      contain: true,
      autoPlay: 4000,
      friction: 0.8,
      selectedAttraction: 0.03,
      lazyLoad: true,
    });
  });
}
