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
      d.open = open;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
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