document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // Track active states
  const fontSelect = document.getElementById('font-family');
  const sizeResetBtn = document.getElementById('size-reset');
  const spacingBtns = document.querySelectorAll('.spacing-btn');

  function updateSpacingUI(activeHeight) {
    spacingBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lh === String(activeHeight));
    });
  }

  // 1. Font Family Handler
  fontSelect?.addEventListener('change', (e) => {
    root.style.setProperty('--font-family', e.target.value);
    localStorage.setItem('user-font-family', e.target.value);
  });

  // 2. Font Size Handlers
  let size = parseFloat(localStorage.getItem('user-font-size')) || 1.0;
  
  const setSize = (newSize) => {
    size = Math.min(Math.max(newSize, 0.8), 1.4); // Bound between 0.8rem and 1.4rem
    root.style.setProperty('--font-size', `${size.toFixed(1)}rem`);
    localStorage.setItem('user-font-size', size.toFixed(1));
    if (sizeResetBtn) sizeResetBtn.textContent = `${Math.round(size * 100)}%`;
  };

  document.getElementById('size-up')?.addEventListener('click', () => setSize(size + 0.1));
  document.getElementById('size-down')?.addEventListener('click', () => setSize(size - 0.1));
  sizeResetBtn?.addEventListener('click', () => setSize(1.0));

  // 3. Line Height Handlers
  spacingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lh = btn.dataset.lh;
      root.style.setProperty('--line-height', lh);
      localStorage.setItem('user-line-height', lh);
      updateSpacingUI(lh);
    });
  });

  // Sync initial state on load
  const savedLh = localStorage.getItem('user-line-height') || '1.6';
  updateSpacingUI(savedLh);
});

