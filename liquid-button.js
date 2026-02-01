(function () {
  function computeMouseVars(el, clientX, clientY) {
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x, y };
  }

  document.addEventListener('DOMContentLoaded', function () {
    const targets = document.querySelectorAll(
      '.btn-liquid, .filter-btn, .chip, .features li, details.log-block, .download-card, .video-wrapper'
    );

    targets.forEach(el => {
      let rafId = 0;
      let lastX = 0;
      let lastY = 0;

      const schedule = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          const { x, y } = computeMouseVars(el, lastX, lastY);
          el.style.setProperty('--mouse-x', `${x}%`);
          el.style.setProperty('--mouse-y', `${y}%`);
        });
      };

      const onMove = (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        schedule();
      };

      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseenter', onMove, { passive: true });
      el.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      }, { passive: true });
    });
  });
})();