export function generateCSRFToken() {
  const csrfToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem("csrfToken", csrfToken);
  return csrfToken;
}

export function getCSRFToken() {
  return sessionStorage.getItem("csrfToken");
}

export function handleCaptchaAndCSRFToken() {
  const captcha = document.querySelector(".g-recaptcha");
  let captchaRes;
  let csrfToken;

  window.onload = function () {
    if (captcha) {
      captchaRes = document.querySelector("#g-recaptcha-response");
      csrfToken = generateCSRFToken();
      let csrfTokenEl = document.getElementById("csrf-token");
      if (csrfTokenEl) {
        csrfTokenEl.value = csrfToken;
      }
    }
  };

  return {
    getCaptchaRes: () => captchaRes,
    getCsrfToken: () => csrfToken,
  };
}

export function sanitizeInput(input) {
  console.log("working");
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
