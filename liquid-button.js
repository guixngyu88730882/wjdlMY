(function () {
  function setMouseVars(el, evt) {
    const rect = el.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * 100;
    const y = ((evt.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mouse-x', `${x}%`);
    el.style.setProperty('--mouse-y', `${y}%`);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const targets = document.querySelectorAll(
      '.btn-liquid, .filter-btn, .features li, details.log-block, .download-card, .video-wrapper'
    );

    targets.forEach(el => {
      el.addEventListener('mousemove', (e) => setMouseVars(el, e));
      el.addEventListener('mouseenter', (e) => setMouseVars(el, e));
    });
  });
})();