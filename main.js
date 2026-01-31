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

  function updateNavPill() {
    const menu = document.querySelector('.nav-menu');
    const active = document.querySelector('.nav-item.active');
    if (!menu || !active) return;

    const menuRect = menu.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();

    const left = Math.max(6, aRect.left - menuRect.left);
    const width = Math.max(0, aRect.width);

    menu.classList.add('has-pill');
    menu.style.setProperty('--pill-left', `${left}px`);
    menu.style.setProperty('--pill-width', `${width}px`);
  }

  function showPage(pageId, anchorId) {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page');

    const targetNav = document.querySelector(`.nav-item[data-page][href="${pageId}"]`);
    const targetPage = document.querySelector(pageId);

    if (!targetNav || !targetPage) return;

    navItems.forEach(nav => nav.classList.remove('active'));
    targetNav.classList.add('active');
    updateNavPill();

    pages.forEach(page => page.classList.remove('active-page'));

    setTimeout(() => {
      targetPage.classList.add('active-page');
      setupReveal(targetPage);

      if (anchorId) {
        const anchorEl = document.querySelector(anchorId);
        if (anchorEl) {
          anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  }

  function showFromHash(hash) {
    const safeHash = hash || '#police-mod';

    const pageEl = document.querySelector(safeHash);
    if (pageEl && pageEl.classList.contains('page')) {
      showPage(safeHash);
      return;
    }

    const anchorEl = document.querySelector(safeHash);
    if (anchorEl) {
      const parentPage = anchorEl.closest('.page');
      if (parentPage && parentPage.id) {
        showPage(`#${parentPage.id}`, safeHash);
        return;
      }
    }

    showPage('#police-mod');
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

    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();

        const pageKey = this.getAttribute('data-page');
        if (!pageKey) return;

        const pageId = `#${pageKey}`;
        const anchorId = this.getAttribute('data-anchor');

        showPage(pageId, anchorId);
        window.history.pushState(null, '', anchorId || pageId);
      });
    });

    showFromHash(window.location.hash || '#police-mod');

    window.addEventListener('popstate', function () {
      showFromHash(window.location.hash || '#police-mod');
    });

    window.addEventListener('resize', function () {
      updateNavPill();
    });
  });
})();