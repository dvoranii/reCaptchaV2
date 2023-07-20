let video = document.querySelector(".hockey-video");
let hockeyVideoWrapper = document.querySelector(".hockey-video-wrapper");
let testP = document.querySelector(".test-p");
let testP2 = document.querySelector(".test-p-2");

let backgroundDiv1 = document.querySelector(".background-div-1");
let backgroundDiv2 = document.querySelector(".background-div-2");
let backgroundDiv3 = document.querySelector(".background-div-3");

const logo = document.querySelector(".hockey-vid-logo");

let options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

let observer = new IntersectionObserver(handleIntersect, options);

function handleIntersect(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      video.play();

      testP.classList.add("animate-text");

      setTimeout(() => {
        testP.classList.add("fade-out");
        setTimeout(() => {
          testP2.classList.add("animate-text");
          backgroundDiv1.classList.add("animate-after");
          backgroundDiv2.classList.add("animate-after");

          // Add fade-in animation to backgroundDiv3 after 4.5 seconds
          setTimeout(() => {
            backgroundDiv3.classList.add("fade-in-only");
            setTimeout(() => {
              logo.classList.add("fade-in-logo");
            }, 500);
          }, 3750);
        }, 2500);
      }, 1500);

      backgroundDiv1.classList.add("animate-after");
    } else {
      video.pause();
      video.currentTime = 0;
      testP.classList.remove("animate-text");
      testP2.classList.remove("animate-text");
      testP.classList.remove("fade-out");
      testP2.classList.remove("fade-out");
      backgroundDiv1.classList.remove("animate-after");
      backgroundDiv2.classList.remove("animate-after");
      backgroundDiv3.classList.remove("fade-in-only");
      logo.classList.remove("fade-in-logo");
    }
  });
}

observer.observe(hockeyVideoWrapper);
