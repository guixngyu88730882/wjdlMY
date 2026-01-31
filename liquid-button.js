(function () {
  function setMouseVars(el, evt) {
    const rect = el.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * 100;
    const y = ((evt.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mouse-x', `${x}%`);
    el.style.setProperty('--mouse-y', `${y}%`);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn-liquid');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => setMouseVars(btn, e));
      btn.addEventListener('mouseenter', (e) => setMouseVars(btn, e));
    });
  });
})();