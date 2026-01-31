// =============================
// EF Mods 官方站 - 增强交互
// =============================

// 页面切换功能
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  
  // 初始化 - 显示当前哈希对应的页面
  const currentHash = window.location.hash || '#police-mod';
  switchPage(currentHash);
  
  // 导航点击事件
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('href');
      
      // 更新导航状态
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      
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
    
    // 更新导航状态
    navItems.forEach(nav => {
      nav.classList.remove('active');
      if (nav.getAttribute('href') === pageId) {
        nav.classList.add('active');
      }
    });
  });
  
  // 页面切换函数
  function switchPage(pageId) {
    // 隐藏所有页面
    pages.forEach(page => {
      page.classList.remove('active-page');
      page.style.display = 'none';
    });
    
    // 显示目标页面
    const targetPage = document.querySelector(pageId);
    if (targetPage) {
      targetPage.style.display = 'block';
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
  
  // =============================
  // 更新日志功能
  // =============================
  
  // 版本筛选功能
  const filterButtons = document.querySelectorAll('.filter-btn');
  const logGroups = document.querySelectorAll('.log-group');
  
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
  
  // 折叠/展开全部功能
  const collapseAllBtn = document.getElementById('collapse-all');
  const expandAllBtn = document.getElementById('expand-all');
  const logBlocks = document.querySelectorAll('.log-block');
  
  collapseAllBtn.addEventListener('click', function() {
    logBlocks.forEach(block => {
      block.removeAttribute('open');
    });
  });
  
  expandAllBtn.addEventListener('click', function() {
    logBlocks.forEach(block => {
      block.setAttribute('open', '');
    });
  });
  
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
          const pageId = href.split('-')[0] === '#yuyu' ? '#yuyu-tool' : '#police-mod';
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
  document.body.appendChild(progress);
  
  // 滚动监听
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    progress.style.width = scrollPercent + '%';
    
    // 延迟隐藏进度条
    progress.style.opacity = '1';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      progress.style.opacity = '0';
    }, 1000);
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
});
