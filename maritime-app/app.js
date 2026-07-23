// 航海英语学习应用主程序

// ============================================
// 状态管理
// ============================================

let currentUser = null;
let users = JSON.parse(localStorage.getItem('maritime_users')) || [];
let currentVocabularyIndex = 0;
let currentVocabularyList = ALL_VOCABULARY;
let userProgress = JSON.parse(localStorage.getItem('user_progress')) || {};
let mediaRecorder = null;
let audioChunks = [];
let recordedAudio = null;

// ============================================
// 初始化应用
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkLoginStatus();
    // 测试账号
    initializeDemoAccount();
});

function initializeDemoAccount() {
    const demoExists = users.some(u => u.email === 'demo@maritime.com');
    if (!demoExists) {
        users.push({
            id: Date.now(),
            username: 'Demo User',
            email: 'demo@maritime.com',
            password: '123456',
            createdAt: new Date().toISOString()
        });
        saveUsers();
    }
}

// ============================================
// 事件监听器设置
// ============================================

function setupEventListeners() {
    // 认证页面
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchAuthTab);
    });

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // 导航
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', switchModule);
    });

    // 词汇学习
    document.getElementById('categoryFilter').addEventListener('change', filterVocabulary);
    document.getElementById('btnKnown').addEventListener('click', () => markWordStatus(true));
    document.getElementById('btnUnknown').addEventListener('click', () => markWordStatus(false));
    document.getElementById('pronounceBtn').addEventListener('click', pronounceWord);

    // 口语练习
    document.getElementById('btnRecord').addEventListener('click', startRecording);
    document.getElementById('btnStopRecord').addEventListener('click', stopRecording);
    document.getElementById('btnPlayAudio').addEventListener('click', playAudio);
    document.getElementById('btnPlayback').addEventListener('click', playRecording);
    document.getElementById('btnClear').addEventListener('click', clearRecording);
    document.getElementById('btnNextSpeaking').addEventListener('click', nextSpeakingWord);

    // 听力训练
    document.getElementById('btnPlayListening').addEventListener('click', playListeningAudio);
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', handleListeningAnswer);
    });
    document.getElementById('btnNextListening').addEventListener('click', nextListeningQuestion);
}

// ============================================
// 认证功能
// ============================================

function switchAuthTab(e) {
    const tab = e.target.dataset.tab;
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tab + 'Form').classList.add('active');
    e.target.classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        showMainPage();
    } else {
        alert('邮箱或密码错误！');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const password2 = document.getElementById('registerPassword2').value;

    if (password !== password2) {
        alert('密码不一致！');
        return;
    }

    if (users.some(u => u.email === email)) {
        alert('邮箱已被注册！');
        return;
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers();
    currentUser = newUser;
    localStorage.setItem('current_user', JSON.stringify(newUser));
    showMainPage();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('current_user');
    showAuthPage();
}

function checkLoginStatus() {
    const saved = localStorage.getItem('current_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        showMainPage();
    } else {
        showAuthPage();
    }
}

function showAuthPage() {
    document.getElementById('authPage').classList.add('active');
    document.getElementById('mainPage').classList.remove('active');
}

function showMainPage() {
    document.getElementById('authPage').classList.remove('active');
    document.getElementById('mainPage').classList.add('active');
    document.getElementById('userName').textContent = currentUser.username;
    loadUserProgress();
    switchModule({ target: document.querySelector('.nav-btn.active') });
}

// ============================================
// 数据持久化
// ============================================

function saveUsers() {
    localStorage.setItem('maritime_users', JSON.stringify(users));
}

function loadUserProgress() {
    const key = 'progress_' + currentUser.id;
    userProgress = JSON.parse(localStorage.getItem(key)) || {
        vocabulary: {},
        statistics: {
            totalLearned: 0,
            totalMastered: 0,
            learningDays: 1,
            lastUpdate: new Date().toISOString()
        }
    };
}

function saveUserProgress() {
    const key = 'progress_' + currentUser.id;
    localStorage.setItem(key, JSON.stringify(userProgress));
}

// ============================================
// 模块切换
// ============================================

function switchModule(e) {
    const module = e.target.dataset.module;
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.getElementById(module + 'Module').classList.add('active');

    if (module === 'vocabulary') {
        loadVocabulary();
    } else if (module === 'speaking') {
        loadSpeakingModule();
    } else if (module === 'listening') {
        loadListeningModule();
    } else if (module === 'progress') {
        loadProgressModule();
    }
}

// ============================================
// 词汇学习模块
// ============================================

function filterVocabulary() {
    const category = document.getElementById('categoryFilter').value;
    if (category) {
        currentVocabularyList = ALL_VOCABULARY.filter(v => v.category === category);
    } else {
        currentVocabularyList = ALL_VOCABULARY;
    }
    currentVocabularyIndex = 0;
    loadVocabulary();
}

function loadVocabulary() {
    if (currentVocabularyList.length === 0) {
        currentVocabularyList = ALL_VOCABULARY;
    }
    displayVocabulary();
}

function displayVocabulary() {
    if (currentVocabularyIndex >= currentVocabularyList.length) {
        currentVocabularyIndex = 0;
    }

    const word = currentVocabularyList[currentVocabularyIndex];
    
    document.getElementById('wordEnglish').textContent = word.english;
    document.getElementById('wordPronunciation').textContent = word.pronunciation;
    document.getElementById('wordPart').textContent = word.part;
    document.getElementById('wordChinese').textContent = word.chinese;
    document.getElementById('wordExample').textContent = word.example;
    
    const progress = ((currentVocabularyIndex + 1) / currentVocabularyList.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('wordCounter').textContent = `${currentVocabularyIndex + 1}/${currentVocabularyList.length}`;
}

function pronounceWord() {
    const word = currentVocabularyList[currentVocabularyIndex];
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word.english);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    }
}

