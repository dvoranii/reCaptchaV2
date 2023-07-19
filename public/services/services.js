let video = document.querySelector(".hockey-video");
let hockeyVideoWrapper = document.querySelector(".hockey-video-wrapper");
let testP = document.querySelector(".test-p");

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
    } else {
      video.pause();
      video.currentTime = 0;
      testP.classList.remove("animate-text");
    }
  });
}

observer.observe(hockeyVideoWrapper);
