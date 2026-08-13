// --- 1. 全局配置与持久化状态 ---
let currentStars = parseInt(localStorage.getItem('user_stars')) || 12;
let speechRate = 0.75;
let speechPitch = 1.2;
let availableVoices = [];

function updateStars(count) {
    currentStars = count;
    localStorage.setItem('user_stars', currentStars);
    document.getElementById('star-count').innerText = currentStars;
}

function updateTTSParams() {
    speechRate = parseFloat(document.getElementById('speech-rate').value);
    speechPitch = parseFloat(document.getElementById('speech-pitch').value);
    document.getElementById('rate-val').innerText = speechRate + 'x (缓速)';
    document.getElementById('pitch-val').innerText = speechPitch + ' (生动)';
}

// 预加载 Voices 列表机制
function loadVoices() {
    if ('speechSynthesis' in window) {
        availableVoices = window.speechSynthesis.getVoices();
    }
}
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
}

function speakText(text, lang = 'zh-CN', callback = null) {
    if (!('speechSynthesis' in window)) {
        alert("您的浏览器暂不支持语音朗读功能，建议使用 Chrome 或 Safari 浏览器。");
        return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    if (availableVoices.length === 0) {
        availableVoices = window.speechSynthesis.getVoices();
    }

    if (availableVoices.length > 0) {
        const targetVoice = availableVoices.find(v => v.lang.includes(lang.split('-')[0]) && (v.name.includes('Xiaoxiao') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri')));
        if (targetVoice) utterance.voice = targetVoice;
    }

    if (callback) utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
}

// --- 2. 拼音数据 (标准拟音发音优化) ---
const pinyinInitialsData = [
    { initial: 'zh', speakSound: '知', word: '蜘蛛', icon: '🕷️', isDouble: true },
    { initial: 'ch', speakSound: '吃', word: '吃苹果', icon: '🍎', isDouble: true },
    { initial: 'sh', speakSound: '诗', word: '狮子', icon: '🦁', isDouble: true },
    { initial: 'b', speakSound: '玻', word: '宝贝', icon: '👶', isDouble: false },
    { initial: 'p', speakSound: '坡', word: '爬山', icon: '🧗', isDouble: false },
    { initial: 'm', speakSound: '摸', word: '猫咪', icon: '🐱', isDouble: false },
    { initial: 'f', speakSound: '佛', word: '飞机', icon: '✈️', isDouble: false },
    { initial: 'd', speakSound: '得', word: '大象', icon: '🐘', isDouble: false },
    { initial: 't', speakSound: '特', word: '兔子', icon: '🐰', isDouble: false },
    { initial: 'n', speakSound: '讷', word: '牛奶', icon: '🥛', isDouble: false },
    { initial: 'l', speakSound: '勒', word: '老虎', icon: '🐯', isDouble: false },
    { initial: 'g', speakSound: '哥', word: '西瓜', icon: '🍉', isDouble: false },
    { initial: 'k', speakSound: '科', word: '恐龙', icon: '🦕', isDouble: false },
    { initial: 'h', speakSound: '喝', word: '猴子', icon: '🐒', isDouble: false },
    { initial: 'j', speakSound: '基', word: '小鸡', icon: '🐔', isDouble: false },
    { initial: 'q', speakSound: '七', word: '气球', icon: '🎈', isDouble: false },
    { initial: 'x', speakSound: '西', word: '熊猫', icon: '🐼', isDouble: false },
    { initial: 'r', speakSound: '日', word: '太阳', icon: '☀️', isDouble: false },
    { initial: 'z', speakSound: '资', word: '足球', icon: '⚽', isDouble: false },
    { initial: 'c', speakSound: '疵', word: '草莓', icon: '🍓', isDouble: false },
    { initial: 's', speakSound: '私', word: '树木', icon: '🌳', isDouble: false },
    { initial: 'y', speakSound: '医', word: '月亮', icon: '🌙', isDouble: false },
    { initial: 'w', speakSound: '屋', word: '乌龟', icon: '🐢', isDouble: false }
];

function renderPinyin() {
    const container = document.getElementById('pinyin-container');
    container.innerHTML = pinyinInitialsData.map(item => `
        <div class="pinyin-card ${item.isDouble ? 'double-letter' : ''}" onclick="speakPinyin('${item.initial}', '${item.speakSound}', '${item.word}')">
            <div class="pinyin-big">${item.initial}</div>
            <div style="font-size:24px; margin:4px 0;">${item.icon}</div>
            <div class="pinyin-word">${item.word}</div>
            <div class="pinyin-cn">${item.isDouble ? '双字母声母' : '单字母声母'}</div>
        </div>
    `).join('');
}

function speakPinyin(initial, speakSound, word) {
    speakText(`声母 ${initial}，${speakSound}，${word}的 ${initial}`, 'zh-CN');
}

// --- 3. 英文字母数据 ---
const alphabetData = [
    { big: 'A', small: 'a', word: 'Apple', cn: '苹果', icon: '🍎' },
    { big: 'B', small: 'b', word: 'Ball', cn: '皮球', icon: '⚽' },
    { big: 'C', small: 'c', word: 'Cat', cn: '小猫', icon: '🐱' },
    { big: 'D', small: 'd', word: 'Dog', cn: '小狗', icon: '🐶' },
    { big: 'E', small: 'e', word: 'Egg', cn: '鸡蛋', icon: '🥚' },
    { big: 'F', small: 'f', word: 'Fish', cn: '小鱼', icon: '🐟' },
    { big: 'G', small: 'g', word: 'Girl', cn: '女孩', icon: '👧' },
    { big: 'H', small: 'h', word: 'House', cn: '房子', icon: '🏠' },
    { big: 'I', small: 'i', word: 'Ice cream', cn: '冰淇淋', icon: '🍦' },
    { big: 'J', small: 'j', word: 'Juice', cn: '果汁', icon: '🧃' },
    { big: 'K', small: 'k', word: 'Kite', cn: '风筝', icon: '🪁' },
    { big: 'L', small: 'l', word: 'Lion', cn: '狮子', icon: '🦁' },
    { big: 'M', small: 'm', word: 'Moon', cn: '月亮', icon: '🌙' },
    { big: 'N', small: 'n', word: 'Noodle', cn: '面条', icon: '🍜' },
    { big: 'O', small: 'o', word: 'Orange', cn: '橙子', icon: '🍊' },
    { big: 'P', small: 'p', word: 'Pencil', cn: '铅笔', icon: '✏️' },
    { big: 'Q', small: 'q', word: 'Queen', cn: '女王', icon: '👑' },
    { big: 'R', small: 'r', word: 'Rabbit', cn: '兔子', icon: '🐰' },
    { big: 'S', small: 's', word: 'Sun', cn: '太阳', icon: '☀️' },
    { big: 'T', small: 't', word: 'Tiger', cn: '老虎', icon: '🐯' },
    { big: 'U', small: 'u', word: 'Umbrella', cn: '雨伞', icon: '☂️' },
    { big: 'V', small: 'v', word: 'Violin', cn: '小提琴', icon: '🎻' },
    { big: 'W', small: 'w', word: 'Water', cn: '水', icon: '💧' },
    { big: 'X', small: 'x', word: 'Xylophone', cn: '木琴', icon: '🎼' },
    { big: 'Y', small: 'y', word: 'Yellow', cn: '黄色', icon: '💛' },
    { big: 'Z', small: 'z', word: 'Zebra', cn: '斑马', icon: '🦓' }
];

function renderAlphabet() {
    const container = document.getElementById('alphabet-container');
    container.innerHTML = alphabetData.map(item => `
        <div class="letter-card" onclick="speakLetter('${item.big}', '${item.word}', '${item.cn}')">
            <div class="letter-big">${item.big} ${item.small}</div>
            <div style="font-size:24px; margin:4px 0;">${item.icon}</div>
            <div class="letter-word">${item.word}</div>
            <div class="letter-cn">${item.cn}</div>
        </div>
    `).join('');
}

function speakLetter(letter, word, cn) {
    speakText(`Letter ${letter}, ${word}, ${cn}`, 'en-US');
}

// --- 4. 打卡与奖励模块逻辑 ---
let dailyTasks = [
    { id: 1, title: '📖 朗读一首古诗', reward: 2, done: false },
    { id: 2, title: '🏃 完成运动 30 分钟', reward: 3, done: false },
    { id: 3, title: '🧮 完成 5 道算术题', reward: 2, done: false },
    { id: 4, title: '🔤 认识 5 个英语字母', reward: 1, done: false }
];

const rewardsList = [
    { title: '📺 看动画片 20 分钟', cost: 10, icon: '📺' },
    { title: '🍦 吃到美味冰淇淋', cost: 15, icon: '🍦' },
    { title: '🧸 获得一个小玩具', cost: 30, icon: '🧸' },
    { title: '🎡 周末游乐园门票', cost: 50, icon: '🎡' }
];

function renderDailyTasks() {
    const container = document.getElementById('task-container');
    container.innerHTML = dailyTasks.map(t => `
        <div class="task-item">
            <div class="task-info">${t.done ? '✅' : '📌'} ${t.title} <span style="color:#ffa502; font-size:13px;">(+${t.reward}⭐)</span></div>
            <button class="btn-check ${t.done ? 'completed' : ''}" onclick="completeTask(${t.id})">
                ${t.done ? '已打卡' : '点击打卡'}
            </button>
        </div>
    `).join('');
}

function completeTask(id) {
    const task = dailyTasks.find(t => t.id === id);
    if (task && !task.done) {
        task.done = true;
        updateStars(currentStars + task.reward);
        speakText(`太棒啦！完成任务${task.title}，获得 ${task.reward} 颗星星！`, 'zh-CN');
        renderDailyTasks();
    }
}

function resetDailyTasks() {
    dailyTasks.forEach(t => t.done = false);
    renderDailyTasks();
    speakText("今日打卡任务已重置！", 'zh-CN');
}

function renderRewards() {
    const container = document.getElementById('reward-container');
    container.innerHTML = rewardsList.map((r, i) => `
        <div class="reward-card">
            <div class="reward-icon">${r.icon}</div>
            <div class="reward-title">${r.title}</div>
            <div class="reward-cost">${r.cost} ⭐</div>
            <button class="btn-redeem" onclick="redeemReward(${i})">兑换</button>
        </div>
    `).join('');
}

function redeemReward(index) {
    const reward = rewardsList[index];
    if (currentStars >= reward.cost) {
        updateStars(currentStars - reward.cost);
        speakText(`恭喜你！成功兑换了${reward.title}！继续加油！`, 'zh-CN');
        alert(`🎉 兑换成功：${reward.title}`);
    } else {
        speakText(`星星不够哦，还需要 ${reward.cost - currentStars} 颗星星！`, 'zh-CN');
        alert(`⭐ 星星不够哦！还差 ${reward.cost - currentStars} 颗星星。`);
    }
}

// --- 5. 唐诗三百首精选库 (搜索逻辑修复) ---
const poemDatabase = [
    {
        title: '《饮湖上初晴后雨》',
        author: '宋 · 苏轼',
        content: '水光潋滟晴方好，\n山色空蒙雨亦奇。\n欲把西湖比西子，\n淡妆浓抹总相宜。',
        trans: '晴天时湖面波光粼粼，雨后山色空蒙，各有各的美。如果把西湖比作美女西施，淡妆浓抹都合适。',
        appr: '诗人用西施比喻西湖，形象地写出了西湖无论晴雨都美不胜收。',
        keywords: ['潋滟(波光闪动)', '空蒙(雾气迷蒙)']
    },
    {
        title: '《咏鹅》',
        author: '唐 · 骆宾王',
        content: '鹅，鹅，鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。',
        trans: '弯曲着脖子朝天歌唱。洁白的羽毛漂浮在碧绿的水面上，红色的脚掌划动着清澈的水波。',
        appr: '生动逼真地描写了白鹅游水时的优美姿态与活泼神情。',
        keywords: ['曲项(弯着脖子)', '拨(划动)']
    },
    {
        title: '《静夜思》',
        author: '唐 · 李白',
        content: '床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。',
        trans: '明亮的月光照在床前，好像地上铺了一层洁白的霜。抬起头看着明月，低下头思念家乡。',
        appr: '语言平实自然，深切表达了出门在外的游子对故乡的思念。',
        keywords: ['疑(怀疑/好似)', '举头(抬头)']
    },
    {
        title: '《春晓》',
        author: '唐 · 孟浩然',
        content: '春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。',
        trans: '春天不知不觉就到了早晨，到处能听到鸟儿欢快的叫声。昨夜听到了风雨声，不知花朵落下了多少。',
        appr: '抓住了春晨到处鸟语花香的蓬勃生机，语言清新自然。',
        keywords: ['不觉晓(不知不觉天亮)', '闻(听到)']
    },
    {
        title: '《悯农》',
        author: '唐 · 李绅',
        content: '锄禾日当午，\n汗滴禾下土。\n谁知盘中餐，\n粒粒皆辛苦。',
        trans: '农民在正午的烈日下锄禾，汗水滴入禾苗下的泥土。有谁知道盘之中的米饭，每一粒都是辛苦得来的。',
        appr: '教育孩子们要懂得珍惜粮食，体会劳动者的辛勤付出的伟大。',
        keywords: ['盘中餐(盘里的食物)', '皆(都是)']
    }
];

let currentPoemIndex = 0;

function renderPoem(poem) {
    document.getElementById('poem-title').innerText = poem.title;
    document.getElementById('poem-author').innerText = poem.author;
    document.getElementById('poem-content').innerHTML = poem.content.replace(/\n/g, '<br>');
    document.getElementById('poem-trans').innerText = poem.trans;
    document.getElementById('poem-appr').innerText = poem.appr;
    document.getElementById('poem-words').innerHTML = poem.keywords.map(k => `<span class="badge-tag">${k}</span>`).join(' ');
}

function nextPoem() {
    currentPoemIndex = (currentPoemIndex + 1) % poemDatabase.length;
    renderPoem(poemDatabase[currentPoemIndex]);
}

function readCurrentPoem() {
    const poem = poemDatabase[currentPoemIndex];
    const fullText = `${poem.title}。${poem.author}。${poem.content}`;
    speakText(fullText, 'zh-CN');
}

function searchPoem() {
    const query = document.getElementById('poem-search').value.trim();
    if (!query) {
        renderPoem(poemDatabase[currentPoemIndex]);
        return;
    }
    const matchIndex = poemDatabase.findIndex(p => p.title.includes(query) || p.author.includes(query) || p.content.includes(query));
    if (matchIndex !== -1) {
        currentPoemIndex = matchIndex;
        renderPoem(poemDatabase[currentPoemIndex]);
    }
}

// --- 6. 日常英语句子 ---
const englishSentences = [
    { en: "Put on your coat.", cn: "穿上外套。" },
    { en: "Let's wash our hands.", cn: "我们去洗手吧。" },
    { en: "I'm fine, thank you.", cn: "我很好，谢谢。" },
    { en: "Let's go outside.", cn: "我们出去吧。" },
    { en: "What's that?", cn: "那是什么？" },
    { en: "I love you!", cn: "我爱你！" },
    { en: "Have a nice day!", cn: "祝你有美好的一天！" },
    { en: "It's a book.", cn: "这是一本书。" },
    { en: "What's this?", cn: "这是什么？" },
    { en: "Time for breakfast!", cn: "吃早餐的时间到了！" },
    { en: "Good morning, teacher!", cn: "早上好，老师！" },
    { en: "Can I play with you?", cn: "我可以和你一起玩吗？" }
];

let currentEnglishOffset = 0;

function renderEnglishSentences() {
    const container = document.getElementById('english-sentence-container');
    const items = [];
    for (let i = 0; i < 4; i++) {
        const idx = (currentEnglishOffset + i) % englishSentences.length;
        items.push(englishSentences[idx]);
    }
    container.innerHTML = items.map(s => `
        <div class="english-item">
            <div class="english-text">
                <div class="english-en">🗣️ ${s.en}</div>
                <div class="english-cn">${s.cn}</div>
            </div>
            <button class="btn-icon-speak" onclick="speakText('${s.en}', 'en-US')">🔊</button>
        </div>
    `).join('');
}

function refreshEnglishSentences() {
    currentEnglishOffset = (currentEnglishOffset + 4) % englishSentences.length;
    renderEnglishSentences();
}

function searchEnglish() {
    const query = document.getElementById('english-search').value.toLowerCase().trim();
    if (!query) {
        renderEnglishSentences();
        return;
    }
    const filtered = englishSentences.filter(s => s.en.toLowerCase().includes(query) || s.cn.includes(query));
    const container = document.getElementById('english-sentence-container');
    container.innerHTML = filtered.map(s => `
        <div class="english-item">
            <div class="english-text">
                <div class="english-en">🗣️ ${s.en}</div>
                <div class="english-cn">${s.cn}</div>
            </div>
            <button class="btn-icon-speak" onclick="speakText('${s.en}', 'en-US')">🔊</button>
        </div>
    `).join('');
}

// --- 7. 单词卡 ---
const wordCardsData = [
    { en: 'Moon', cn: '月亮', icon: '🌙' },
    { en: 'House', cn: '房子', icon: '🏠' },
    { en: 'Sun', cn: '太阳', icon: '☀️' },
    { en: 'Bird', cn: '小鸟', icon: '🐦' },
    { en: 'Car', cn: '汽车', icon: '🚗' },
    { en: 'Apple', cn: '苹果', icon: '🍎' },
    { en: 'Book', cn: '书本', icon: '📖' },
    { en: 'Star', cn: '星星', icon: '⭐' }
];

let currentWordOffset = 0;

function renderWordCards() {
    const container = document.getElementById('word-card-container');
    const items = [];
    for (let i = 0; i < 4; i++) {
        const idx = (currentWordOffset + i) % wordCardsData.length;
        items.push(wordCardsData[idx]);
    }
    container.innerHTML = items.map(w => `
        <div class="word-card" onclick="speakText('${w.en}', 'en-US')">
            <div class="word-icon">${w.icon}</div>
            <div class="word-en">${w.en}</div>
            <div class="word-cn">${w.cn}</div>
        </div>
    `).join('');
}

function refreshWordCards() {
    currentWordOffset = (currentWordOffset + 4) % wordCardsData.length;
    renderWordCards();
}

// --- 8. 运动计时器逻辑 ---
let timerSeconds = 3600;
let timerInterval = null;

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    document.getElementById('timer-text').innerText = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) return;
    speakText("运动计时开始，加油哦！", 'zh-CN');
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            speakText("太棒了！1小时运动时间到啦！", 'zh-CN');
        }
    }, 1000);
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        speakText("运动已暂停", 'zh-CN');
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 3600;
    updateTimerDisplay();
}