function markWordStatus(known) {
    const word = currentVocabularyList[currentVocabularyIndex];
    const wordId = word.english;
    
    if (!userProgress.vocabulary[wordId]) {
        userProgress.vocabulary[wordId] = {
            known: false,
            learned: false,
            attempts: 0,
            lastReview: null
        };
    }
    
    userProgress.vocabulary[wordId].known = known;
    userProgress.vocabulary[wordId].attempts++;
    userProgress.vocabulary[wordId].lastReview = new Date().toISOString();
    
    if (known) {
        userProgress.vocabulary[wordId].learned = true;
        userProgress.statistics.totalMastered++;
    }
    userProgress.statistics.totalLearned++;
    
    saveUserProgress();
    
    currentVocabularyIndex++;
    displayVocabulary();
}

// ============================================
// 口语练习模块
// ============================================

function loadSpeakingModule() {
    const randomWord = currentVocabularyList[Math.floor(Math.random() * currentVocabularyList.length)];
    document.getElementById('speakingWord').textContent = randomWord.english;
    document.getElementById('speakingTranslation').textContent = randomWord.chinese;
    pronounceSpeakingWord(randomWord.english);
}

function pronounceSpeakingWord(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    }
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
            recordedAudio = new Blob(audioChunks, { type: 'audio/wav' });
            showRecordingPlayback();
        };
        
        mediaRecorder.start();
        document.getElementById('btnRecord').style.display = 'none';
        document.getElementById('btnStopRecord').style.display = 'inline-block';
        document.getElementById('recordingInfo').style.display = 'block';
    }).catch(err => {
        alert('无法访问麦克风：' + err.message);
    });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        document.getElementById('btnRecord').style.display = 'inline-block';
        document.getElementById('btnStopRecord').style.display = 'none';
        document.getElementById('recordingInfo').style.display = 'none';
    }
}

function playRecording() {
    if (recordedAudio) {
        const audio = new Audio(URL.createObjectURL(recordedAudio));
        audio.play();
    }
}

function clearRecording() {
    recordedAudio = null;
    audioChunks = [];
    document.getElementById('recordingPlayback').style.display = 'none';
    document.getElementById('btnRecord').style.display = 'inline-block';
}

function showRecordingPlayback() {
    document.getElementById('recordingPlayback').style.display = 'block';
    // 模拟评分
    const score = Math.floor(Math.random() * 40 + 60);
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('speechScore').style.display = 'block';
}

function nextSpeakingWord() {
    clearRecording();
    document.getElementById('speechScore').style.display = 'none';
    loadSpeakingModule();
}

