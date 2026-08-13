// ==================== 1. 核心 TTS 朗读引擎 (极简版) ====================
function speakText(text, lang = 'zh-CN') {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // 立即停止上一句

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = parseFloat(document.getElementById('speech-rate')?.value || 0.9);
    utterance.pitch = parseFloat(document.getElementById('speech-pitch')?.value || 1.0);
    
    window.speechSynthesis.speak(utterance);
}

// 拼音点击：只读 “拼音, 词语” (例: "a，阿姨")
function speakPinyin(pinyin, word) {
    speakText(`${pinyin}，${word}`, 'zh-CN');
}

// 字母点击：只读 “字母, 单词” (例: "A, Apple")
function speakLetter(letter, word) {
    speakText(`${letter}, ${word}`, 'en-US');
}

// 单词点击：只读英文单词 (例: "apple")
function speakWord(en) {
    speakText(en, 'en-US');
}


// ==================== 2. 数据源 (拼音, 字母, 300单词) ====================

const pinyinData = [
    { pinyin: "a", word: "阿姨" }, { pinyin: "o", word: "噢噢" }, { pinyin: "e", word: "鹅" },
    { pinyin: "i", word: "衣服" }, { pinyin: "u", word: "乌龟" }, { pinyin: "ü", word: "小鱼" },
    { pinyin: "b", word: "芭蕾" }, { pinyin: "p", word: "泼水" }, { pinyin: "m", word: "摸摸" },
    { pinyin: "f", word: "大佛" }, { pinyin: "d", word: "得胜" }, { pinyin: "t", word: "特别" },
    { pinyin: "n", word: "牛奶" }, { pinyin: "l", word: "快乐" }, { pinyin: "g", word: "鸽子" },
    { pinyin: "k", word: "蝌蚪" }, { pinyin: "h", word: "喝水" }, { pinyin: "j", word: "小鸡" },
    { pinyin: "q", word: "气球" }, { pinyin: "x", word: "西瓜" }, { pinyin: "zh", word: "蜘蛛" },
    { pinyin: "ch", word: "吃东西" }, { pinyin: "sh", word: "狮子" }, { pinyin: "r", word: "日出" },
    { pinyin: "z", word: "自己" }, { pinyin: "c", word: "刺猬" }, { pinyin: "s", word: "思考" },
    { pinyin: "y", word: "鸭子" }, { pinyin: "w", word: "青蛙" }, { pinyin: "ai", word: "爱心" },
    { pinyin: "ei", word: "飞打" }, { pinyin: "ui", word: "围巾" }, { pinyin: "ao", word: "棉奥" },
    { pinyin: "ou", word: "海鸥" }, { pinyin: "iu", word: "游泳" }, { pinyin: "ie", word: "树叶" },
    { pinyin: "üe", word: "月亮" }, { pinyin: "er", word: "耳朵" }, { pinyin: "an", word: "天安门" },
    { pinyin: "en", word: "感恩" }, { pinyin: "in", word: "音乐" }, { pinyin: "un", word: "云朵" },
    { pinyin: "ün", word: "运输" }, { pinyin: "ang", word: "昂首" }, { pinyin: "eng", word: "台灯" },
    { pinyin: "ing", word: "老鹰" }, { pinyin: "ong", word: "闹钟" }
];

const alphabetData = [
    { letter: "A", word: "Apple", cn: "苹果" }, { letter: "B", word: "Banana", cn: "香蕉" },
    { letter: "C", word: "Cat", cn: "猫" }, { letter: "D", word: "Dog", cn: "狗" },
    { letter: "E", word: "Egg", cn: "鸡蛋" }, { letter: "F", word: "Fish", cn: "鱼" },
    { letter: "G", word: "Girl", cn: "女孩" }, { letter: "H", word: "Hat", cn: "帽子" },
    { letter: "I", word: "Ice", cn: "冰" }, { letter: "J", word: "Juice", cn: "果汁" },
    { letter: "K", word: "Kite", cn: "风筝" }, { letter: "L", word: "Lion", cn: "狮子" },
    { letter: "M", word: "Monkey", cn: "猴子" }, { letter: "N", word: "Nose", cn: "鼻子" },
    { letter: "O", word: "Orange", cn: "橙子" }, { letter: "P", word: "Pencil", cn: "铅笔" },
    { letter: "Q", word: "Queen", cn: "女王" }, { letter: "R", word: "Rabbit", cn: "兔子" },
    { letter: "S", word: "Sun", cn: "太阳" }, { letter: "T", word: "Tiger", cn: "老虎" },
    { letter: "U", word: "Umbrella", cn: "雨伞" }, { letter: "V", word: "Violin", cn: "小提琴" },
    { letter: "W", word: "Water", cn: "水" }, { letter: "X", word: "X-ray", cn: "X光" },
    { letter: "Y", word: "Yellow", cn: "黄色" }, { letter: "Z", word: "Zebra", cn: "斑马" }
];

