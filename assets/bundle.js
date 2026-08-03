(function() {
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize settings from localStorage or defaults
    let currentFontSize = parseInt(localStorage.getItem('userFontSize'), 10) || 16;
    let currentLineSpacing = parseFloat(localStorage.getItem('userLineSpacing')) || 1.5;

    // We apply settings to a specific container if we only want text to scale,
    // or to document.documentElement (html) if we want to use rem scaling.
    // For general font size and line height scaling without breaking everything,
    // applying to body or main content is often safest.
    // Here we apply to :root (html) variables or body.
    const root = document.documentElement;

    function applySettings() {
      // Apply directly to body for simplicity
      document.body.style.fontSize = `${currentFontSize}px`;
      document.body.style.lineHeight = `${currentLineSpacing}`;

      // Save to localStorage
      localStorage.setItem('userFontSize', currentFontSize);
      localStorage.setItem('userLineSpacing', currentLineSpacing);
    }

    // Apply initially
    applySettings();

    // 2. Setup event listeners
    const btnFontDec = document.getElementById('btn-font-dec');
    const btnFontInc = document.getElementById('btn-font-inc');
    const btnLineDec = document.getElementById('btn-line-dec');
    const btnLineInc = document.getElementById('btn-line-inc');

    // Helper to handle clicks safely inside <summary>
    function handleSettingClick(btn, handler) {
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        // Prevent expanding/collapsing the <details>
        e.preventDefault();
        e.stopPropagation();
        handler();
      });
    }

    handleSettingClick(btnFontDec, () => {
      if (currentFontSize > 10) { // Min font size
        currentFontSize -= 1;
        applySettings();
      }
    });

    handleSettingClick(btnFontInc, () => {
      if (currentFontSize < 36) { // Max font size
        currentFontSize += 1;
        applySettings();
      }
    });

    handleSettingClick(btnLineDec, () => {
      if (currentLineSpacing > 1.0) { // Min line spacing
        currentLineSpacing -= 0.1;
        // Fix floating point precision issues
        currentLineSpacing = Math.round(currentLineSpacing * 10) / 10;
        applySettings();
      }
    });

    handleSettingClick(btnLineInc, () => {
      if (currentLineSpacing < 3.0) { // Max line spacing
        currentLineSpacing += 0.1;
        currentLineSpacing = Math.round(currentLineSpacing * 10) / 10;
        applySettings();
      }
    });
  });
})();
