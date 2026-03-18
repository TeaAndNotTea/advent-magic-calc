// This file is enqueued as type=module, but we’re using the global object
// created by wizard.js to keep it simple and dependency-free.
(function () {
  function init() {
    if (!window.CCAWizardCode || typeof window.CCAWizardCode.wireAll !== "function") return;
    window.CCAWizardCode.wireAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