// 300 词库
const wordList = [
    // 动物 30
    { icon: "🐶", en: "dog", cn: "狗" }, { icon: "🐱", en: "cat", cn: "猫" }, { icon: "🐭", en: "mouse", cn: "老鼠" },
    { icon: "🐰", en: "rabbit", cn: "兔子" }, { icon: "🐻", en: "bear", cn: "熊" }, { icon: "🐼", en: "panda", cn: "熊猫" },
    { icon: "🐯", en: "tiger", cn: "老虎" }, { icon: "狮", en: "lion", cn: "狮子" }, { icon: "🐮", en: "cow", cn: "奶牛" },
    { icon: "🐷", en: "pig", cn: "猪" }, { icon: "🐵", en: "monkey", cn: "猴子" }, { icon: "🦆", en: "duck", cn: "鸭子" },
    { icon: "🐔", en: "chicken", cn: "小鸡" }, { icon: "🐦", en: "bird", cn: "小鸟" }, { icon: "青", en: "frog", cn: "青蛙" },
    { icon: "🐘", en: "elephant", cn: "大象" }, { icon: "长", en: "giraffe", cn: "长颈鹿" }, { icon: "斑", en: "zebra", cn: "斑马" },
    { icon: "🐴", en: "horse", cn: "马" }, { icon: "🐑", en: "sheep", cn: "绵羊" }, { icon: "🐐", en: "goat", cn: "山羊" },
    { icon: "🦊", en: "fox", cn: "狐狸" }, { icon: "🐺", en: "wolf", cn: "狼" }, { icon: "🐍", en: "snake", cn: "蛇" },
    { icon: "🐢", en: "turtle", cn: "乌龟" }, { icon: "🐟", en: "fish", cn: "鱼" }, { icon: "海", en: "dolphin", cn: "海豚" },
    { icon: "🐳", en: "whale", cn: "鲸鱼" }, { icon: "🐝", en: "bee", cn: "蜜蜂" }, { icon: "🦋", en: "butterfly", cn: "蝴蝶" },

    // 果蔬 30
    { icon: "🍎", en: "apple", cn: "苹果" }, { icon: "🍌", en: "banana", cn: "香蕉" }, { icon: "🍊", en: "orange", cn: "橙子" },
    { icon: "🍇", en: "grape", cn: "葡萄" }, { icon: "🍉", en: "watermelon", cn: "西瓜" }, { icon: "🍓", en: "strawberry", cn: "草莓" },
    { icon: "🍑", en: "peach", cn: "蜜桃" }, { icon: "🍍", en: "pineapple", cn: "菠萝" }, { icon: "芒", en: "mango", cn: "芒果" },
    { icon: "🍋", en: "lemon", cn: "柠檬" }, { icon: "🍒", en: "cherry", cn: "樱桃" }, { icon: "梨", en: "pear", cn: "梨" },
    { icon: "🥑", en: "avocado", cn: "牛油果" }, { icon: "椰", en: "coconut", cn: "椰子" }, { icon: "🍅", en: "tomato", cn: "番茄" },
    { icon: "🥔", en: "potato", cn: "土豆" }, { icon: "🥕", en: "carrot", cn: "胡萝卜" }, { icon: "🌽", en: "corn", cn: "玉米" },
    { icon: "黄", en: "cucumber", cn: "黄瓜" }, { icon: "🥦", en: "broccoli", cn: "西兰花" }, { icon: "洋", en: "onion", cn: "洋葱" },
    { icon: "蒜", en: "garlic", cn: "大蒜" }, { icon: "🍄", en: "mushroom", cn: "蘑菇" }, { icon: "🎃", en: "pumpkin", cn: "南瓜" },
    { icon: "茄", en: "eggplant", cn: "茄子" }, { icon: "🌱", en: "bean", cn: "豆角" }, { icon: "🌶️", en: "pepper", cn: "辣椒" },
    { icon: "🥬", en: "cabbage", cn: "卷心菜" }, { icon: "🥗", en: "salad", cn: "沙拉" }, { icon: "瓜", en: "melon", cn: "哈密瓜" },

    // 食物与饮品 25
    { icon: "🍚", en: "rice", cn: "米饭" }, { icon: "🍜", en: "noodle", cn: "面条" }, { icon: "🍞", en: "bread", cn: "面包" },
    { icon: "🥚", en: "egg", cn: "鸡蛋" }, { icon: "🥛", en: "milk", cn: "牛奶" }, { icon: "💧", en: "water", cn: "水" },
    { icon: "🧃", en: "juice", cn: "果汁" }, { icon: "🍵", en: "tea", cn: "茶" }, { icon: "🥩", en: "meat", cn: "肉" },
    { icon: "🍗", en: "chicken", cn: "鸡肉" }, { icon: "🍰", en: "cake", cn: "蛋糕" }, { icon: "🍦", en: "ice cream", cn: "冰淇淋" },
    { icon: "🍕", en: "pizza", cn: "披萨" }, { icon: "🍔", en: "hamburger", cn: "汉堡" }, { icon: "🍟", en: "fries", cn: "薯条" },
    { icon: "🥪", en: "sandwich", cn: "三明治" }, { icon: "🍫", en: "chocolate", cn: "巧克力" }, { icon: "🍬", en: "candy", cn: "糖果" },
    { icon: "🍪", en: "cookie", cn: "饼干" }, { icon: "🍲", en: "soup", cn: "汤" }, { icon: "🧀", en: "cheese", cn: "奶酪" },
    { icon: "🧈", en: "butter", cn: "黄油" }, { icon: "爆", en: "popcorn", cn: "爆米花" }, { icon: "🍯", en: "honey", cn: "蜂蜜" },
    { icon: "🥮", en: "mooncakes", cn: "月饼" },

    // 人物与家庭 20
    { icon: "👨", en: "father", cn: "爸爸" }, { icon: "👩", en: "mother", cn: "妈妈" }, { icon: "👴", en: "grandfather", cn: "爷爷" },
    { icon: "👵", en: "grandmother", cn: "奶奶" }, { icon: "👦", en: "brother", cn: "兄弟" }, { icon: "👧", en: "sister", cn: "姐妹" },
    { icon: "👶", en: "baby", cn: "婴儿" }, { icon: "👨‍👩‍👧", en: "family", cn: "家庭" }, { icon: "🧑", en: "man", cn: "男人" },
    { icon: "👩", en: "woman", cn: "女人" }, { icon: "🧒", en: "child", cn: "儿童" }, { icon: "🧑‍🤝‍🧑", en: "friend", cn: "朋友" },
    { icon: "👨‍🏫", en: "teacher", cn: "老师" }, { icon: "🧑‍🎓", en: "student", cn: "学生" }, { icon: "👨‍⚕️", en: "doctor", cn: "医生" },
    { icon: "👩‍⚕️", en: "nurse", cn: "护士" }, { icon: "👮", en: "police", cn: "警察" }, { icon: "👨‍🚒", en: "firefighter", cn: "消防员" },
    { icon: "👨‍🍳", en: "cook", cn: "厨师" }, { icon: "👨‍🚀", en: "astronaut", cn: "宇航员" },

    // 身体部位 20
    { icon: "🗣️", en: "head", cn: "头部" }, { icon: "👀", en: "eye", cn: "眼睛" }, { icon: "👂", en: "ear", cn: "耳朵" },
    { icon: "👃", en: "nose", cn: "鼻子" }, { icon: "👄", en: "mouth", cn: "嘴巴" }, { icon: "🦷", en: "tooth", cn: "牙齿" },
    { icon: "👅", en: "tongue", cn: "舌头" }, { icon: "😀", en: "face", cn: "脸" }, { icon: "💇", en: "hair", cn: "头发" },
    { icon: "💪", en: "arm", cn: "手臂" }, { icon: "🖐️", en: "hand", cn: "手" }, { icon: "☝️", en: "finger", cn: "手指" },
    { icon: "🦵", en: "leg", cn: "腿" }, { icon: "🦶", en: "foot", cn: "脚" }, { icon: "🦶", en: "toe", cn: "脚趾" },
    { icon: "🫀", en: "heart", cn: "心脏" }, { icon: "🫁", en: "lung", cn: "肺" }, { icon: "骨", en: "bone", cn: "骨头" },
    { icon: "🩸", en: "blood", cn: "血液" }, { icon: "🧠", en: "brain", cn: "大脑" },

    // 颜色与形状 20
    { icon: "🔴", en: "red", cn: "红色" }, { icon: "🟡", en: "yellow", cn: "黄色" }, { icon: "🔵", en: "blue", cn: "蓝色" },
    { icon: "🟢", en: "green", cn: "绿色" }, { icon: "🟠", en: "orange", cn: "橙色" }, { icon: "🟣", en: "purple", cn: "紫色" },
    { icon: "🩷", en: "pink", cn: "粉色" }, { icon: "🟤", en: "brown", cn: "棕色" }, { icon: "🖤", en: "black", cn: "黑色" },
    { icon: "⚪", en: "white", cn: "白色" }, { icon: "🩶", en: "gray", cn: "灰色" }, { icon: "🪙", en: "gold", cn: "金色" },
    { icon: "⭕", en: "circle", cn: "圆形" }, { icon: "⏹️", en: "square", cn: "正方形" }, { icon: "🔺", en: "triangle", cn: "三角形" },
    { icon: "⭐", en: "star", cn: "星形" }, { icon: "❤️", en: "heart", cn: "心形" }, { icon: "🔷", en: "diamond", cn: "菱形" },
    { icon: "椭", en: "oval", cn: "椭圆形" }, { icon: "长", en: "rectangle", cn: "长方形" },

    // 数字与时间 20
    { icon: "1️⃣", en: "one", cn: "一" }, { icon: "2️⃣", en: "two", cn: "二" }, { icon: "3️⃣", en: "three", cn: "三" },
    { icon: "4️⃣", en: "four", cn: "四" }, { icon: "5️⃣", en: "five", cn: "五" }, { icon: "6️⃣", en: "six", cn: "六" },
    { icon: "7️⃣", en: "seven", cn: "七" }, { icon: "8️⃣", en: "eight", cn: "八" }, { icon: "9️⃣", en: "nine", cn: "九" },
    { icon: "🔟", en: "ten", cn: "十" }, { icon: "⏰", en: "clock", cn: "时钟" }, { icon: "⌚", en: "watch", cn: "手表" },
    { icon: "☀️", en: "day", cn: "白天" }, { icon: "🌙", en: "night", cn: "夜晚" }, { icon: "🌅", en: "morning", cn: "早晨" },
    { icon: "🌆", en: "evening", cn: "傍晚" }, { icon: "📅", en: "year", cn: "年份" }, { icon: "🗓️", en: "month", cn: "月份" },
    { icon: "📆", en: "week", cn: "星期" }, { icon: "⏳", en: "time", cn: "时间" },

    // 学校用品 25
    { icon: "🏫", en: "school", cn: "学校" }, { icon: "教", en: "classroom", cn: "教室" }, { icon: "📖", en: "book", cn: "书本" },
    { icon: "✏️", en: "pencil", cn: "铅笔" }, { icon: "🖊️", en: "pen", cn: "钢笔" }, { icon: "🖍️", en: "crayon", cn: "蜡笔" },
    { icon: "橡", en: "eraser", cn: "橡皮擦" }, { icon: "📏", en: "ruler", cn: "尺子" }, { icon: "✂️", en: "scissors", cn: "剪刀" },
    { icon: "🎒", en: "bag", cn: "书包" }, { icon: "桌", en: "desk", cn: "课桌" }, { icon: "🪑", en: "chair", cn: "椅子" },
    { icon: "⬛", en: "blackboard", cn: "黑板" }, { icon: "📄", en: "paper", cn: "纸张" }, { icon: "🎨", en: "paint", cn: "颜料" },
    { icon: "🖌️", en: "brush", cn: "画笔" }, { icon: "💻", en: "computer", cn: "电脑" }, { icon: "🗺️", en: "map", cn: "地图" },
    { icon: "🌐", en: "globe", cn: "地球仪" }, { icon: "🔔", en: "bell", cn: "铃铛" }, { icon: "📝", en: "test", cn: "考试" },
    { icon: "📐", en: "math", cn: "数学" }, { icon: "🧪", en: "science", cn: "科学" }, { icon: "🎵", en: "music", cn: "音乐" },
    { icon: "⚽", en: "sports", cn: "体育" },

    // 家居物品 30
    { icon: "🏠", en: "house", cn: "房子" }, { icon: "🚪", en: "door", cn: "门" }, { icon: "🪟", en: "window", cn: "窗户" },
    { icon: "🛏️", en: "bed", cn: "床" }, { icon: "🛋️", en: "sofa", cn: "沙发" }, { icon: "桌", en: "table", cn: "桌子" },
    { icon: "📺", en: "tv", cn: "电视" }, { icon: "💡", en: "lamp", cn: "台灯" }, { icon: "🔑", en: "key", cn: "钥匙" },
    { icon: "📱", en: "phone", cn: "电话" }, { icon: "🪞", en: "mirror", cn: "镜子" }, { icon: "🪥", en: "toothbrush", cn: "牙刷" },
    { icon: "肥", en: "soap", cn: "肥皂" }, { icon: "毛", en: "towel", cn: "毛巾" }, { icon: "📦", en: "box", cn: "盒子" },
    { icon: "桶", en: "bucket", cn: "水桶" }, { icon: "扫", en: "broom", cn: "扫帚" }, { icon: "🔒", en: "lock", cn: "锁" },
    { icon: "⏰", en: "clock", cn: "闹钟" }, { icon: "🥛", en: "cup", cn: "杯子" }, { icon: "盘", en: "plate", cn: "盘子" },
    { icon: "🥣", en: "bowl", cn: "碗" }, { icon: "🥄", en: "spoon", cn: "勺子" }, { icon: "🍴", en: "fork", cn: "叉子" },
    { icon: "🔪", en: "knife", cn: "刀" }, { icon: "🗑️", en: "bin", cn: "垃圾桶" }, { icon: "☂️", en: "umbrella", cn: "雨伞" },
    { icon: "🖼️", en: "picture", cn: "画" }, { icon: "🔋", en: "battery", cn: "电池" }, { icon: "🎁", en: "gift", cn: "礼物" },

    // 服饰 15
    { icon: "👕", en: "shirt", cn: "衬衫" }, { icon: "👕", en: "t-shirt", cn: "T恤" }, { icon: "👖", en: "pants", cn: "裤子" },
    { icon: "👗", en: "dress", cn: "连衣裙" }, { icon: "裙", en: "skirt", cn: "短裙" }, { icon: "🧥", en: "coat", cn: "外套" },
    { icon: "🧦", en: "socks", cn: "袜子" }, { icon: "👟", en: "shoes", cn: "鞋子" }, { icon: "🧢", en: "hat", cn: "帽子" },
    { icon: "🧤", en: "gloves", cn: "手套" }, { icon: "🧣", en: "scarf", cn: "围巾" }, { icon: "👓", en: "glasses", cn: "眼镜" },
    { icon: "👔", en: "tie", cn: "领带" }, { icon: "裤", en: "shorts", cn: "短裤" }, { icon: "👢", en: "boots", cn: "靴子" },

    // 交通 20
    { icon: "🚗", en: "car", cn: "汽车" }, { icon: "🚌", en: "bus", cn: "公交车" }, { icon: "🚲", en: "bike", cn: "自行车" },
    { icon: "🏍️", en: "motorcycle", cn: "摩托车" }, { icon: "🚂", en: "train", cn: "火车" }, { icon: "✈️", en: "plane", cn: "飞机" },
    { icon: "🚁", en: "helicopter", cn: "直升机" }, { icon: "🚢", en: "ship", cn: "轮船" }, { icon: "🚤", en: "boat", cn: "小船" },
    { icon: "🚀", en: "rocket", cn: "火箭" }, { icon: "出租", en: "taxi", cn: "出租车" }, { icon: "🚑", en: "ambulance", cn: "救护车" },
    { icon: "🚒", en: "fire engine", cn: "消防车" }, { icon: "警", en: "police car", cn: "警车" }, { icon: "🚚", en: "truck", cn: "卡车" },
    { icon: "拖", en: "tractor", cn: "拖拉机" }, { icon: "🚇", en: "subway", cn: "地铁" }, { icon: "伞", en: "parachute", cn: "降落伞" },
    { icon: "🛸", en: "ufo", cn: "飞碟" }, { icon: "轮", en: "wheel", cn: "车轮" },

    // 自然天气 25
    { icon: "☀️", en: "sun", cn: "太阳" }, { icon: "🌙", en: "moon", cn: "月亮" }, { icon: "⭐", en: "star", cn: "星星" },
    { icon: "☁️", en: "cloud", cn: "云" }, { icon: "🌧️", en: "rain", cn: "雨" }, { icon: "❄️", en: "snow", cn: "雪" },
    { icon: "💨", en: "wind", cn: "风" }, { icon: "🌈", en: "rainbow", cn: "彩虹" }, { icon: "⚡", en: "lightning", cn: "闪电" },
    { icon: "🌳", en: "tree", cn: "树木" }, { icon: "🌸", en: "flower", cn: "花朵" }, { icon: "🌱", en: "grass", cn: "草" },
    { icon: "🍃", en: "leaf", cn: "树叶" }, { icon: "⛰️", en: "mountain", cn: "大山" }, { icon: "河", en: "river", cn: "河流" },
    { icon: "🌊", en: "sea", cn: "大海" }, { icon: "沙", en: "beach", cn: "沙滩" }, { icon: "沙", en: "desert", cn: "沙漠" },
    { icon: "石", en: "stone", cn: "石头" }, { icon: "🔥", en: "fire", cn: "火" }, { icon: "冰", en: "ice", cn: "冰" },
    { icon: "🌲", en: "forest", cn: "森林" }, { icon: "岛", en: "island", cn: "岛屿" }, { icon: "🪐", en: "planet", cn: "行星" },
    { icon: "🌌", en: "sky", cn: "天空" },

    // 动作 25
    { icon: "跑", en: "run", cn: "跑" }, { icon: "走", en: "walk", cn: "走" }, { icon: "跳", en: "jump", cn: "跳" },
    { icon: "🏊", en: "swim", cn: "游泳" }, { icon: "舞", en: "dance", cn: "跳舞" }, { icon: "唱", en: "sing", cn: "唱歌" },
    { icon: "读", en: "read", cn: "阅读" }, { icon: "写", en: "write", cn: "写字" }, { icon: "画", en: "draw", cn: "绘画" },
    { icon: "吃", en: "eat", cn: "吃" }, { icon: "喝", en: "drink", cn: "喝" }, { icon: "睡", en: "sleep", cn: "睡觉" },
    { icon: "看", en: "look", cn: "看" }, { icon: "听", en: "listen", cn: "听" }, { icon: "说", en: "speak", cn: "说" },
    { icon: "玩", en: "play", cn: "玩耍" }, { icon: "洗", en: "wash", cn: "洗" }, { icon: "扫", en: "clean", cn: "打扫" },
    { icon: "做", en: "cook", cn: "做饭" }, { icon: "买", en: "buy", cn: "购买" }, { icon: "驾", en: "drive", cn: "驾驶" },
    { icon: "飞", en: "fly", cn: "飞" }, { icon: "爬", en: "climb", cn: "攀爬" }, { icon: "帮", en: "help", cn: "帮助" },
    { icon: "爱", en: "love", cn: "爱" }
];