// --- 9. 数学练习与防刷重复提交逻辑 ---
let currentAns = 11;
let mistakes = [];

function generateMathQuestion() {
    const inputEl = document.getElementById('math-ans');
    const btnEl = document.getElementById('math-submit-btn');
    inputEl.disabled = false;
    btnEl.disabled = false;

    const types = document.getElementsByName('math-type');
    let selectedType = '凑十法';
    for (let t of types) {
        if (t.checked) selectedType = t.value;
    }

    let num1, num2, symbol;
    if (selectedType === '凑十法') {
        num1 = Math.floor(Math.random() * 4) + 6;
        num2 = Math.floor(Math.random() * 4) + 5;
        symbol = '+';
        currentAns = num1 + num2;
    } else if (selectedType === '破十法') {
        num1 = Math.floor(Math.random() * 8) + 11;
        num2 = Math.floor(Math.random() * 8) + 2;
        symbol = '-';
        currentAns = num1 - num2;
    } else if (selectedType === '乘法口诀') {
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        symbol = '×';
        currentAns = num1 * num2;
    } else {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        symbol = '+';
        currentAns = num1 + num2;
    }

    document.getElementById('math-q-text').innerText = `${num1} ${symbol} ${num2} = ?`;
    inputEl.value = '';
    document.getElementById('math-feedback').innerText = '';
}

