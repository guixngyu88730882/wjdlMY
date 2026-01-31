// =============================
// 更新日志高级动画系统
// =============================

class LogAnimationSystem {
  constructor() {
    this.logBlocks = [];
    this.init();
  }
  
  init() {
    // 获取所有日志块
    this.logBlocks = Array.from(document.querySelectorAll('.log-block'));
    
    // 为每个日志块设置初始状态和事件
    this.logBlocks.forEach(logBlock => {
      this.setupLogBlock(logBlock);
    });
    
    // 监听筛选按钮变化
    this.setupFilterListeners();
    
    console.log(`日志动画系统初始化完成，共管理 ${this.logBlocks.length} 个日志块`);
  }
  
  setupLogBlock(logBlock) {
    const summary = logBlock.querySelector('summary');
    const content = logBlock.querySelector('.log-content');
    const icon = logBlock.querySelector('.log-icon');
    
    if (!summary || !content) return;
    
    // 存储初始高度用于动画计算
    content.dataset.originalHeight = content.scrollHeight;
    
    // 点击展开/收起时的动画
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      
      const isOpening = !logBlock.open;
      
      if (isOpening) {
        this.animateOpen(logBlock, content, icon);
      } else {
        this.animateClose(logBlock, content, icon);
      }
    });
    
    // 初始状态：如果是打开的，应用打开状态
    if (logBlock.open) {
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.opacity = '1';
      if (icon) {
        icon.style.transform = 'rotate(180deg)';
      }
    }
  }
  
  animateOpen(logBlock, content, icon) {
    // 阻止默认行为，我们将手动控制
    logBlock.open = true;
    
    // 旋转图标
    if (icon) {
      icon.style.transform = 'rotate(180deg)';
      icon.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
    
    // 内容区域动画
    requestAnimationFrame(() => {
      // 步骤1：先展开容器
      logBlock.style.overflow = 'hidden';
      logBlock.style.animation = 'logExpand 0.5s ease-out forwards';
      
      // 步骤2：延迟显示内容
      setTimeout(() => {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
        
        // 步骤3：动画结束后恢复滚动
        setTimeout(() => {
          logBlock.style.overflow = '';
        }, 500);
      }, 200);
    });
    
    // 触发自定义事件
    logBlock.dispatchEvent(new CustomEvent('logOpened', { 
      detail: { version: logBlock.id || 'unknown' }
    }));
  }
  
  animateClose(logBlock, content, icon) {
    // 旋转图标
    if (icon) {
      icon.style.transform = 'rotate(0deg)';
      icon.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
    
    // 内容区域收起动画
    content.style.maxHeight = '0';
    content.style.opacity = '0';
    content.style.transform = 'translateY(-10px)';
    
    // 容器收起动画
    logBlock.style.animation = 'none';
    requestAnimationFrame(() => {
      logBlock.style.animation = 'logExpand 0.3s ease-in-out reverse forwards';
    });
    
    // 延迟设置open属性，确保动画完成
    setTimeout(() => {
      logBlock.open = false;
      logBlock.style.overflow = '';
      
      // 触发自定义事件
      logBlock.dispatchEvent(new CustomEvent('logClosed', { 
        detail: { version: logBlock.id || 'unknown' }
      }));
    }, 300);
  }
  
  setupFilterListeners() {
    // 版本筛选时的特殊动画
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // 为所有日志块添加过渡效果
        this.logBlocks.forEach(logBlock => {
          logBlock.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          
          // 根据筛选条件显示/隐藏
          if (filter === 'all') {
            this.animateFilterShow(logBlock);
          } else {
            const version = logBlock.closest('.log-group').dataset.version;
            if (version === filter) {
              this.animateFilterShow(logBlock);
            } else {
              this.animateFilterHide(logBlock);
            }
          }
          
          // 移除过渡效果
          setTimeout(() => {
            logBlock.style.transition = '';
          }, 500);
        });
      });
    });
  }
  
  animateFilterShow(element) {
    element.style.display = 'block';
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) scale(1)';
    });
  }
  
  animateFilterHide(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px) scale(0.95)';
    setTimeout(() => {
      element.style.display = 'none';
    }, 300);
  }
  
  // 批量展开/收起所有日志
  expandAll() {
    this.logBlocks.forEach(logBlock => {
      const content = logBlock.querySelector('.log-content');
      const icon = logBlock.querySelector('.log-icon');
      
      if (!logBlock.open) {
        this.animateOpen(logBlock, content, icon);
      }
    });
  }
  
  collapseAll() {
    this.logBlocks.forEach(logBlock => {
      const content = logBlock.querySelector('.log-content');
      const icon = logBlock.querySelector('.log-icon');
      
      if (logBlock.open) {
        this.animateClose(logBlock, content, icon);
      }
    });
  }
  
  // 添加新的日志块到系统
  addLogBlock(logBlock) {
    this.setupLogBlock(logBlock);
    this.logBlocks.push(logBlock);
  }
}

// 初始化日志动画系统
document.addEventListener('DOMContentLoaded', () => {
  window.logAnimations = new LogAnimationSystem();
  
  // 为折叠/展开按钮绑定事件
  const collapseAllBtn = document.getElementById('collapse-all');
  const expandAllBtn = document.getElementById('expand-all');
  const yuyuCollapseAllBtn = document.querySelector('.yuyu-collapse-all');
  const yuyuExpandAllBtn = document.querySelector('.yuyu-expand-all');
  
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      window.logAnimations.collapseAll();
    });
  }
  
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      window.logAnimations.expandAll();
    });
  }
  
  if (yuyuCollapseAllBtn) {
    yuyuCollapseAllBtn.addEventListener('click', () => {
      // 只折叠宇宇修改器页面的日志
      const yuyuLogs = document.querySelectorAll('#yuyu-changelog .log-block');
      yuyuLogs.forEach(logBlock => {
        const content = logBlock.querySelector('.log-content');
        const icon = logBlock.querySelector('.log-icon');
        if (logBlock.open) {
          window.logAnimations.animateClose(logBlock, content, icon);
        }
      });
    });
  }
  
  if (yuyuExpandAllBtn) {
    yuyuExpandAllBtn.addEventListener('click', () => {
      // 只展开宇宇修改器页面的日志
      const yuyuLogs = document.querySelectorAll('#yuyu-changelog .log-block');
      yuyuLogs.forEach(logBlock => {
        const content = logBlock.querySelector('.log-content');
        const icon = logBlock.querySelector('.log-icon');
        if (!logBlock.open) {
          window.logAnimations.animateOpen(logBlock, content, icon);
        }
      });
    });
  }
});
