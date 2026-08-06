document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // 1. FONT SIZE
  const sizeResetBtn = document.getElementById('size-reset');
  const setSize = (newSize) => {
    const size = Math.min(Math.max(newSize, 0.8), 1.4);
    root.style.setProperty('--font-size', `${size.toFixed(1)}rem`);
    localStorage.setItem('user-font-size', size.toFixed(1));
    if (sizeResetBtn) sizeResetBtn.textContent = `${Math.round(size * 100)}%`;
  };

  const initialSize = parseFloat(localStorage.getItem('user-font-size')) || 1.0;
  setSize(initialSize);

  document.getElementById('size-up')?.addEventListener('click', () => {
    const curr = parseFloat(localStorage.getItem('user-font-size')) || 1.0;
    setSize(curr + 0.1);
  });
  document.getElementById('size-down')?.addEventListener('click', () => {
    const curr = parseFloat(localStorage.getItem('user-font-size')) || 1.0;
    setSize(curr - 0.1);
  });
  sizeResetBtn?.addEventListener('click', () => setSize(1.0));


  // 2. FONT FAMILY (Clean & Direct)
  const fontSelect = document.getElementById('font-family');
  if (fontSelect) {
    // Priority: Saved LocalStorage Value -> Current Dropdown Value -> First Option
    const activeFont = localStorage.getItem('user-font-family') || fontSelect.value;
    
    // Apply font to CSS variable & ensure dropdown matches
    root.style.setProperty('--font-family', activeFont);
    fontSelect.value = activeFont;

    fontSelect.addEventListener('change', (e) => {
      root.style.setProperty('--font-family', e.target.value);
      localStorage.setItem('user-font-family', e.target.value);
    });
  }


  // 3. LINE SPACING
  const spacingBtns = document.querySelectorAll('.spacing-btn');
  const setLineHeight = (lh) => {
    root.style.setProperty('--line-height', lh);
    localStorage.setItem('user-line-height', lh);
    spacingBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lh === String(lh)));
  };

  const initialLh = localStorage.getItem('user-line-height') || '1.6';
  setLineHeight(initialLh);

  spacingBtns.forEach(btn => {
    btn.addEventListener('click', () => btn.dataset.lh && setLineHeight(btn.dataset.lh));
  });
});