function checkMathAnswer() {
    const inputEl = document.getElementById('math-ans');
    const btnEl = document.getElementById('math-submit-btn');
    const userAns = parseInt(inputEl.value);
    const feedback = document.getElementById('math-feedback');
    const qText = document.getElementById('math-q-text').innerText;

    if (isNaN(userAns)) return;

    if (userAns === currentAns) {
        inputEl.disabled = true;
        btnEl.disabled = true;

        feedback.style.color = '#2ed573';
        feedback.innerText = '🎉 回答正确！获得 1 颗 ⭐';
        updateStars(currentStars + 1);
        speakText("回答正确，太棒了！", 'zh-CN');
        setTimeout(generateMathQuestion, 1500);
    } else {
        feedback.style.color = '#ff4757';
        feedback.innerText = `❌ 答错啦，正确答案是 ${currentAns}。已计入错题本！`;
        speakText(`答错了哦，正确答案是${currentAns}`, 'zh-CN');
        mistakes.push(`${qText.replace('?', userAns)} (正确: ${currentAns})`);
        renderMistakes();
    }
}

function renderMistakes() {
    const container = document.getElementById('mistake-list');
    if (mistakes.length === 0) {
        container.innerHTML = `<div style="color: #747d8c; font-size: 14px;">🎉 暂无错题，太棒啦！</div>`;
    } else {
        container.innerHTML = mistakes.map(m => `<div class="mistake-box">❌ ${m}</div>`).join('');
    }
}

