(function () {
  "use strict";

  const DEFAULT_MAGNM = 11111;

  function isFiveLettersAZ(s) {
    return /^[A-Za-z]{5}$/.test(s);
  }

  // Adventure wizard_() time mangling:
  // t = minutes past midnight (local)
  // t = (t/60)*40 + (t/10)*10, integer math
  function mangledTimeValue(dateObj = new Date()) {
    const t0 = dateObj.getHours() * 60 + dateObj.getMinutes();
    return Math.floor(t0 / 60) * 40 + Math.floor(t0 / 10) * 10;
  }

  // Compute response expected by the game from the printed 5-letter challenge.
  function computeWizardResponse(challenge, magnm = DEFAULT_MAGNM, dateObj = new Date()) {
    const w = String(challenge || "").trim().toUpperCase();
    if (!isFiveLettersAZ(w)) {
      throw new Error("Challenge must be exactly 5 letters A–Z.");
    }

    // A..Z => 1..26 (matches '@'+val scheme in the f2c code)
    const val = Array.from(w, (ch) => ch.charCodeAt(0) - 64);

    let t = mangledTimeValue(dateObj);
    let d = Number.isFinite(Number(magnm)) ? Math.trunc(Number(magnm)) : DEFAULT_MAGNM;

    let out = "";
    for (let y = 0; y < 5; y++) {
      const z = (y + 1) % 5; // z__ = y%5 + 1 in 1-based
      const x = ((Math.abs(val[y] - val[z]) * (d % 10) + (t % 10)) % 26) + 1;
      out += String.fromCharCode(64 + x); // '@'+x => 'A'..'Z'
      t = Math.floor(t / 10);
      d = Math.floor(d / 10);
    }
    return out;
  }

  function wireOne(root) {
    if (!root || root.__ccaWired) return;
    root.__ccaWired = true;

    const magnm = parseInt(root.getAttribute("data-magnm") || "", 10) || DEFAULT_MAGNM;
    const input = root.querySelector(".cca-challenge");
    const btn = root.querySelector(".cca-generate");
    const out = root.querySelector(".cca-result");

    if (!input || !btn || !out) return;

    const run = () => {
      try {
        out.textContent = "Response: " + computeWizardResponse(input.value, magnm, new Date());
      } catch (e) {
        out.textContent = e?.message ? e.message : String(e);
      }
    };

    btn.addEventListener("click", run);
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") run();
    });
  }

  function wireAll() {
    document.querySelectorAll(".cca-wizard-code").forEach(wireOne);
  }

  // Export a tiny API for play.js
  window.CCAWizardCode = {
    computeWizardResponse,
    mangledTimeValue,
    wireAll,
  };
})();