// 古诗数据
const poems = [
    { title: "咏鹅", author: "[唐] 骆宾王", content: "鹅，鹅，鹅，曲项向天歌。<br>白毛浮绿水，红掌拨清波。" },
    { title: "静夜思", author: "[唐] 李白", content: "床前明月光，疑是地上霜。<br>举头望明月，低头思故乡。" },
    { title: "悯农", author: "[唐] 李绅", content: "锄禾日当午，汗滴禾下土。<br>谁知盘中餐，粒粒皆辛苦。" },
    { title: "春晓", author: "[唐] 孟浩然", content: "春眠不觉晓，处处闻啼鸟。<br>夜来风雨声，花落知多少。" }
];

// 打卡任务与奖励数据
let userStars = parseInt(localStorage.getItem('userStars') || '0');
const tasks = [
    { id: 1, text: "📖 朗读10个拼音/字母", reward: 2 },
    { id: 2, text: "🧮 完成5道算术练习", reward: 3 },
    { id: 3, text: "⏱️ 坚持运动/专注 10分钟", reward: 5 },
    { id: 4, text: "🎴 认读10个英语单词", reward: 2 }
];

const rewards = [
    { title: "看动画片15分钟", cost: 10, icon: "📺" },
    { title: "吃一块小蛋糕", cost: 15, icon: "🍰" },
    { title: "去公园玩耍", cost: 20, icon: "🛝" },
    { title: "买一款新玩具", cost: 50, icon: "🧸" }
];


