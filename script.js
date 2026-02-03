const questions = [
    {w:["Konuşmaya Başlamak","Ses çıkarabilmek"],a:"Dile Gelmek"},
    {w:["Hayvanları otlatmak","Amacı sürdürmek"],a:"Gütmek"},
    {w:["Korkusuz","Atılgan","Güçlü"],a:"Yaman"},
    {w:["Savaşta Kullanılan Uzun Mızrak"],a:"Kargı"},
    {w:["Büyük Şölen","Eğlence","Ziyafet"],a:"Toy"},
    {w:["Millet","Halk"],a:"Budun"},
    {w:["Kesin Talimat","Emir"],a:"Buyruk"},
    {w:["Yeterli Olmak","Ulaşmak"],a:"Yetmek"},
    {w:["Umut Bağlamak","Güvenmek"],a:"Bel Bağlamak"},
    {w:["Varmak","Ulaşmak"],a:"Erişmek"},
    {w:["Savaş"],a:"Harp"},
    {w:["Buyruk","Ferman"],a:"Yarlık"},
    
];

const allWords = questions.map(q => q.a);
let remaining = [...questions];
let lives = 3;
let score = 0;
let current = null;
let startTime = null;
let timerInterval = null;
let wrongAnswersCount = 0;
let totalQuestions = questions.length;
let answeredQuestions = 0;

// DOM Elementleri
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("game");
const winScreen = document.getElementById("winScreen");
const loseScreen = document.getElementById("loseScreen");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const messageEl = document.getElementById("message");
const livesEl = document.getElementById("lives");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");
const finalTimeEl = document.getElementById("finalTime");
const finalScoreEl = document.getElementById("finalScore");
const loseTimeEl = document.getElementById("loseTime");
const loseScoreEl = document.getElementById("loseScore");
const wrongAnswersEl = document.getElementById("wrongAnswers");

function startGame() {
    // Sıfırlama
    remaining = [...questions];
    lives = 3;
    score = 0;
    wrongAnswersCount = 0;
    answeredQuestions = 0;
    
    // Ekranları ayarla
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    winScreen.classList.add("hidden");
    loseScreen.classList.add("hidden");
    
    // UI'ı güncelle
    updateUI();
    
    // Zamanlayıcıyı başlat
    startTimer();
    
    // İlk soruyu yükle
    loadQuestion();
}

