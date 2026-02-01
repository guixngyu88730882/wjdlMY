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

    const revealEls = Array.from(scopeEl.querySelectorAll('.section, details.log-block'));

    // 统一加 reveal，并为日志卡片添加“逐条错峰”延迟（更有景深/节奏）
    let logIndex = 0;
    revealEls.forEach(el => {
      el.classList.add('reveal');

      if (el.matches('details.log-block')) {
        const delay = Math.min(logIndex, 18) * 70;
        el.style.setProperty('--reveal-delay', `${delay}ms`);
        logIndex += 1;
      } else {
        el.style.setProperty('--reveal-delay', '0ms');
      }
    });

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 进入视口：播放一次“出现”动效；离开视口：重置，便于下次再触发
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  function openMobileNav() {
    const overlay = document.getElementById('mobile-nav-overlay');
    const toggle = document.getElementById('nav-toggle');
    if (!overlay || !toggle) return;

    document.body.classList.add('mobile-nav-open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    const overlay = document.getElementById('mobile-nav-overlay');
    const toggle = document.getElementById('nav-toggle');
    if (!overlay || !toggle) return;

    document.body.classList.remove('mobile-nav-open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function updateNavPill() {
    const menu = document.querySelector('.nav-menu.desktop-nav');
    if (!menu) return;

    const active = menu.querySelector('.nav-item.active');
    if (!active) return;

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

    const targetPage = document.querySelector(pageId);
    if (!targetPage) return;

    const currentPage = document.querySelector('.page.active-page');

    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll(`.nav-item[data-page][href="${pageId}"]`).forEach(el => el.classList.add('active'));
    updateNavPill();

    // 切换到同一页：只处理锚点滚动
    if (currentPage === targetPage) {
      if (anchorId) {
        const anchorEl = document.querySelector(anchorId);
        if (anchorEl) anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 退出动画：让上一页先淡出，再切到下一页淡入（更丝滑）
    if (currentPage) {
      currentPage.classList.add('page-exit');
      setTimeout(() => {
        currentPage.classList.remove('active-page');
        currentPage.classList.remove('page-exit');
      }, 520);
    }

    // 先激活新页（淡入）
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
    }, 30);
  }

  function showFromHash(hash) {
    const safeHash = hash || '#home';

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

    showPage('#home');
  }

  async function copyText(text) {
    const value = String(text || '').trim();
    if (!value) return false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(value);
      return true;
    }

    // 降级方案：execCommand（旧浏览器）
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }

  function setupCopyButtons() {
    const btns = Array.from(document.querySelectorAll('[data-copy]'));
    btns.forEach(btn => {
      btn.addEventListener('click', async function (e) {
        e.preventDefault();
        const text = this.getAttribute('data-copy') || '';

        try {
          const ok = await copyText(text);
          if (!ok) return;

          const old = this.textContent;
          this.textContent = '已复制';
          this.classList.add('copied');
          setTimeout(() => {
            this.textContent = old || '一键复制';
            this.classList.remove('copied');
          }, 1100);
        } catch (err) {
          // ignore
        }
      });
    });
  }

  function setupHeroSubtitleRotator() {
    const el = document.getElementById('hero-subtitle');
    if (!el) return;

    const items = [
      "GTA5 模组官方站：更稳定、更省心、更像'原生玩法'",
      "从玩家到创作者，我们陪你一起成长 <a class=\"subtitle-cta btn ghost small btn-liquid\" href=\"#join-us\"><span class=\"liquid-refraction\"></span>加入我们</a>",
      "有问题不会解决？进1079691553粉丝群~",
      "玩家动力跨年赛冲榜中，感谢每一位下载的你"
    ];

    let currentIndex = 0;
    let timer = null;

    function pickNextIndex() {
      if (items.length <= 1) return 0;
      let idx = currentIndex;
      while (idx === currentIndex) {
        idx = Math.floor(Math.random() * items.length);
      }
      return idx;
    }

    function render(index) {
      el.classList.add('subtitle-switch-out');
      window.setTimeout(() => {
        el.innerHTML = items[index];
        el.classList.remove('subtitle-switch-out');
        el.classList.add('subtitle-switch-in');
        window.setTimeout(() => el.classList.remove('subtitle-switch-in'), 260);
      }, 230);
    }

    function scheduleNext() {
      const delay = 3200 + Math.floor(Math.random() * 2000); // 3.2s ~ 5.2s
      timer = window.setTimeout(() => {
        currentIndex = pickNextIndex();
        render(currentIndex);
        scheduleNext();
      }, delay);
    }

    // 初始化
    el.innerHTML = items[currentIndex];
    scheduleNext();

    window.addEventListener('beforeunload', function () {
      if (timer) window.clearTimeout(timer);
    });
  }

  function setupMaterialRipple() {
    // 事件委托：兼容动态插入的按钮（如 Hero subtitle 内的“加入我们”）
    document.addEventListener('pointerdown', function (e) {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const el = target.closest('.btn, .chip, .nav-item, .theme-toggle, .nav-toggle, .mobile-nav-close');
      if (!el) return;

      // 右键/触控笔按键不触发
      if (typeof e.button === 'number' && e.button !== 0) return;

      const rect = el.getBoundingClientRect();
      const size = Math.ceil(Math.max(rect.width, rect.height) * 1.8);
      const x = (e.clientX - rect.left) - size / 2;
      const y = (e.clientY - rect.top) - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'md-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // 清理上一次未结束的波纹，避免堆积
      const old = el.querySelector('.md-ripple');
      if (old) old.remove();

      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }, { passive: true });
  }

  function setupReadingProgress() {
    const bar = document.getElementById('reading-progress-bar');
    if (!bar) return;

    let ticking = false;

    function update() {
      ticking = false;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const max = Math.max(0, doc.scrollHeight - doc.clientHeight);
      const p = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    requestUpdate();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('efmods-theme') || 'light';
    setTheme(savedTheme);
    setupCopyButtons();
    setupHeroSubtitleRotator();
    setupReadingProgress();
    setupMaterialRipple();

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

    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('mobile-nav-close');
    const navOverlay = document.getElementById('mobile-nav-overlay');

    if (navToggle) {
      navToggle.addEventListener('click', function () {
        const opened = document.body.classList.contains('mobile-nav-open');
        if (opened) closeMobileNav();
        else openMobileNav();
      });
    }

    if (navClose) {
      navClose.addEventListener('click', function () {
        closeMobileNav();
      });
    }

    if (navOverlay) {
      navOverlay.addEventListener('click', function (e) {
        if (e.target === navOverlay) closeMobileNav();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });

    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();

        const pageKey = this.getAttribute('data-page');
        if (!pageKey) return;

        const pageId = `#${pageKey}`;
        const anchorId = this.getAttribute('data-anchor');

        closeMobileNav();
        showPage(pageId, anchorId);
        window.history.pushState(null, '', anchorId || pageId);
      });
    });

    showFromHash(window.location.hash || '#home');    window.addEventListener('popstate', function () {
      showFromHash(window.location.hash || '#home');
    });

    window.addEventListener('hashchange', function () {
      showFromHash(window.location.hash || '#home');
    });

    window.addEventListener('resize', function () {
      updateNavPill();
    });
  });
})();