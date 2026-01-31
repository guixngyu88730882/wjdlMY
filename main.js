(function () {
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('efmods-theme', theme);

    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const themeIcon = themeToggle.querySelector('i');
    if (!themeIcon) return;

    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
      themeToggle.setAttribute('title', '切换到浅色主题');
    } else {
      themeIcon.className = 'fas fa-moon';
      themeToggle.setAttribute('title', '切换到深色主题');
    }
  }

  function setupReveal(scopeEl) {
    if (!scopeEl) return;

    const revealEls = scopeEl.querySelectorAll('.section');
    revealEls.forEach(el => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  function showPage(pageId) {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    const targetNav = document.querySelector(`.nav-item[href="${pageId}"]`);
    const targetPage = document.querySelector(pageId);

    if (!targetNav || !targetPage) return;

    navItems.forEach(nav => nav.classList.remove('active'));
    targetNav.classList.add('active');

    pages.forEach(page => page.classList.remove('active-page'));

    setTimeout(() => {
      targetPage.classList.add('active-page');
      setupReveal(targetPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('efmods-theme') || 'light';
    setTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
          themeToggle.style.transform = 'translateY(-1px)';
          setTimeout(() => (themeToggle.style.transform = ''), 120);
        }, 120);
      });
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const pageId = this.getAttribute('href');
        if (!pageId) return;
        showPage(pageId);
        window.history.pushState(null, '', pageId);
      });
    });

    const initialPage = window.location.hash || '#police-mod';
    showPage(initialPage);

    window.addEventListener('popstate', function () {
      const pageId = window.location.hash || '#police-mod';
      showPage(pageId);
    });
  });
})();