// ==================== 3. 页面渲染与交互逻辑 ====================

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    updateStarsDisplay();
    renderPinyin();
    renderAlphabet();
    renderWords(wordList);
    renderTasks();
    renderRewards();
    generateMathQuestion();
});

// 切换选项卡
function switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');

    const selectedNav = Array.from(document.querySelectorAll('.nav-item')).find(el => el.getAttribute('onclick').includes(tabId));
    if (selectedNav) selectedNav.classList.add('active');

    const targetSec = document.getElementById(`sec-${tabId}`);
    if (targetSec) targetSec.style.display = 'flex';
}

// 渲染拼音网格
function renderPinyin() {
    const container = document.getElementById('pinyin-container');
    container.innerHTML = pinyinData.map(item => `
        <div class="pinyin-card" onclick="speakPinyin('${item.pinyin}', '${item.word}')">
            <div class="pinyin-big">${item.pinyin}</div>
            <div class="pinyin-word">${item.word}</div>
        </div>
    `).join('');
}

// 渲染字母网格
function renderAlphabet() {
    const container = document.getElementById('alphabet-container');
    container.innerHTML = alphabetData.map(item => `
        <div class="letter-card" onclick="speakLetter('${item.letter}', '${item.word}')">
            <div class="letter-big">${item.letter}</div>
            <div class="letter-word">${item.word}</div>
            <div class="letter-cn">${item.cn}</div>
        </div>
    `).join('');
}

