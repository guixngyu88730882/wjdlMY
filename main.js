// =============================
// EF Police Mod 官方站 - 动效增强 JS
// =============================

// 平滑滚动（锚点）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// 滚动渐入
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach(section => {
  section.classList.add('reveal');
  observer.observe(section);
});

// 顶部滚动进度条
const progress = document.createElement('div');
progress.style.position = 'fixed';
progress.style.top = '0';
progress.style.left = '0';
progress.style.height = '2px';
progress.style.background = 'linear-gradient(90deg,#2f7cff,#5fa3ff)';
progress.style.zIndex = '9999';
progress.style.width = '0%';
document.body.appendChild(progress);

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  progress.style.width = (scrollTop / scrollHeight) * 100 + '%';
});
