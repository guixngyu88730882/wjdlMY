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
  function setFxMode(mode) {
    const root = document.documentElement;
    const m = mode === 'off' ? 'off' : 'on';

    if (m === 'off') root.setAttribute('data-fx', 'off');
    else root.removeAttribute('data-fx');

    localStorage.setItem('efmods-fx', m);
    syncSettingsUI();
  }

  function setShowTime(enabled) {
    const root = document.documentElement;
    const on = !!enabled;
    root.setAttribute('data-show-time', on ? '1' : '0');
    localStorage.setItem('efmods-show-time', on ? '1' : '0');
    syncSettingsUI();
  }

  function setSpotlight(enabled) {
    const root = document.documentElement;
    const on = !!enabled;
    root.setAttribute('data-spotlight', on ? '1' : '0');
    localStorage.setItem('efmods-spotlight', on ? '1' : '0');
    syncSettingsUI();
  }

  function setPerfMode(mode) {
    const root = document.documentElement;
    const m = mode === 'low' ? 'low' : 'high';

    if (m === 'low') {
      root.setAttribute('data-perf', 'low');
      // 低性能 = 尽量关特效（与“性能模式”一致）
      setFxMode('off');
    } else {
      root.removeAttribute('data-perf');
      setFxMode('on');
    }

    localStorage.setItem('efmods-perf', m);

    const btn = document.getElementById('perf-toggle');
    if (!btn) return;

    const isLow = m === 'low';
    btn.setAttribute('aria-pressed', isLow ? 'true' : 'false');
    btn.textContent = isLow ? '性能：开' : '性能';
    btn.setAttribute('title', isLow ? '关闭性能模式（恢复特效）' : '开启性能模式（关闭特效）');
  }

  function syncSettingsUI() {
    const root = document.documentElement;

    const showTime = root.getAttribute('data-show-time') !== '0';
    const spotlight = root.getAttribute('data-spotlight') !== '0';
    const theme = root.getAttribute('data-theme') || 'light';
    const fx = root.getAttribute('data-fx') === 'off' ? 'off' : 'on';

    const cbTime = document.getElementById('setting-show-time');
    if (cbTime) cbTime.checked = !!showTime;

    const cbSpot = document.getElementById('setting-spotlight');
    if (cbSpot) cbSpot.checked = !!spotlight;

    const btnLight = document.getElementById('setting-theme-light');
    const btnDark = document.getElementById('setting-theme-dark');
    if (btnLight) btnLight.classList.toggle('active', theme !== 'dark');
    if (btnDark) btnDark.classList.toggle('active', theme === 'dark');

    const btnVisual = document.getElementById('setting-fx-visual');
    const btnPerf = document.getElementById('setting-fx-perf');
    if (btnVisual) btnVisual.classList.toggle('active', fx === 'on');
    if (btnPerf) btnPerf.classList.toggle('active', fx === 'off');
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

  function setupHomeClock() {
    const el = document.getElementById('current-time');
    if (!el) return;

    function pad2(n) {
      return String(n).padStart(2, '0');
    }

    function render() {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = pad2(d.getMonth() + 1);
      const dd = pad2(d.getDate());
      const hh = pad2(d.getHours());
      const mi = pad2(d.getMinutes());
      const ss = pad2(d.getSeconds());
      el.textContent = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }

    render();
    window.setInterval(render, 1000);
  }
  function setupGlobalSpotlight() {
    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    function enabled() {
      const root = document.documentElement;
      if (root.getAttribute('data-fx') === 'off') return false;
      if (root.getAttribute('data-spotlight') === '0') return false;
      return true;
    }

    function schedule() {
      if (!enabled()) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (!enabled()) return;
        const x = window.innerWidth ? (lastX / window.innerWidth) * 100 : 50;
        const y = window.innerHeight ? (lastY / window.innerHeight) * 100 : 50;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
      });
    }

    function onMove(e) {
      if (!enabled()) return;
      lastX = e.clientX;
      lastY = e.clientY;
      schedule();
    }

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerenter', onMove, { passive: true });
  }

  function setupAnnouncementBar() {
    const bar = document.getElementById('announcement-bar');
    const closeBtn = document.getElementById('announcement-close');
    const peekBtn = document.getElementById('announcement-peek');

    if (!bar || !closeBtn || !peekBtn) return;

    const KEY = 'efmods-announcement-collapsed';

    function applyCollapsed(collapsed) {
      if (collapsed) document.body.classList.add('announcement-collapsed');
      else document.body.classList.remove('announcement-collapsed');

      peekBtn.hidden = !collapsed;
      localStorage.setItem(KEY, collapsed ? '1' : '0');
    }

    const collapsed = localStorage.getItem(KEY) === '1';
    applyCollapsed(collapsed);

    closeBtn.addEventListener('click', function () {
      applyCollapsed(true);
    });

    peekBtn.addEventListener('click', function () {
      applyCollapsed(false);
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('efmods-theme') || 'light';
    setTheme(savedTheme);

    const savedShowTime = localStorage.getItem('efmods-show-time');
    setShowTime(savedShowTime !== '0');

    const savedSpotlight = localStorage.getItem('efmods-spotlight');
    setSpotlight(savedSpotlight !== '0');

    const savedFx = localStorage.getItem('efmods-fx');
    if (savedFx === 'off') {
      setPerfMode('low');
    } else if (savedFx === 'on') {
      setPerfMode('high');
    } else {
      const savedPerf = localStorage.getItem('efmods-perf') || 'high';
      setPerfMode(savedPerf);
    }

    setupCopyButtons();
    setupHeroSubtitleRotator();
    setupHomeClock();
    setupReadingProgress();
    setupMaterialRipple();
    setupAnnouncementBar();
    setupGlobalSpotlight();

    // 设置弹窗开关
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsOverlay = document.getElementById('settings-overlay');
    const settingsClose = document.getElementById('settings-close');

    function openSettings() {
      if (!settingsOverlay) return;
      document.body.classList.add('settings-open');
      settingsOverlay.setAttribute('aria-hidden', 'false');
    }

    function closeSettings() {
      if (!settingsOverlay) return;
      document.body.classList.remove('settings-open');
      settingsOverlay.setAttribute('aria-hidden', 'true');
    }

    if (settingsToggle) {
      settingsToggle.addEventListener('click', function () {
        const opened = document.body.classList.contains('settings-open');
        if (opened) closeSettings();
        else openSettings();
      });
    }

    if (settingsClose) {
      settingsClose.addEventListener('click', function () {
        closeSettings();
      });
    }

    if (settingsOverlay) {
      settingsOverlay.addEventListener('click', function (e) {
        if (e.target === settingsOverlay) closeSettings();
      });
    }

    // 设置项绑定
    const cbTime = document.getElementById('setting-show-time');
    if (cbTime) {
      cbTime.addEventListener('change', function () {
        setShowTime(this.checked);
      });
    }

    const cbSpot = document.getElementById('setting-spotlight');
    if (cbSpot) {
      cbSpot.addEventListener('change', function () {
        setSpotlight(this.checked);
      });
    }

    const btnLight = document.getElementById('setting-theme-light');
    if (btnLight) btnLight.addEventListener('click', () => { setTheme('light'); syncSettingsUI(); });

    const btnDark = document.getElementById('setting-theme-dark');
    if (btnDark) btnDark.addEventListener('click', () => { setTheme('dark'); syncSettingsUI(); });

    const btnVisual = document.getElementById('setting-fx-visual');
    if (btnVisual) btnVisual.addEventListener('click', () => setPerfMode('high'));

    const btnPerf = document.getElementById('setting-fx-perf');
    if (btnPerf) btnPerf.addEventListener('click', () => setPerfMode('low'));

    syncSettingsUI();

    const perfToggle = document.getElementById('perf-toggle');
    if (perfToggle) {
      perfToggle.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-perf') === 'low' ? 'low' : 'high';
        const next = current === 'low' ? 'high' : 'low';
        setPerfMode(next);

        perfToggle.style.transform = 'scale(0.96)';
        setTimeout(() => {
          perfToggle.style.transform = 'translateY(-1px)';
          setTimeout(() => (perfToggle.style.transform = ''), 120);
        }, 120);
      });
    }

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