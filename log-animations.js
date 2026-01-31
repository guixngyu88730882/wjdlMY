(function () {
  function setupFilter(scopeEl) {
    const filterButtons = scopeEl.querySelectorAll('.filter-btn');
    const groups = scopeEl.querySelectorAll('.log-group');
    if (!filterButtons.length || !groups.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter') || 'all';
        groups.forEach(g => {
          const v = g.getAttribute('data-version');
          g.style.display = (filter === 'all' || v === filter) ? '' : 'none';
        });
      });
    });
  }

  function setAllDetails(scopeEl, open) {
    const details = scopeEl.querySelectorAll('details.log-block');
    details.forEach(d => {
      const content = d.querySelector('.log-content');
      if (open) {
        d.open = true;
        if (content) {
          content.style.maxHeight = 'none';
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';
        }
      } else {
        // 直接收起：清理到“关闭态”，防止状态错乱
        if (content) {
          content.style.maxHeight = '';
          content.style.opacity = '';
          content.style.transform = '';
        }
        d.open = false;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 丝滑开合：用 JS 动画控制内容高度，避免 <details> 关闭时瞬间隐藏导致“无收起动画/文字闪”
    document.querySelectorAll('details.log-block').forEach(details => {
      const summary = details.querySelector('summary');
      const content = details.querySelector('.log-content');
      if (!summary || !content) return;

      let animating = false;
      let last = 0;

      function animateOpen() {
        animating = true;
        details.open = true;

        const targetPaddingBottom = 22;

        // 先强制置为收起态，避免“闪一下”
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-6px)';
        content.style.paddingBottom = '0px';
        content.style.borderTopColor = 'transparent';

        requestAnimationFrame(() => {
          // padding-bottom 会渐变到 22px，如果 max-height 只按“当前 scrollHeight”计算，会在结束时出现“再长一截”的顿挫
          content.style.paddingBottom = `${targetPaddingBottom}px`;
          content.style.borderTopColor = 'var(--border-light)';

          const h = content.scrollHeight + targetPaddingBottom;
          content.style.maxHeight = `${h}px`;
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';
        });

        const finish = () => {
          content.style.maxHeight = 'none';
          animating = false;
        };

        const onEnd = (e) => {
          if (e.propertyName !== 'max-height') return;
          content.removeEventListener('transitionend', onEnd);
          finish();
        };
        content.addEventListener('transitionend', onEnd);

        // 兜底：极少数情况下 transitionend 不触发，避免“无法再收起/再展开”
        setTimeout(() => {
          if (animating) {
            content.removeEventListener('transitionend', onEnd);
            finish();
          }
        }, 900);
      }

      function animateClose() {
        animating = true;

        // 固定当前高度，才能平滑过渡到 0
        const h = content.scrollHeight;
        content.style.maxHeight = `${h}px`;
        // 强制回流
        void content.offsetHeight;

        // 关键：在 max-height 动到 0 的同时，把 padding 一起动到 0，避免底部“多一截再回弹”
        content.style.paddingBottom = '0px';
        content.style.borderTopColor = 'transparent';
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-6px)';

        const finish = () => {
          details.open = false;
          content.style.maxHeight = '';
          content.style.opacity = '';
          content.style.transform = '';
          content.style.paddingBottom = '';
          content.style.borderTopColor = '';
          animating = false;
        };

        const onEnd = (e) => {
          if (e.propertyName !== 'max-height') return;
          content.removeEventListener('transitionend', onEnd);
          finish();
        };
        content.addEventListener('transitionend', onEnd);

        // 兜底：避免 transitionend 未触发导致“无法收起”
        setTimeout(() => {
          if (animating) {
            content.removeEventListener('transitionend', onEnd);
            finish();
          }
        }, 900);
      }

      summary.addEventListener('click', (e) => {
        e.preventDefault();

        const now = Date.now();
        if (now - last < 220) return;
        last = now;
        if (animating) return;

        if (details.open) animateClose();
        else animateOpen();
      });
    });

    document.querySelectorAll('section.section').forEach(section => {
      setupFilter(section);
    });

    const policeChangelog = document.getElementById('changelog');
    const collapseAll = document.getElementById('collapse-all');
    const expandAll = document.getElementById('expand-all');

    if (policeChangelog) {
      if (collapseAll) collapseAll.addEventListener('click', () => setAllDetails(policeChangelog, false));
      if (expandAll) expandAll.addEventListener('click', () => setAllDetails(policeChangelog, true));
    }

    const yuyuChangelog = document.getElementById('yuyu-changelog');
    const yuyuCollapseAll = document.querySelector('.yuyu-collapse-all');
    const yuyuExpandAll = document.querySelector('.yuyu-expand-all');

    if (yuyuChangelog) {
      if (yuyuCollapseAll) yuyuCollapseAll.addEventListener('click', () => setAllDetails(yuyuChangelog, false));
      if (yuyuExpandAll) yuyuExpandAll.addEventListener('click', () => setAllDetails(yuyuChangelog, true));
    }
  });
})();