function clearMistakes() {
    if (mistakes.length === 0) return;
    if (confirm("确定要清空错题本吗？")) {
        mistakes = [];
        renderMistakes();
        speakText("错题本已清空！", 'zh-CN');
    }
}

// --- 10. Tab 切换逻辑 (全导航覆盖) ---
function switchTab(tab, el) {
    if (el) {
        const items = document.querySelectorAll('.nav-item');
        items.forEach(i => i.classList.remove('active'));
        el.classList.add('active');
    }

    const modules = document.querySelectorAll('.module-section');
    if (tab === 'all') {
        modules.forEach(m => m.style.display = 'flex');
    } else {
        modules.forEach(m => m.style.display = 'none');
        if (tab === 'pinyin') document.getElementById('mod-pinyin').style.display = 'flex';
        if (tab === 'alphabet') document.getElementById('mod-alphabet').style.display = 'flex';
        if (tab === 'chinese') document.getElementById('mod-chinese').style.display = 'flex';
        if (tab === 'math') {
            document.getElementById('mod-math').style.display = 'flex';
            document.getElementById('mod-mistakes').style.display = 'flex';
        }
        if (tab === 'english') {
            document.getElementById('mod-english').style.display = 'flex';
            document.getElementById('mod-words').style.display = 'flex';
        }
        if (tab === 'exercise') document.getElementById('mod-exercise').style.display = 'flex';
        if (tab === 'tasks') document.getElementById('mod-tasks').style.display = 'flex';
        if (tab === 'mistakes') document.getElementById('mod-mistakes').style.display = 'flex';
        if (tab === 'rewards') document.getElementById('mod-rewards').style.display = 'flex';
    }
}

// 初始化
window.onload = function() {
    updateStars(currentStars);
    renderPinyin();
    renderAlphabet();
    renderDailyTasks();
    renderRewards();
    renderPoem(poemDatabase[0]);
    renderEnglishSentences();
    renderWordCards();
    generateMathQuestion();
    updateTimerDisplay();
};
