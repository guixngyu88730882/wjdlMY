// =============================
// EF Mods 官方站 - 增强交互
// =============================

// 页面切换功能
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // 初始化主题
  const savedTheme = localStorage.getItem('efmods-theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // 初始化 - 显示当前哈希对应的页面
  const currentHash = window.location.hash || '#police-mod';
  switchPage(currentHash);
  
  // 更新导航状态
  updateNavActive(currentHash);
  
  // 导航点击事件
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('href');
      
      // 更新导航状态
      updateNavActive(pageId);
      
      // 切换页面
      switchPage(pageId);
      
      // 更新URL哈希
      window.history.pushState(null, '', pageId);
    });
  });
  
  // 监听浏览器前进后退
  window.addEventListener('popstate', function() {
    const pageId = window.location.hash || '#police-mod';
    switchPage(pageId);
    updateNavActive(pageId);
  });
  
  // 主题切换功能
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // 应用新主题
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('efmods-theme', newTheme);
    
    // 更新图标
    updateThemeIcon(newTheme);
    
    // 添加切换动画
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      themeToggle.style.transform = 'scale(1)';
    }, 150);
  });
  
  // 页面切换函数
  function switchPage(pageId) {
    // 隐藏所有页面
    pages.forEach(page => {
      page.classList.remove('active-page');
    });
    
    // 显示目标页面
    const targetPage = document.querySelector(pageId);
    if (targetPage) {
      setTimeout(() => {
        targetPage.classList.add('active-page');
        // 滚动到顶部
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 10);
    }
  }
  
  // 更新导航激活状态
  function updateNavActive(pageId) {
    navItems.forEach(nav => {
      nav.classList.remove('active');
      if (nav.getAttribute('href') === pageId) {
        nav.classList.add('active');
      }
    });
  }
  
  // 更新主题图标
  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
      themeToggle.setAttribute('title', '切换到浅色主题');
    } else {
      themeIcon.className = 'fas fa-moon';
      themeToggle.setAttribute('title', '切换到深色主题');
    }
  }
  
  // =============================
  // 更新日志功能
  // =============================
  
  // 警察模组版本筛选功能
  const filterButtons = document.querySelectorAll('.filter-btn');
  const logGroups = document.querySelectorAll('#changelog .log-group');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // 更新按钮状态
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // 筛选日志组
      logGroups.forEach(group => {
        if (filter === 'all') {
          group.style.display = 'block';
        } else {
          if (group.getAttribute('data-version') === filter) {
            group.style.display = 'block';
          } else {
            group.style.display = 'none';
          }
        }
      });
    });
  });
  
  // 警察模组折叠/展开全部功能
  const collapseAllBtn = document.getElementById('collapse-all');
  const expandAllBtn = document.getElementById('expand-all');
  const policeLogBlocks = document.querySelectorAll('#changelog .log-block');
  
  if (collapseAllBtn && expandAllBtn) {
    collapseAllBtn.addEventListener('click', function() {
      policeLogBlocks.forEach(block => {
        block.removeAttribute('open');
      });
    });
    
    expandAllBtn.addEventListener('click', function() {
      policeLogBlocks.forEach(block => {
        block.setAttribute('open', '');
      });
    });
  }
  
  // 宇宇修改器折叠/展开全部功能
  const yuyuCollapseAllBtn = document.querySelector('.yuyu-collapse-all');
  const yuyuExpandAllBtn = document.querySelector('.yuyu-expand-all');
  const yuyuLogBlocks = document.querySelectorAll('#yuyu-changelog .log-block');
  
  if (yuyuCollapseAllBtn && yuyuExpandAllBtn) {
    yuyuCollapseAllBtn.addEventListener('click', function() {
      yuyuLogBlocks.forEach(block => {
        block.removeAttribute('open');
      });
    });
    
    yuyuExpandAllBtn.addEventListener('click', function() {
      yuyuLogBlocks.forEach(block => {
        block.setAttribute('open', '');
      });
    });
  }
  
  // 平滑滚动（锚点）
  document.querySelectorAll('a[href^="#"]:not(.nav-item)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // 如果是页面内锚点
      if (href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          // 如果目标在另一个页面，先切换到该页面
          const pageId = href.includes('yuyu') ? '#yuyu-tool' : '#police-mod';
          const currentPage = document.querySelector('.page.active-page').id;
          
          if (pageId === `#${currentPage}`) {
            // 同页面内滚动
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          } else {
            // 切换到另一个页面
            document.querySelector(`a[href="${pageId}"]`).click();
            
            // 等待页面切换后滚动到目标位置
            setTimeout(() => {
              const newTarget = document.querySelector(href);
              if (newTarget) {
                newTarget.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }, 600);
          }
        }
      }
    });
  });
  
  // =============================
  // 滚动效果
  // =============================
  
  // 滚动进度条
  const progress = document.createElement('div');
  progress.style.position = 'fixed';
  progress.style.top = '0';
  progress.style.left = '0';
  progress.style.height = '2px';
  progress.style.background = 'linear-gradient(90deg, var(--blue), var(--blue-light))';
  progress.style.zIndex = '9998';
  progress.style.width = '0%';
  progress.style.transition = 'width 0.1s ease';
  progress.style.opacity = '0';
  document.body.appendChild(progress);
  
  // 滚动监听
  let scrollTimeout;
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    progress.style.width = scrollPercent + '%';
    progress.style.opacity = '1';
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      progress.style.opacity = '0';
    }, 1000);
    
    lastScrollY = scrollTop;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  });
  
  // 滚动渐入效果
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // 观察所有区块
  document.querySelectorAll('.section, .features li, .download-card').forEach(el => {
    observer.observe(el);
  });
  
  // 添加惯性滚动效果
  let isScrolling = false;
  window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    const delta = e.deltaY;
    const currentScroll = window.scrollY;
    const targetScroll = currentScroll + delta * 1.2;
    
    isScrolling = true;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      isScrolling = false;
    }, 300);
  }, { passive: true });
  
  // 初始化：展开最新版本的日志
  const latestLog = document.querySelector('.log-block');
  if (latestLog) {
    latestLog.setAttribute('open', '');
  }
  
  // 初始化：展开宇宇修改器最新版本的日志
  const yuyuLatestLog = document.querySelector('#yuyu-changelog .log-block');
  if (yuyuLatestLog) {
    yuyuLatestLog.setAttribute('open', '');
  }
});
