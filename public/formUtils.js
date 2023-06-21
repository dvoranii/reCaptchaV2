export function handleCaptcha() {
  const captcha = document.querySelector(".g-recaptcha");
  let captchaRes;

  window.onload = function () {
    if (captcha) {
      captchaRes = document.querySelector("#g-recaptcha-response");
    }
  };

  return {
    captcha,
    getCaptchaRes: () => captchaRes,
  };
}

export function sanitizeInput(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function fetchAndSetCsrfToken(inputElementId) {
  fetch("/csrf-token")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const csrfInput = document.getElementById(inputElementId);
      if (csrfInput) {
        csrfInput.value = data.csrfToken;
      }
    });
}

export function getCsrfToken(inputElementId) {
  const csrfTokenInput = document.getElementById(inputElementId);
  return csrfTokenInput ? csrfTokenInput.value : null;
}
