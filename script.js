function switchTab(tab, el) {
    if (el) {
        const items = document.querySelectorAll('.nav-item');
        items.forEach(i => i.classList.remove('active'));
        el.classList.add('active');
    }

    const modules = document.querySelectorAll('.module-section');
    // 先全部隐藏
    modules.forEach(m => m.style.display = 'none');

    // 根据 tab 显示对应模块
    if (tab === 'all') {
        // 将“首页视图”默认显示拼音模块
        document.getElementById('mod-pinyin').style.display = 'flex';
    } else {
        if (tab === 'pinyin') document.getElementById('mod-pinyin').style.display = 'flex';
        else if (tab === 'alphabet') document.getElementById('mod-alphabet').style.display = 'flex';
        else if (tab === 'chinese') document.getElementById('mod-chinese').style.display = 'flex';
        else if (tab === 'math') {
            document.getElementById('mod-math').style.display = 'flex';
            document.getElementById('mod-mistakes').style.display = 'flex';
        }
        else if (tab === 'english') {
            document.getElementById('mod-english').style.display = 'flex';
            document.getElementById('mod-words').style.display = 'flex';
        }
        else if (tab === 'exercise') document.getElementById('mod-exercise').style.display = 'flex';
        else if (tab === 'tasks') document.getElementById('mod-tasks').style.display = 'flex';
        else if (tab === 'mistakes') document.getElementById('mod-mistakes').style.display = 'flex';
        else if (tab === 'rewards') document.getElementById('mod-rewards').style.display = 'flex';
    }
}
