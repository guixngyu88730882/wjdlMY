// =============================
// 液态玻璃按钮交互系统
// =============================

class LiquidButtonSystem {
  constructor() {
    this.buttons = [];
    this.init();
  }
  
  init() {
    // 为所有液态玻璃按钮添加高级交互
    document.querySelectorAll('.btn-liquid').forEach(btn => {
      this.setupButton(btn);
      this.buttons.push(btn);
    });
    
    console.log(`液态玻璃系统初始化完成，共激活 ${this.buttons.length} 个按钮`);
  }
  
  setupButton(button) {
    // 创建光线折射层
    const refraction = button.querySelector('.liquid-refraction');
    
    // 鼠标移动时的光线折射效果
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
      
      // 动态更新折射光位置
      if (refraction) {
        refraction.style.setProperty('--mouse-x', `${x}%`);
        refraction.style.setProperty('--mouse-y', `${y}%`);
        refraction.style.opacity = '1';
      }
      
      // 微妙的3D倾斜效果
      const tiltX = (y - 50) / 10;
      const tiltY = (x - 50) / -10;
      
      button.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
    });
    
    // 鼠标离开恢复
    button.addEventListener('mouseleave', () => {
      if (refraction) {
        refraction.style.opacity = '0';
      }
      
      button.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      button.style.boxShadow = ''; // 清除点击效果
    });
    
    // 点击时的液态波纹效果
    button.addEventListener('mousedown', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 创建点击涟漪
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 0;
      `;
      
      button.appendChild(ripple);
      
      // 涟漪动画
      requestAnimationFrame(() => {
        ripple.style.transition = 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
        ripple.style.width = '200px';
        ripple.style.height = '200px';
        ripple.style.opacity = '0';
      });
      
      // 按钮按压效果
      button.style.transform = 'perspective(1000px) scale(0.98)';
      
      // 移除涟漪元素
      setTimeout(() => {
        if (ripple.parentNode === button) {
          button.removeChild(ripple);
        }
      }, 600);
    });
    
    // 点击释放
    button.addEventListener('mouseup', () => {
      button.style.transform = 'perspective(1000px) scale(1.05)';
      
      // 添加发光脉冲动画
      button.style.animation = 'liquidPulse 0.6s ease-out';
      setTimeout(() => {
        button.style.animation = '';
      }, 600);
    });
    
    // 触摸设备支持
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const event = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      button.dispatchEvent(event);
    });
    
    // 键盘交互支持
    button.addEventListener('focus', () => {
      button.classList.add('liquid-focused');
    });
    
    button.addEventListener('blur', () => {
      button.classList.remove('liquid-focused');
    });
  }
  
  // 动态添加新按钮到系统
  addButton(button) {
    if (!button.classList.contains('btn-liquid')) {
      button.classList.add('btn-liquid');
      
      // 添加折射层
      const refraction = document.createElement('span');
      refraction.className = 'liquid-refraction';
      button.appendChild(refraction);
      
      this.setupButton(button);
      this.buttons.push(button);
    }
  }
  
  // 移除效果
  removeLiquidEffect(button) {
    const index = this.buttons.indexOf(button);
    if (index > -1) {
      button.classList.remove('btn-liquid');
      const refraction = button.querySelector('.liquid-refraction');
      if (refraction) {
        button.removeChild(refraction);
      }
      this.buttons.splice(index, 1);
    }
  }
}

// 初始化液态玻璃系统
document.addEventListener('DOMContentLoaded', () => {
  window.liquidButtons = new LiquidButtonSystem();
  
  // 主题切换时重新初始化
  document.addEventListener('themeChanged', () => {
    setTimeout(() => {
      window.liquidButtons.init();
    }, 100);
  });
});