function playAudio() {
    const word = document.getElementById('speakingWord').textContent;
    pronounceSpeakingWord(word);
}

// ============================================
// 听力训练模块
// ============================================

function loadListeningQuestion() {
    const word = currentVocabularyList[Math.floor(Math.random() * currentVocabularyList.length)];
    
    document.getElementById('listeningQuestion').textContent = `你将听到英文单词，请选择它的中文翻译`;
    
    // 生成选项
    const options = [word.chinese];
    while (options.length < 4) {
        const randomWord = currentVocabularyList[Math.floor(Math.random() * currentVocabularyList.length)];
        if (!options.includes(randomWord.chinese)) {
            options.push(randomWord.chinese);
        }
    }
    
    // 打乱顺序
    options.sort(() => Math.random() - 0.5);
    const correctAnswer = options.indexOf(word.chinese);
    
    // 保存答案到按钮
    document.querySelectorAll('.option-btn').forEach((btn, index) => {
        btn.textContent = String.fromCharCode(65 + index) + '. ' + options[index];
        btn.dataset.correct = index === correctAnswer;
        btn.classList.remove('selected', 'correct', 'incorrect');
        btn.disabled = false;
    });
    
    document.getElementById('listeningResult').style.display = 'none';
    
    // 播放单词
    setTimeout(() => {
        pronounceSpeakingWord(word.english);
    }, 500);
}

function loadListeningModule() {
    loadListeningQuestion();
}

function handleListeningAnswer(e) {
    const isCorrect = e.target.dataset.correct === 'true';
    
    e.target.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    document.querySelectorAll('.option-btn').forEach(btn => {
        if (btn.dataset.correct === 'true') {
            btn.classList.add('correct');
        }
        btn.disabled = true;
    });
    
    const resultText = isCorrect ? '✅ 正确!' : '❌ 错误，请再试一次';
    document.getElementById('resultText').textContent = resultText;
    document.getElementById('listeningResult').style.display = 'block';
}

function nextListeningQuestion() {
    loadListeningQuestion();
}

function playListeningAudio() {
    const word = currentVocabularyList[Math.floor(Math.random() * currentVocabularyList.length)];
    pronounceSpeakingWord(word.english);
}

// ============================================
// 学习进度模块
// ============================================

function loadProgressModule() {
    updateProgressStats();
    displayCategoryProgress();
    displayRecentActivity();
}

function updateProgressStats() {
    const totalWords = ALL_VOCABULARY.length;
    const masteredCount = Object.values(userProgress.vocabulary).filter(v => v.learned).length;
    const percentage = Math.round((masteredCount / totalWords) * 100);
    
    document.getElementById('totalWords').textContent = totalWords;
    document.getElementById('masteredWords').textContent = masteredCount;
    document.getElementById('progressPercentage').textContent = percentage + '%';
    document.getElementById('learningDays').textContent = userProgress.statistics.learningDays || 1;
}

function displayCategoryProgress() {
    const categories = [...new Set(ALL_VOCABULARY.map(v => v.category))];
    const html = categories.map(category => {
        const categoryWords = ALL_VOCABULARY.filter(v => v.category === category);
        const mastered = categoryWords.filter(w => {
            const prog = userProgress.vocabulary[w.english];
            return prog && prog.learned;
        }).length;
        const percentage = Math.round((mastered / categoryWords.length) * 100);
        
        return `
            <div class="category-item">
                <div class="category-name">
                    <span>${category}</span>
                    <span>${mastered}/${categoryWords.length}</span>
                </div>
                <div class="category-progress-bar">
                    <div class="category-progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('categoryProgress').innerHTML = html;
}

function displayRecentActivity() {
    const recentWords = Object.entries(userProgress.vocabulary)
        .sort((a, b) => new Date(b[1].lastReview) - new Date(a[1].lastReview))
        .slice(0, 5);
    
    const html = recentWords.map(([word, data]) => {
        const time = new Date(data.lastReview).toLocaleString('zh-CN');
        return `
            <div class="recent-item">
                <span class="word">${word}</span>
                <span class="time">${time}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('recentList').innerHTML = html || '<p style="color: #999;">暂无学习记录</p>';
}

console.log('Maritime English App initialized');