// 渲染单词卡网格
function renderWords(list) {
    const container = document.getElementById('words-container');
    container.innerHTML = list.map(item => `
        <div class="word-card" onclick="speakWord('${item.en}')">
            <div class="word-icon">${item.icon}</div>
            <div class="word-en">${item.en}</div>
            <div class="word-cn">${item.cn}</div>
        </div>
    `).join('');
}

// 单词搜索过滤
function filterWords() {
    const query = document.getElementById('word-search').value.toLowerCase().trim();
    const filtered = wordList.filter(item => 
        item.en.toLowerCase().includes(query) || item.cn.includes(query)
    );
    renderWords(filtered);
}


// ==================== 4. 算术模块 ====================
let currentMath = { a: 0, b: 0, op: '+', ans: 0 };
let mistakeBook = [];

function generateMathQuestion() {
    const range = parseInt(document.querySelector('input[name="math-range"]:checked')?.value || '10');
    const isSub = Math.random() > 0.5;
    
    let a, b, ans;
    if (isSub) {
        a = Math.floor(Math.random() * range) + 1;
        b = Math.floor(Math.random() * a);
        ans = a - b;
        currentMath = { a, b, op: '-', ans };
    } else {
        a = Math.floor(Math.random() * (range - 1)) + 1;
        b = Math.floor(Math.random() * (range - a)) + 1;
        ans = a + b;
        currentMath = { a, b, op: '+', ans };
    }

    document.getElementById('math-q-text').innerText = `${a} ${currentMath.op} ${b} = ?`;
    document.getElementById('math-answer').value = '';
    document.getElementById('math-feedback').innerText = '';
}