function startTimer() {
    startTime = new Date();
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        
        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function getTimeString() {
    if (!startTime) return "00:00";
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateUI() {
    livesEl.textContent = lives;
    scoreEl.textContent = score;
    progressEl.textContent = `${answeredQuestions}/${totalQuestions}`;
}

function loadQuestion() {
    if (remaining.length === 0) {
        showWinScreen();
        return;
    }
    
    // Rastgele soru seç
    const randomIndex = Math.floor(Math.random() * remaining.length);
    current = remaining[randomIndex];
    remaining.splice(randomIndex, 1);
    
    // Soruyu göster
    questionEl.textContent = current.w.join(" • ");
    
    // Seçenekleri yükle
    loadOptions();
    
    // Mesajı temizle
    messageEl.textContent = "";
    messageEl.className = "message";
}

function loadOptions() {
    optionsEl.innerHTML = "";
    
    // Rastgele 5 kelime seç (doğru cevap + 4 yanlış)
    const wrongWords = allWords.filter(w => w !== current.a);
    const shuffledWrongs = [...wrongWords]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    
    const allOptions = [current.a, ...shuffledWrongs]
        .sort(() => Math.random() - 0.5);
    
    // Seçenekleri oluştur
    allOptions.forEach((word, index) => {
        const optionDiv = document.createElement("button");
        optionDiv.className = "option";
        optionDiv.textContent = word;
        
        // Animasyon gecikmesi
        optionDiv.style.animationDelay = `${index * 0.1}s`;
        
        // Tıklama olayı
        optionDiv.onclick = () => checkAnswer(optionDiv, word);
        
        optionsEl.appendChild(optionDiv);
    });
}

function checkAnswer(optionDiv, selectedWord) {
    // Tüm seçenekleri devre dışı bırak
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    if (selectedWord === current.a) {
        // Doğru cevap
        optionDiv.classList.add("correct");
        messageEl.textContent = "✅ Doğru! +100 Puan";
        messageEl.className = "message correct";
        
        // Puan ekle
        score += 100;
        
        // Zaman bonusu (hızlı cevap için)
        const now = new Date();
        const timeDiff = Math.floor((now - startTime) / 1000);
        if (timeDiff < 10) {
            score += 50;
            messageEl.textContent = "⚡ Süper Hızlı! +150 Puan";
        }
        
        answeredQuestions++;
        
        // 1.2 saniye sonra yeni soru
        setTimeout(() => {
            if (remaining.length === 0) {
                showWinScreen();
            } else {
                loadQuestion();
                updateUI();
                
                // Seçenekleri tekrar aktif et
                allOptions.forEach(opt => {
                    opt.style.pointerEvents = 'auto';
                });
            }
        }, 1200);
    } else {
        // Yanlış cevap
        optionDiv.classList.add("wrong");
        messageEl.textContent = "❌ Yanlış! -1 Can";
        messageEl.className = "message wrong";
        
        // Doğru cevabı göster
        const correctOption = [...allOptions].find(opt => opt.textContent === current.a);
        if (correctOption) {
            correctOption.classList.add("correct");
        }
        
        lives--;
        wrongAnswersCount++;
        
        // Can kontrolü
        if (lives <= 0) {
            setTimeout(showLoseScreen, 1500);
        } else {
            // 1.5 saniye sonra yeni soru
            setTimeout(() => {
                if (remaining.length === 0) {
                    showWinScreen();
                } else {
                    loadQuestion();
                    updateUI();
                }
            }, 1500);
        }
    }
    
    updateUI();
}

function showWinScreen() {
    clearInterval(timerInterval);
    
    finalTimeEl.textContent = getTimeString();
    finalScoreEl.textContent = score;
    
    gameScreen.classList.add("hidden");
    winScreen.classList.remove("hidden");
}

function showLoseScreen() {
    clearInterval(timerInterval);
    
    loseTimeEl.textContent = getTimeString();
    loseScoreEl.textContent = score;
    wrongAnswersEl.textContent = wrongAnswersCount;
    
    gameScreen.classList.add("hidden");
    loseScreen.classList.remove("hidden");
}

function restartGame() {
    winScreen.classList.add("hidden");
    loseScreen.classList.add("hidden");
    startGame();
}

/* MENÜ FONKSİYONLARI */
function openSettings() { 
    closeModals(); 
    document.getElementById("settings").classList.remove("hidden"); 
}

function openHowTo() { 
    closeModals(); 
    document.getElementById("howto").classList.remove("hidden"); 
}

function closeModals() {
    document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
}

function goToMainMenu() { 
    location.reload(); 
}

function exitGame() { 
    if (confirm("Oyundan çıkmak istediğinize emin misiniz?")) {
        window.close();
    }
}

function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
    
    // Menüdeki koyu mod butonunu güncelle
    const darkModeBtn = document.querySelector('.dark-mode-toggle');
    if (darkModeBtn) {
        const icon = darkModeBtn.querySelector('i');
        const text = darkModeBtn.querySelector('span');
        
        if (theme === 'dark-theme') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Açık Mod';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Koyu Mod';
        }
    }
}

function toggleDarkMode() {
    const currentTheme = document.body.className;
    if (currentTheme === 'dark-theme') {
        // Varsayılan temaya dön
        setTheme('nature-theme');
    } else {
        // Koyu moda geç
        setTheme('dark-theme');
    }
}

// Sayfa yüklendiğinde tema yükle
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'nature-theme';
    setTheme(savedTheme);
    
    // Mobil optimizasyonu
    optimizeForMobile();
});

// Mobil optimizasyonu
function optimizeForMobile() {
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.style.padding = '25px 15px';
            option.style.minHeight = '80px';
            option.style.fontSize = '16px';
        });
        
        document.querySelectorAll('button').forEach(btn => {
            btn.style.fontSize = '16px';
            btn.style.minHeight = '50px';
        });
        
        document.querySelectorAll('.hud-item').forEach(item => {
            item.style.padding = '15px';
            item.style.fontSize = '16px';
            item.style.minHeight = '70px';
        });
    }
}

// Hata yakalama
window.addEventListener('error', (e) => {
    console.error('Hata oluştu:', e.error);
    messageEl.textContent = "Bir hata oluştu, lütfen sayfayı yenileyin.";
    messageEl.className = "message wrong";
});

// Ekran değişikliklerinde mobil optimizasyonu
window.addEventListener('resize', optimizeForMobile);
window.addEventListener('orientationchange', optimizeForMobile);
