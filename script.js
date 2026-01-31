document.addEventListener('DOMContentLoaded', function() {
    // 深浅模式切换
    const modeToggle = document.createElement('button');
    modeToggle.className = 'mode-toggle';
    modeToggle.innerHTML = '☀';
    modeToggle.title = '切换深浅模式';
    document.body.appendChild(modeToggle);

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        modeToggle.textContent = isDarkMode ? '🌙' : '☀';
        modeToggle.className = isDarkMode ? 'mode-toggle dark' : 'mode-toggle';
        
        // 保存深浅模式设置到localStorage
        localStorage.setItem('darkMode', isDarkMode);
    }

    modeToggle.addEventListener('click', toggleDarkMode);

    // 检查localStorage中的深浅模式设置
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        modeToggle.textContent = '🌙';
        modeToggle.className = 'mode-toggle dark';
    }

    // 更新日志折叠/展开
    const logHeaders = document.querySelectorAll('.log-header');
    logHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.classList.toggle('active');
            
            // 切换文本
            const toggleText = this.querySelector('.toggle-text');
            if (content.classList.contains('active')) {
                toggleText.textContent = '全部折叠';
            } else {
                toggleText.textContent = '全部展开';
            }
        });
    });

    // 默认展开所有更新日志
    const logContents = document.querySelectorAll('.log-content');
    logContents.forEach(content => {
        content.classList.add('active');
    });
    
    // 默认显示"全部展开"文本
    const toggleTexts = document.querySelectorAll('.toggle-text');
    toggleTexts.forEach(text => {
        text.textContent = '全部展开';
    });
});