function checkMathAnswer() {
    const userAns = parseInt(document.getElementById('math-answer').value);
    const feedback = document.getElementById('math-feedback');

    if (isNaN(userAns)) return;

    if (userAns === currentMath.ans) {
        feedback.style.color = '#2ed573';
        feedback.innerText = '🎉 太棒了，答对了！';
        addStars(1);
        setTimeout(generateMathQuestion, 1200);
    } else {
        feedback.style.color = '#ff4757';
        feedback.innerText = '❌ 再想想哦！';
        addMistake(`${currentMath.a} ${currentMath.op} ${currentMath.b} = ${currentMath.ans} (你的答案: ${userAns})`);
    }
}

function addMistake(text) {
    if (!mistakeBook.includes(text)) {
        mistakeBook.push(text);
        renderMistakes();
    }
}

function renderMistakes() {
    const list = document.getElementById('mistake-list');
    if (mistakeBook.length === 0) {
        list.innerHTML = `<div style="color:#a4b0be; font-size:13px;">暂无错题，继续保持哦！</div>`;
        return;
    }
    list.innerHTML = mistakeBook.map(item => `<div class="mistake-box">${item}</div>`).join('');
}


// ==================== 5. 运动/专注计时器 ====================
let timerInterval = null;
let secondsLeft = 0;

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        secondsLeft++;
        const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
        const secs = String(secondsLeft % 60).padStart(2, '0');
        document.getElementById('timer-display').innerText = `${mins}:${secs}`;
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    secondsLeft = 0;
    document.getElementById('timer-display').innerText = "00:00";
}


// ==================== 6. 打卡与奖励系统 ====================

function addStars(num) {
    userStars += num;
    localStorage.setItem('userStars', userStars);
    updateStarsDisplay();
}

function updateStarsDisplay() {
    document.getElementById('user-stars').innerText = userStars;
}

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = tasks.map(t => `
        <div class="task-item">
            <span>${t.text} (+${t.reward} ⭐)</span>
            <button class="btn-check" onclick="completeTask(this, ${t.reward})">打卡</button>
        </div>
    `).join('');
}

function completeTask(btn, reward) {
    if (btn.classList.contains('completed')) return;
    btn.classList.add('completed');
    btn.innerText = '已完成';
    addStars(reward);
}

function renderRewards() {
    const grid = document.getElementById('reward-grid');
    grid.innerHTML = rewards.map(r => `
        <div class="reward-card">
            <div class="reward-icon">${r.icon}</div>
            <div class="reward-title">${r.title}</div>
            <div class="reward-cost">${r.cost} ⭐</div>
            <button class="btn-redeem" onclick="redeemReward(${r.cost})">兑换</button>
        </div>
    `).join('');
}

function redeemReward(cost) {
    if (userStars >= cost) {
        addStars(-cost);
        alert('🎉 兑换成功！快去享受你的奖励吧！');
    } else {
        alert('⭐ 星星不够哦，多做练习积累星星吧！');
    }
}


// ==================== 7. 古诗模块 ====================
let poemIdx = 0;

function nextPoem() {
    poemIdx = (poemIdx + 1) % poems.length;
    const p = poems[poemIdx];
    document.getElementById('poem-title').innerText = p.title;
    document.getElementById('poem-author').innerText = p.author;
    document.getElementById('poem-content').innerHTML = p.content;
}

function speakCurrentPoem() {
    const p = poems[poemIdx];
    const text = `${p.title}。${p.author}。${p.content.replace(/<br>/g, '，')}`;
    speakText(text, 'zh-CN');
}
