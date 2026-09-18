const serverUrl = ""; 
let currentSetupMode = 'learn';
let currentUser = localStorage.getItem('pahamteks_user') || 'Tamu';
let authMode = 'login';
let globalLanguages = {}; 

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        switchPage(event.state.page, false); 
    } else {
        switchPage('home', false);
    }
});

function initAuthUI() {
    if (currentUser !== 'Tamu' && currentUser !== 'Guest') {
        document.getElementById('user-profile-badge').innerHTML = `👤 ${currentUser}`;
        document.getElementById('user-profile-container').style.display = "flex";
        document.getElementById('btn-signin').style.display = "none";
        document.getElementById('btn-signup').style.display = "none";
    } else {
        document.getElementById('user-profile-container').style.display = "none";
        document.getElementById('btn-signin').style.display = "block";
        document.getElementById('btn-signup').style.display = "block";
    }
}

function logoutUser() {
    currentUser = currentLang === 'id' ? 'Tamu' : 'Guest';
    localStorage.removeItem('pahamteks_user');
    localStorage.removeItem('pahamteks_logs'); 
    
    initAuthUI();
    updateTrackingUI();
    switchPage('home');
    
    alert(dict[currentLang].logout_msg || "Anda berhasil keluar. Data progres telah direset ke Mode Tamu.");
}

const dict = {
    id: {
        nav_home: "Beranda", nav_translator: "Penerjemah", nav_learn: "Bahasa Dunia", nav_coding: "Pemrograman", nav_dashboard: "Pelacakan", nav_dictionary: "Kamus",
        btn_login: "Masuk", btn_register: "Daftar", guest: "Tamu", btn_logout: "Keluar",
        auth_login_title: "Masuk", auth_reg_title: "Buat Akun Baru",
        auth_ph_fname: "Nama Depan", auth_ph_lname: "Nama Belakang", auth_ph_oname: "Nama Tambahan (Opsional)",
        auth_ph_email: "Alamat Email", auth_ph_pass: "Kata Sandi",
        auth_btn_login: "Masuk", auth_btn_reg: "Daftar Sekarang", auth_btn_guest: "Mode Tamu", auth_btn_verify: "Verifikasi & Buat Akun",
        auth_toggle_reg: "Belum punya akun? Daftar", auth_toggle_login: "Sudah punya akun? Sign In", btn_cancel: "Batal",
        auth_otp_msg: "Kode keamanan telah dikirim ke email Anda.<br><span style='color:#a0aab2; font-size:0.8rem;'>(Gunakan kode demo: 123456)</span>",
        logout_msg: "Anda berhasil keluar. Data progres telah direset ke Mode Tamu.",
        hero_title: "Eksplorasi Bahasa & Logika", hero_desc: "Pelajari bahasa asing dari seluruh dunia hingga logika bahasa pemrograman secara interaktif.",
        card_1_title: "Mulai<br>Translator", card_1_desc: "Akses fitur penerjemah bahasa alami berbasis AI yang mendukung huruf non-latin, idiom, dan slang.",
        card_2_title: "Mulai<br>Bahasa Asing", card_2_desc: "Uji dan tingkatkan kemampuan penguasaan bahasa dunia melalui latihan kuis cerdas.",
        card_3_title: "Mulai<br>Ngoding", card_3_desc: "Asah logika pemrograman dan algoritma Anda. Selesaikan studi kasus koding.",
        trans_ph_source: "Ketik teks yang ingin di terjemahkan...", trans_ph_target: "Terjemahan atau pelafalan...", trans_status: "Menghubungkan ke server AI...",
        setup_level: "Pilih Tingkat Penguasaan", opt_level_1: "Pemula (Dasar / Kosakata A1)", opt_level_2: "Menengah (Struktur Kalimat / B1-B2)", opt_level_3: "Mahir (Kompleks / C1-C2 / Slang)",
        setup_lang_title: "Pilih Bahasa Manusia", setup_lang_desc: "Pilih salah satu bahasa untuk difokuskan",
        cat_pop: "🌐 Populer (Indo & Inggris)", cat_nus: "🌐 Bahasa Nusantara (Lokal)", cat_mid: "🌐 Timur Tengah & Afrika", cat_asia: "🌐 Asia & Pasifik", cat_eur: "🌐 Benua Eropa",
        opt_lang_id_baku: "Indonesia (Baku)", opt_lang_id_gaul: "Indonesia (Gaul & Kiasan)", opt_lang_en_gram: "Inggris (Tata Bahasa)", opt_lang_en_slang: "Inggris (Gaul)",
        opt_lang_jv: "Jawa", opt_lang_su: "Sunda", opt_lang_mi: "Minang", opt_lang_ba: "Bali",
        opt_lang_ar: "Arab", opt_lang_quran: "Al-Qur'an", opt_lang_he: "Ibrani", opt_lang_tr: "Turki", opt_lang_fa: "Persia", opt_lang_sw: "Swahili",
        opt_lang_ja: "Jepang", opt_lang_ko: "Korea", opt_lang_zh: "Mandarin", opt_lang_hi: "Hindi", opt_lang_th: "Thai", opt_lang_vi: "Vietnam", opt_lang_tl: "Tagalog",
        opt_lang_es: "Spanyol", opt_lang_fr: "Prancis", opt_lang_de: "Jerman", opt_lang_ru: "Rusia", opt_lang_it: "Italia", opt_lang_nl: "Belanda", opt_lang_pt: "Portugis",
        btn_start_learn: "MULAI BELAJAR", btn_challenge: "PERMAINAN CEPAT", btn_print: "CETAK MODUL",
        setup_code_level: "Pilih Kompleksitas Algoritma ⚙", opt_code_1: "Pemula (Sintaks Dasar, Perulangan)", opt_code_2: "Menengah (Fungsi, OOP)", opt_code_3: "Mahir (Arsitektur Kompleks)",
        setup_code_title: "Pilih Bahasa Pemrograman", setup_code_desc: "Uji kemampuan logika koding Anda",
        cat_web: "🌐 Situs & Naskah", cat_sys: "🌐 Sistem & Perangkat Lunak", cat_mob: "🌐 Seluler, Data & Basis Data", cat_theory: "🌐 Teori & Algoritma Khusus",
        opt_code_html: "HTML & CSS", opt_code_js: "JavaScript / TypeScript", opt_code_py: "Python", opt_code_php: "PHP", opt_code_ruby: "Ruby",
        opt_code_ds: "Struktur Data (Array, Stack, Tree)", opt_code_crypto: "Kriptografi & Keamanan", opt_code_ml: "Machine Learning Dasar", opt_code_dp: "Design Patterns (OOP)",
        btn_start_code: "MULAI LATIHAN",
        quiz_header: "Latihan Berlangsung", challenge_header: "Permainan Cepat (Timer)", timer_label: "Sisa Waktu Ujian:",
        result_title: "Sesi Selesai!", result_breakdown: "Rincian Pengerjaan", btn_retry: "Kembali ke Menu (Cek Tracking)",
        dash_title: "Log & Pelacakan Belajar", dash_subtitle: "Pantau rekam jejak progres pembelajaran Anda secara visual.",
        stat_sessions: "Total Sesi Latihan", stat_avg: "Rata-rata Skor", stat_challenge: "Permainan Cepat Selesai",
        dash_history: "Riwayat Sesi Terakhir:", dash_empty: "Belum ada riwayat aktivitas tercatat.",
        dash_capability: "Analisis Kemampuan:",
        dict_page_title: "Pusat Kamus & Istilah", dict_page_desc: "Cari arti kata, slang, idiom, atau sintaks pemrograman di sini.",
        dict_title: "Kamus Pintar AI", dict_ph: "Ketik kata/sintaks...", dict_btn: "CARI ARTI", dict_btn_rand: "ACAK", dict_btn_rand_short: "Acak", dict_btn_float: "Kamus Pintar AI",
        dict_word_list: "Daftar Kosakata:",
        btn_ans_check: "Kunci Jawaban", btn_ans_next: "Lanjut Soal Berikutnya ➔", btn_ans_select: "Pilih Jawaban",
        opt_auto_detect: "Mendeteksi...",
        lang_en: "Inggris (English)", lang_id: "Indonesia", lang_ar: "Arab", lang_ja: "Jepang", lang_de: "Jerman",
        lang_ko: "Korea", lang_zh: "Mandarin", lang_fr: "Prancis", lang_es: "Spanyol",
        pred_excellent: "Sangat Baik", pred_good: "Baik", pred_fair: "Cukup Baik", pred_poor: "Kurang Baik"
    },
    en: {
        nav_home: "Home", nav_translator: "Translator", nav_learn: "Languages", nav_coding: "Programming", nav_dashboard: "Tracking", nav_dictionary: "Dictionary",
        btn_login: "Sign In", btn_register: "Sign Up", guest: "Guest", btn_logout: "Log Out",
        auth_login_title: "Sign In", auth_reg_title: "Create Account",
        auth_ph_fname: "First Name", auth_ph_lname: "Last Name", auth_ph_oname: "Additional Name (Optional)",
        auth_ph_email: "Email Address", auth_ph_pass: "Password",
        auth_btn_login: "Sign In", auth_btn_reg: "Sign Up Now", auth_btn_guest: "Guest Mode", auth_btn_verify: "Verify & Create Account",
        auth_toggle_reg: "No account? Sign up", auth_toggle_login: "Have an account? Sign In", btn_cancel: "Cancel",
        auth_otp_msg: "Security code sent to your email.<br><span style='color:#a0aab2; font-size:0.8rem;'>(Use demo code: 123456)</span>",
        logout_msg: "Successfully logged out. Progress data reset to Guest Mode.",
        hero_title: "Explore Language & Logic", hero_desc: "Learn foreign languages from around the world and programming logic interactively.",
        card_1_title: "Start<br>Translator", card_1_desc: "Access AI-based natural language translation supporting non-latin scripts, idioms, and slang.",
        card_2_title: "Start<br>Languages", card_2_desc: "Test and improve your world language mastery through smart quiz exercises.",
        card_3_title: "Start<br>Coding", card_3_desc: "Sharpen your programming logic and algorithms. Solve coding case studies.",
        trans_ph_source: "Type text to translate...", trans_ph_target: "Translation or pronunciation...", trans_status: "Connecting to AI server...",
        setup_level: "Select Proficiency Level", opt_level_1: "Beginner (Basics / A1 Vocab)", opt_level_2: "Intermediate (Sentences / B1-B2)", opt_level_3: "Advanced (Complex / C1-C2 / Slang)",
        setup_lang_title: "Select Human Language", setup_lang_desc: "Choose a language to focus on",
        cat_pop: "🌐 Popular (Indo & English)", cat_nus: "🌐 Nusantara (Local Indonesian)", cat_mid: "🌐 Middle East & Africa", cat_asia: "🌐 Asia & Pacific", cat_eur: "🌐 Europe",
        opt_lang_id_baku: "Indonesian (Formal)", opt_lang_id_gaul: "Indonesian (Slang)", opt_lang_en_gram: "English (Grammar)", opt_lang_en_slang: "English (Slang)",
        opt_lang_jv: "Javanese", opt_lang_su: "Sundanese", opt_lang_mi: "Minangkabau", opt_lang_ba: "Balinese",
        opt_lang_ar: "Arabic", opt_lang_quran: "Quranic Arabic", opt_lang_he: "Hebrew", opt_lang_tr: "Turkish", opt_lang_fa: "Persia", opt_lang_sw: "Swahili",
        opt_lang_ja: "Japanese", opt_lang_ko: "Korean", opt_lang_zh: "Mandarin", opt_lang_hi: "Hindi", opt_lang_th: "Thai", opt_lang_vi: "Vietnamese", opt_lang_tl: "Tagalog",
        opt_lang_es: "Spanish", opt_lang_fr: "French", opt_lang_de: "German", opt_lang_ru: "Russian", opt_lang_it: "Italian", opt_lang_nl: "Dutch", opt_lang_pt: "Portuguese",
        btn_start_learn: "START LEARNING", btn_challenge: "QUICK PLAY", btn_print: "PRINT MODULE",
        setup_code_level: "Select Algorithm Complexity ⚙", opt_code_1: "Beginner (Basic Syntax, Looping)", opt_code_2: "Intermediate (Functions, OOP)", opt_code_3: "Advanced (Complex Architecture)",
        setup_code_title: "Select Programming Language", setup_code_desc: "Test your coding logic skills",
        cat_web: "🌐 Web & Scripting", cat_sys: "🌐 System & Software", cat_mob: "🌐 Mobile, Data & Database", cat_theory: "🌐 Theory & Algorithms",
        opt_code_html: "HTML & CSS", opt_code_js: "JavaScript / TypeScript", opt_code_py: "Python", opt_code_php: "PHP", opt_code_ruby: "Ruby",
        opt_code_ds: "Data Structures (Array, Stack, Tree)", opt_code_crypto: "Cryptography & Security", opt_code_ml: "Basic Machine Learning", opt_code_dp: "Design Patterns (OOP)",
        btn_start_code: "START PRACTICE",
        quiz_header: "Practice in Progress", challenge_header: "Quick Play (Timer)", timer_label: "Time Left:",
        result_title: "Session Complete!", result_breakdown: "Performance Breakdown", btn_retry: "Back to Menu (Check Tracking)",
        dash_title: "Learning Log & Tracking", dash_subtitle: "Monitor your learning progress visually.",
        stat_sessions: "Total Sessions", stat_avg: "Average Score", stat_challenge: "Quick Plays Completed",
        dash_history: "Recent History:", dash_empty: "No activity history recorded yet.",
        dash_capability: "Capability Analysis:",
        dict_page_title: "Dictionary & Terminology Center", dict_page_desc: "Search for word meanings, slang, idioms, or programming syntax here.",
        dict_title: "Smart AI Dictionary", dict_ph: "Type word/term/syntax...", dict_btn: "SEARCH", dict_btn_rand: "RANDOM", dict_btn_rand_short: "Rand", dict_btn_float: "Smart AI Dictionary",
        dict_word_list: "Vocabulary List:",
        btn_ans_check: "Submit Answer", btn_ans_next: "Next Question ➔", btn_ans_select: "Select Answer",
        opt_auto_detect: "Auto Detect",
        lang_en: "English", lang_id: "Indonesian", lang_ar: "Arabic", lang_ja: "Japanese", lang_de: "German",
        lang_ko: "Korean", lang_zh: "Mandarin", lang_fr: "French", lang_es: "Spanish",
        pred_excellent: "Excellent", pred_good: "Good", pred_fair: "Fair", pred_poor: "Poor"
    }
};

let currentLang = 'id';

function renderLanguageDropdowns() {
    const s = document.getElementById("source-lang");
    const t = document.getElementById("target-lang");
    
    let currentS = s.value;
    let currentT = t.value;

    s.innerHTML = ""; 
    t.innerHTML = "";
    
    s.add(new Option(dict[currentLang].opt_auto_detect, "auto"));

    let hasIntlAPI = false;
    let langNames;
    try {
        langNames = new Intl.DisplayNames([currentLang === 'id' ? 'id-ID' : 'en-US'], { type: 'language' });
        hasIntlAPI = true;
    } catch (e) {
        hasIntlAPI = false;
    }

    const sortedLanguages = Object.entries(globalLanguages).sort((a, b) => a[0].localeCompare(b[0]));

    for (const [englishName, code] of sortedLanguages) {
        let displayName = englishName;
        if (currentLang === 'en') {
            if (hasIntlAPI) {
                try {
                    let localName = langNames.of(code);
                    if (localName) displayName = localName.charAt(0).toUpperCase() + localName.slice(1);
                } catch (e) {
                    displayName = englishName.charAt(0).toUpperCase() + englishName.slice(1);
                }
            } else {
                displayName = englishName.charAt(0).toUpperCase() + englishName.slice(1);
            }
        } else {
            if (hasIntlAPI) {
                try {
                    let localName = langNames.of(code);
                    if (localName) displayName = localName.charAt(0).toUpperCase() + localName.slice(1);
                } catch (e) {
                    displayName = englishName.charAt(0).toUpperCase() + englishName.slice(1);
                }
            } else {
                displayName = englishName.charAt(0).toUpperCase() + englishName.slice(1);
            }
        }
        
        s.add(new Option(displayName, code));
        t.add(new Option(displayName, code));
    }

    if (currentS && currentS !== "") s.value = currentS; else s.value = "auto";
    if (currentT && currentT !== "") t.value = currentT; else t.value = "en";
}

function updateKamusDropdownText() {
    document.querySelectorAll('.opt-en').forEach(el => el.innerText = dict[currentLang].lang_en);
    document.querySelectorAll('.opt-id').forEach(el => el.innerText = dict[currentLang].lang_id);
    document.querySelectorAll('.opt-ar').forEach(el => el.innerText = dict[currentLang].lang_ar);
    document.querySelectorAll('.opt-ja').forEach(el => el.innerText = dict[currentLang].lang_ja);
    document.querySelectorAll('.opt-de').forEach(el => el.innerText = dict[currentLang].lang_de);
    document.querySelectorAll('.opt-ko').forEach(el => el.innerText = dict[currentLang].lang_ko);
    document.querySelectorAll('.opt-zh').forEach(el => el.innerText = dict[currentLang].lang_zh);
    document.querySelectorAll('.opt-fr').forEach(el => el.innerText = dict[currentLang].lang_fr);
    document.querySelectorAll('.opt-es').forEach(el => el.innerText = dict[currentLang].lang_es);
}

function toggleLang() {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    document.getElementById('btn-lang-toggle').innerText = currentLang === 'id' ? '🌐 ID' : '🌐 EN';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(dict[currentLang][key]) el.innerHTML = dict[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if(dict[currentLang][key]) el.placeholder = dict[currentLang][key];
    });
    
    const btnCheck = document.getElementById("btn-check");
    if(btnCheck.innerText.includes("➔")) btnCheck.innerText = dict[currentLang].btn_ans_next;
    else if(btnCheck.disabled) btnCheck.innerText = dict[currentLang].btn_ans_select;
    else btnCheck.innerText = dict[currentLang].btn_ans_check;
    
    updateTrackingUI(); 
    updateKamusDropdownText();
    updateKamusList();
    
    if (Object.keys(globalLanguages).length > 0) {
        renderLanguageDropdowns();
    }
}

let trackingChart;

function renderCharts(logs) {
    let chartLogs = logs.slice(0, 10).reverse();
    let labels = chartLogs.map((l, i) => `Sesi ${i+1}`);
    let dataScores = chartLogs.map(l => l.score);

    const config = {
        type: 'line', data: { labels: labels, datasets: [{
            label: currentLang === 'id' ? 'Skor Ujian' : 'Quiz Score', data: dataScores,
            borderColor: '#b4f27e', backgroundColor: 'rgba(180, 242, 126, 0.2)', borderWidth: 2, fill: true, tension: 0.3, pointRadius: 4, pointHoverRadius: 6
        }]},
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#a0aab2' }, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { ticks: { color: '#a0aab2' }, grid: { color: 'rgba(255,255,255,0.1)' } } },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    };

    if(trackingChart) trackingChart.destroy();
    let ctxTrack = document.getElementById('chart-tracking');
    if(ctxTrack) trackingChart = new Chart(ctxTrack, config);
}

function updateTrackingUI() {
    let logs = JSON.parse(localStorage.getItem('pahamteks_logs') || '[]');
    let validLogs = logs.filter(l => l.category !== "Sistem" && l.activity !== "Sign In");
    
    let totalSessions = validLogs.length;
    let totalScoreSum = validLogs.reduce((acc, curr) => acc + curr.score, 0);
    let avgScore = totalSessions > 0 ? Math.round(totalScoreSum / totalSessions) : 0;
    let challengeCount = validLogs.filter(l => l.activity.includes('Cepat') || l.activity.includes('Quick')).length;

    document.querySelectorAll('.stat-total-sessions').forEach(el => el.innerText = totalSessions);
    document.querySelectorAll('.stat-avg-score').forEach(el => el.innerText = avgScore);
    document.querySelectorAll('.stat-challenges').forEach(el => el.innerText = challengeCount);

    let logHTML = "";
    let categoryStats = {};

    if (totalSessions === 0) {
        logHTML = `<i style="color:var(--text-muted);">${dict[currentLang].dash_empty}</i>`;
    } else {
        logHTML = validLogs.map(l => `
            <div style="background:rgba(0,0,0,0.4); padding:10px 14px; border-radius:10px; border-left:4px solid var(--btn-green); display:flex; justify-content:space-between; align-items:center;">
                <div><div style="font-weight:bold; font-size:0.95rem;">${l.activity} <span style="color:var(--btn-cyan);font-size:0.8rem;">(${l.category || "General"})</span></div><div style="font-size:0.8rem; color:var(--text-muted);">${l.time}</div></div>
                <div style="font-weight:900; color:var(--btn-green); font-size:1.1rem;">Skor: ${l.score}</div>
            </div>
        `).join('');

        validLogs.forEach(l => {
            let catClean = l.category;
            
            if(currentLang === 'en') {
                if(catClean.includes("Populer : Indonesia (Baku)")) catClean = "Popular : Indonesian (Formal)";
                if(catClean.includes("Populer : Indonesia (Gaul & Kiasan)")) catClean = "Popular : Indonesian (Slang)";
                if(catClean.includes("Populer : Inggris (Grammar)")) catClean = "Popular : English (Grammar)";
                if(catClean.includes("Populer : Inggris (Idiom & Slang)")) catClean = "Popular : English (Idioms)";
                
                if(catClean.includes("Asia & Pasifik : Jepang")) catClean = "Asia & Pacific : Japanese";
                if(catClean.includes("Asia & Pasifik : Korea")) catClean = "Asia & Pacific : Korean";
                if(catClean.includes("Asia & Pasifik : Mandarin")) catClean = "Asia & Pacific : Mandarin";
                
                if(catClean.includes("Benua Eropa : Spanyol")) catClean = "Europe : Spanish";
                if(catClean.includes("Benua Eropa : Prancis")) catClean = "Europe : French";
                if(catClean.includes("Benua Eropa : Jerman")) catClean = "Europe : German";
                
                if(catClean.includes("Web & Scripting : JavaScript / TypeScript")) catClean = "Web & Scripting : JS/TS";
                if(catClean.includes("Web & Scripting : Python")) catClean = "Web & Scripting : Python";
                if(catClean.includes("Sistem & Software : C++")) catClean = "System & Software : C++";
                if(catClean.includes("Teori & Algoritma Khusus : Struktur Data")) catClean = "Theory : Data Structures";
            }
            
            if(!categoryStats[catClean]) categoryStats[catClean] = { total: 0, count: 0 };
            categoryStats[catClean].total += l.score;
            categoryStats[catClean].count += 1;
        });
    }
    
    let elemListTrack = document.getElementById('log-list-tracking');
    if(elemListTrack) elemListTrack.innerHTML = logHTML;

    let capabilityHTML = "";
    for(let cat in categoryStats) {
        let avg = Math.round(categoryStats[cat].total / categoryStats[cat].count);
        let predikat = ""; let color = "";
        if(avg >= 90) { predikat = dict[currentLang].pred_excellent; color = "var(--btn-green)"; }
        else if(avg >= 70) { predikat = dict[currentLang].pred_good; color = "var(--btn-cyan)"; }
        else if(avg >= 40) { predikat = dict[currentLang].pred_fair; color = "var(--warning-orange)"; }
        else { predikat = dict[currentLang].pred_poor; color = "var(--wrong)"; }
        
        let formattedCat = cat;
        if(cat.includes(" : ")) {
            let parts = cat.split(" : ");
            formattedCat = `<span style="opacity:0.7;">${parts[0].toLowerCase()} :</span> ${parts[1].toLowerCase()}`;
        }
        
        capabilityHTML += `
        <div style="background:rgba(255,255,255,0.05); padding:12px 15px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; text-transform:capitalize;"><span style="color:${color}; margin-right:8px;">🟢</span> ${formattedCat}</div>
            <div style="font-weight:900; color:${color};">> ${predikat}</div>
        </div>`;
    }
    if(!capabilityHTML) capabilityHTML = `<i style="color:var(--text-muted);">${dict[currentLang].dash_empty}</i>`;
    
    let elemCapTrack = document.getElementById('capability-list-tracking');
    if(elemCapTrack) elemCapTrack.innerHTML = capabilityHTML;

    renderCharts(validLogs);
}

function logUserActivity(activityName, scoreVal, categoryVal) {
    let logs = JSON.parse(localStorage.getItem('pahamteks_logs') || '[]');
    let newLog = {
        user: currentUser, activity: activityName, score: scoreVal, category: categoryVal || "General",
        time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };
    logs.unshift(newLog);
    localStorage.setItem('pahamteks_logs', JSON.stringify(logs));
    updateTrackingUI();

    fetch(`${serverUrl}/api/user_log`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newLog)
    }).catch(err => {});
}

window.onload = function() {
    if (!sessionStorage.getItem('pahamteks_active_session')) {
        sessionStorage.setItem('pahamteks_active_session', 'true');
        if (currentUser === 'Tamu' || currentUser === 'Guest') {
            localStorage.removeItem('pahamteks_logs');
        }
    }

    initAuthUI();
    updateTrackingUI();
    updateKamusList();

    let initialPage = 'home';
    if(window.location.hash) {
        let hashPage = window.location.hash.substring(1);
        if(document.getElementById('page-' + hashPage)) {
            initialPage = hashPage;
        }
    }
    history.replaceState({ page: initialPage }, '', '#' + initialPage);
    switchPage(initialPage, false);
};

function speakText(text, langCode = 'id-ID') {
    if (!('speechSynthesis' in window)) return;
    if (!text) return;
    let filteredText = text.replace(/_{3,}/g, langCode.startsWith('en') ? " blank " : " titik-titik "); 
    filteredText = filteredText.replace(/\*/g, ''); 
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(filteredText);
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
}

function switchPage(pageName, pushHistory = true) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    stopTimer();
    
    if(pageName === 'coding') {
        document.body.style.background = "var(--bg-blue)";
        currentSetupMode = 'coding';
    } else {
        document.body.style.background = "var(--bg-green)";
        if(pageName === 'learn') currentSetupMode = 'learn';
    }

    document.getElementById('page-' + pageName).classList.add('active-page');
    if(document.getElementById('nav-' + pageName)) document.getElementById('nav-' + pageName).classList.add('active');
    
    document.getElementById('quiz-playing-area').style.display = 'flex';
    document.getElementById('quiz-result-area').style.display = 'none';
    
    document.querySelector('.floating-kamus-btn').style.display = 'flex';
    
    if(pageName === 'tracking') updateTrackingUI(); 
    window.scrollTo(0,0);

    if (pushHistory) {
        history.pushState({ page: pageName }, '', '#' + pageName);
    }
}

function scrollToTracking() { switchPage('tracking'); }

function toggleMenu(menuId, arrowId) {
    const submenu = document.getElementById(menuId), arrow = document.getElementById(arrowId);
    if (submenu.style.display === "flex") { submenu.style.display = "none"; arrow.innerText = "▼"; } 
    else { submenu.style.display = "flex"; arrow.innerText = "▲"; }
}

function openAuthModal(mode) { 
    document.getElementById('auth-modal').style.display = 'flex'; 
    authMode = mode; 
    updateAuthUI();
    document.getElementById('otp-section').style.display = 'none';
    document.getElementById('auth-footer-options').style.display = 'block';
    document.getElementById('btn-auth-submit').style.display = 'block';
}
function closeAuthModal() { document.getElementById('auth-modal').style.display = 'none'; }

function toggleAuthMode() { 
    authMode = (authMode === 'login') ? 'register' : 'login'; 
    updateAuthUI(); 
}

function updateAuthUI() {
    document.getElementById('auth-title').innerText = authMode === 'login' ? dict[currentLang].auth_login_title : dict[currentLang].auth_reg_title;
    document.getElementById('auth-name-fields').style.display = authMode === 'login' ? "none" : "block";
    document.getElementById('btn-auth-submit').innerText = authMode === 'login' ? dict[currentLang].auth_btn_login : dict[currentLang].auth_btn_reg;
    document.getElementById('auth-toggle-text').innerText = authMode === 'login' ? dict[currentLang].auth_toggle_reg : dict[currentLang].auth_toggle_login;
    document.getElementById('social-logins').style.display = authMode === 'login' ? "none" : "block";
}

function togglePasswordVisibility() {
    const passInput = document.getElementById('auth-password');
    if (passInput.type === "password") { passInput.type = "text"; } 
    else { passInput.type = "password"; }
}

function processAuth() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-password').value;
    
    if (authMode === 'login') {
        if(!email || !pass) return alert(currentLang === 'id' ? "Isi email & password!" : "Fill email & password!");
        fetch(`${serverUrl}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({email, password: pass}) })
        .then(res => res.json()).then(data => {
            if(data.error) alert("❌ " + data.error);
            else { alert("✅ " + data.message); activateUser(data.name); }
        }).catch(err => alert("Gagal koneksi server."));
    } else {
        const fname = document.getElementById('auth-fname').value;
        const lname = document.getElementById('auth-lname').value;
        if(!email || !pass || !fname || !lname) return alert(currentLang === 'id' ? "Nama Depan, Belakang, Email & Password wajib diisi!" : "First/Last Name, Email & Password required!");
        
        fetch(`${serverUrl}/api/send_otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({email}) })
        .then(res => res.json()).then(data => {
            if(data.error) return alert("❌ " + data.error);
            document.getElementById('btn-auth-submit').style.display = 'none';
            document.getElementById('auth-footer-options').style.display = 'none';
            document.getElementById('otp-section').style.display = 'block';
        }).catch(err => alert("Gagal koneksi server."));
    }
}

function verifyOTPAndRegister() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const fname = document.getElementById('auth-fname').value;
    const lname = document.getElementById('auth-lname').value;
    const oname = document.getElementById('auth-oname').value;
    const otp = document.getElementById('auth-otp').value;

    if(!otp) return alert("Masukkan kode OTP!");

    fetch(`${serverUrl}/api/register`, { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({email, password, fname, lname, oname, otp}) 
    })
    .then(res => res.json()).then(data => {
        if(data.error) alert("❌ " + data.error);
        else { alert("✅ " + data.message); activateUser(data.name); }
    }).catch(err => alert("Gagal koneksi server."));
}

function mockSocialLogin(provider) {
    alert(currentLang === 'id' ? `Memproses verifikasi aman via ${provider}... (Fitur Mock)` : `Processing secure verification via ${provider}... (Mock Feature)`);
}

function continueAsGuest() { 
    closeAuthModal(); 
}

function activateUser(userName) {
    currentUser = userName; 
    localStorage.setItem('pahamteks_user', userName); 
    closeAuthModal();
    initAuthUI();
}

let timeout = null;

function loadLanguages() {
    fetch(`${serverUrl}/api/languages`).then(res => res.json()).then(data => {
        globalLanguages = data;
        renderLanguageDropdowns();
    }).catch(e => {});
}
loadLanguages();

function triggerTranslate() {
    const text = document.getElementById("source-text").value.trim();
    if(!text) return;
    document.getElementById("status").innerText = currentLang === 'id' ? "Memproses AI..." : "Processing AI...";
    fetch(`${serverUrl}/api/translate`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({text: text, source: document.getElementById("source-lang").value, target: document.getElementById("target-lang").value}) })
    .then(res => res.json()).then(data => { document.getElementById("target-text").value = data.translated_text; document.getElementById("status").innerText = currentLang === 'id' ? "Selesai!" : "Done!"; })
    .catch(e => document.getElementById("status").innerText = "Error AI.");
}
document.getElementById("source-text").addEventListener("keyup", () => { clearTimeout(timeout); timeout = setTimeout(triggerTranslate, 800); });
function swapLangs() {
    const s = document.getElementById("source-lang"), t = document.getElementById("target-lang"), sT = document.getElementById("source-text"), tT = document.getElementById("target-text");
    let tempL = s.value === "auto" ? "id" : s.value; s.value = t.value; t.value = tempL;
    sT.value = tT.value; tT.value = ""; triggerTranslate();
}

const dictDatabase = {
    "Bahasa Arab": ["Alhamdulillah", "Bismillah", "Inshallah", "Maktub (مكتوب)", "Mashallah", "Sabr (صبر)", "Shukran", "Tawakkul (توكل)"],
    "Bahasa Indonesia": ["Buah bibir (Kiasan)", "Gawai", "Mangkrak", "Mangkus", "Nirwana", "Pancaroba", "Sangkil", "Semenjana", "Suryakanta", "Swakarya"],
    "Bahasa Inggris": ["Bamboozle", "Break a leg (Idiom)", "Ephemeral", "Gobbledygook", "Lollygag", "Mellifluous", "Petrichor", "Rizz (Slang)", "Serendipity", "Ubiquitous"],
    "Bahasa Jepang": ["Arigatou", "Baka", "Ikigai", "Kawaii", "Kintsugi", "Komorebi (木漏れ日)", "Otsukaresama", "Tsundoku (積ん読)", "Wabi-sabi", "Yabai"],
    "Bahasa Jerman": ["Doppelgänger", "Fernweh", "Kummerspeck", "Schadenfreude", "Wanderlust"],
    "Bahasa Korea": ["Aegyo (애교)", "Chaebol (재벌)", "Daebak (대박)", "Hallyu (한류)", "Nunchi (눈치)"],
    "Bahasa Mandarin": ["Guanxi (关系)", "Jiayou (加油)", "Lieping (躺平)", "Mianzi (面子)", "Yuanfen (缘分)"],
    "Bahasa Prancis": ["C'est la vie", "Déjà vu", "Faux pas", "Rendezvous", "Vis-à-vis"],
    "Bahasa Spanyol": ["Desvelado", "Estrenar", "Madrugar", "Sobremesa", "Tocayo"],
    "Database SQL": ["ACID Properties", "Foreign Key", "GROUP BY", "INDEX", "JOIN", "Normalization", "Primary Key", "SELECT", "Stored Procedure", "Trigger"],
    "Pemrograman C++": ["Class", "Destructor", "Inheritance", "Memory Leak", "Overloading", "Pointer", "Polymorphism", "STL", "Template", "Virtual Function"],
    "Pemrograman Java": ["Abstract Class", "Encapsulation", "Garbage Collection", "Interface", "JVM", "Multithreading", "Object", "Package", "Static Method"],
    "Pemrograman JavaScript": ["Arrow Function", "Async/Await", "Callback", "Closure", "DOM Manipulation", "Event Loop", "Hoisting", "JSON", "Map & Filter", "Promise"],
    "Pemrograman PHP": ["Composer", "Cookies", "PDO", "Session", "Superglobals", "Traits"],
    "Pemrograman Python": ["Decorator", "Dictionary", "Dunder Method", "GIL", "Lambda Function", "List Comprehension", "NumPy", "Pandas", "Pip", "Tuple"]
};

function toggleFloatKamus() { document.getElementById("float-kamus-modal").style.display = document.getElementById("float-kamus-modal").style.display === "flex" ? "none" : "flex"; }
function handleKamusEnter(e) { if(e.key === "Enter") searchKamus('float'); }

function randomKamus(mode = 'float') {
    const isMain = mode === 'main';
    const catSelect = document.getElementById(isMain ? "main-dict-category" : "float-dict-category").value;
    const inputField = document.getElementById(isMain ? "main-kamus-input" : "float-kamus-input");
    
    let words = dictDatabase[catSelect];
    if(!words) words = dictDatabase["Bahasa Inggris"];
    
    const randWord = words[Math.floor(Math.random() * words.length)];
    inputField.value = randWord;
    searchKamus(mode);
}

function searchKamus(mode = 'float') {
    const isMain = mode === 'main';
    const input = document.getElementById(isMain ? "main-kamus-input" : "float-kamus-input").value.trim();
    const catSelect = document.getElementById(isMain ? "main-dict-category" : "float-dict-category").value;
    const resultBox = document.getElementById(isMain ? "main-kamus-result" : "float-kamus-result");
    const resultContent = document.getElementById(isMain ? "main-kamus-content" : "float-kamus-result"); 
    const btnSpeak = document.getElementById(isMain ? "btn-speak-main-kamus" : "btn-speak-float-kamus");
    
    if(!input) return;
    resultBox.style.display = "block"; btnSpeak.style.display = "none";
    
    let searchingText = `<i>⏳ ${currentLang === 'id' ? 'Mencari...' : 'Searching...'}</i>`;
    if (isMain) resultContent.innerHTML = searchingText;
    else resultBox.innerHTML = searchingText;
    
    let queryContext = `${input} (Konteks: ${catSelect})`;
    
    fetch(`${serverUrl}/api/dictionary`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keyword: queryContext }) })
    .then(res => res.json()).then(data => {
        if (isMain) resultContent.innerHTML = data.result.replace(/\n/g, '<br>');
        else resultBox.innerHTML = data.result.replace(/\n/g, '<br>');
        btnSpeak.style.display = "flex";
    }).catch(err => { 
        let errorText = `❌ ${currentLang === 'id' ? 'Gagal memuat. Server sibuk.' : 'Failed to fetch. Server busy.'}`;
        if (isMain) resultContent.innerHTML = errorText; 
        else resultBox.innerHTML = errorText;
    });
}

function searchMainKamus() { searchKamus('main'); }

function updateKamusList() {
    const catSelect = document.getElementById("main-dict-category").value;
    const listContainer = document.getElementById("main-dict-list");
    let words = dictDatabase[catSelect] || [];
    
    words.sort((a, b) => a.localeCompare(b));
    
    listContainer.innerHTML = "";
    words.forEach(word => {
        let div = document.createElement("div");
        div.className = "dict-list-item";
        div.innerText = word;
        div.onclick = function() {
            document.getElementById(catSelect === document.getElementById("main-dict-category").value ? "main-kamus-input" : "float-kamus-input").value = word;
            searchMainKamus();
        };
        listContainer.appendChild(div);
    });
}

let activeQuizPool = [], currentQuizIndex = 0, isChecking = true, selectedAnswer = null;
let correctAnswersCount = 0, userAnswersLog = [], isChallengeMode = false, timerInterval = null, timeLeft = 25;
let currentQuizCategory = "";

function printModule(type) {
    alert(currentLang === 'id' ? "Modul akan otomatis dicetak menggunakan UI browser." : "Module will be printed automatically.");
}

function startQuizSession(type, isChallenge = false) {
    currentSetupMode = type; isChallengeMode = isChallenge;
    let radioName = type === 'coding' ? 'code-category' : 'lang-category';
    let levelId = type === 'coding' ? 'code-level' : 'lang-level';
    
    const selectedRadio = document.querySelector(`input[name="${radioName}"]:checked`);
    if (!selectedRadio) return alert(currentLang === 'id' ? "Pilih materi terlebih dahulu!" : "Select topic first!");
    currentQuizCategory = selectedRadio.value;
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    document.getElementById('page-quiz-active').classList.add('active-page');
    document.getElementById('quiz-playing-area').style.display = 'flex';
    document.getElementById('quiz-result-area').style.display = 'none';
    window.scrollTo(0,0);
    
    document.getElementById("quiz-mode-title").innerText = isChallenge ? dict[currentLang].challenge_header : dict[currentLang].quiz_header;
    document.getElementById("timer-box").style.display = isChallenge ? "block" : "none";
    document.getElementById("quiz-question").innerText = currentLang === 'id' ? "Menyiapkan materi dari server AI..." : "Preparing AI materials...";
    document.getElementById("mc-options").innerHTML = ""; document.getElementById("btn-check").style.display = "none";
    
    if (isChallenge) {
        document.querySelector('.floating-kamus-btn').style.display = 'none';
        document.getElementById('float-kamus-modal').style.display = 'none';
    } else {
        document.querySelector('.floating-kamus-btn').style.display = 'flex';
    }
    
    let endpoint = isChallenge ? '/api/generate_challenge' : '/api/generate_quiz';
    let payload = isChallenge ? { category: currentQuizCategory } : { categories: [currentQuizCategory], level: document.getElementById(levelId).value };

    fetch(`${serverUrl}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) 
    }).then(res => res.json()).then(data => {
        if(data.error) throw new Error();
        activeQuizPool = data; currentQuizIndex = 0; correctAnswersCount = 0; userAnswersLog = [];
        document.getElementById("btn-check").style.display = "block";
        loadQuiz();
    }).catch(err => { document.getElementById("quiz-question").innerText = "Server sibuk. Silakan coba lagi."; });
}

function startChallenge(type) { startQuizSession(type, true); }

function loadQuiz() {
    stopTimer();
    isChecking = true; selectedAnswer = null;
    const currentData = activeQuizPool[currentQuizIndex];
    
    document.getElementById("quiz-instruction").innerText = `${currentLang === 'id' ? 'Soal' : 'Question'} ${currentQuizIndex + 1} / ${activeQuizPool.length}`;
    document.getElementById("quiz-question").innerText = currentData.question;
    
    const btnCheck = document.getElementById("btn-check");
    btnCheck.innerText = dict[currentLang].btn_ans_select; 
    btnCheck.className = "btn-huge btn-grey"; btnCheck.disabled = true; 
    
    const optionsContainer = document.getElementById("mc-options"); optionsContainer.innerHTML = ""; 
    const shuffledOptions = currentData.options.sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "mc-btn"; btn.innerText = opt;
        btn.onclick = () => {
            if(!isChecking) return;
            document.querySelectorAll('.mc-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected'); selectedAnswer = opt;
            btnCheck.disabled = false;
            btnCheck.innerText = dict[currentLang].btn_ans_check;
            btnCheck.className = currentSetupMode === 'coding' ? "btn-huge btn-cyan" : "btn-huge btn-green";
        };
        optionsContainer.appendChild(btn);
    });

    if (isChallengeMode) { timeLeft = 25; startTimer(); }
}

function startTimer() {
    const timerCount = document.getElementById('timer-countdown');
    const timerBar = document.getElementById('timer-bar');
    timerBar.style.width = '100%';
    
    timerInterval = setInterval(() => {
        timeLeft--; timerCount.innerText = timeLeft + 's';
        timerBar.style.width = ((timeLeft / 25) * 100) + '%';
        
        if (timeLeft <= 0) { stopTimer(); handleTimeOut(); }
    }, 1000);
}
function stopTimer() { if (timerInterval) clearInterval(timerInterval); }

function handleTimeOut() {
    isChecking = false;
    const correctAnswer = activeQuizPool[currentQuizIndex].answer;
    userAnswersLog.push({ question: activeQuizPool[currentQuizIndex].question, selected: "(Waktu Habis)", correct: correctAnswer });
    
    document.querySelectorAll('.mc-btn').forEach(btn => { 
        btn.disabled = true; 
        if (btn.innerText === correctAnswer) btn.classList.add('correct'); 
    });
    
    const btnCheck = document.getElementById("btn-check");
    btnCheck.disabled = false;
    btnCheck.innerText = currentLang === 'id' ? "Waktu Habis! Lanjut ➔" : "Time's up! Next ➔";
    btnCheck.className = "btn-huge btn-orange";
}

function processQuiz() {
    stopTimer();
    const btnCheck = document.getElementById("btn-check");
    if (!isChecking) { 
        currentQuizIndex++;
        if (currentQuizIndex >= activeQuizPool.length) return showQuizResult();
        loadQuiz(); return; 
    }

    isChecking = false;
    const correctAnswer = activeQuizPool[currentQuizIndex].answer;
    if (selectedAnswer === correctAnswer) correctAnswersCount++;
    userAnswersLog.push({ question: activeQuizPool[currentQuizIndex].question, selected: selectedAnswer, correct: correctAnswer });

    document.querySelectorAll('.mc-btn').forEach(btn => { 
        btn.disabled = true; 
        if (btn.innerText === correctAnswer) btn.classList.add('correct'); 
        else if (btn.innerText === selectedAnswer) btn.classList.add('wrong');
    });
    btnCheck.innerText = dict[currentLang].btn_ans_next;
}

function showQuizResult() {
    stopTimer();
    document.getElementById('quiz-playing-area').style.display = 'none';
    document.getElementById('quiz-result-area').style.display = 'flex';
    
    document.querySelector('.floating-kamus-btn').style.display = 'flex';
    
    let score = Math.round((correctAnswersCount / activeQuizPool.length) * 100);
    let circle = document.getElementById('final-score-circle');
    circle.innerText = score;
    circle.style.borderColor = score >= 70 ? "var(--btn-green)" : (score >= 40 ? "var(--btn-cyan)" : "var(--wrong)");
    circle.style.color = circle.style.borderColor;
    
    let modeName = isChallengeMode ? (currentLang === 'id' ? "Permainan Cepat" : "Quick Play") : (currentLang === 'id' ? "Latihan Kuis" : "Quiz Session");
    
    logUserActivity(modeName, score, currentQuizCategory);

    let breakdownHTML = "";
    userAnswersLog.forEach((ans, idx) => {
        let isCorrect = ans.selected === ans.correct;
        let color = isCorrect ? 'var(--btn-green)' : 'var(--wrong)';
        breakdownHTML += `
            <div class="explanation-item" style="border-left: 5px solid ${color};">
                <div style="font-weight:bold; margin-bottom:5px;">${idx+1}. ${ans.question}</div>
                <div style="color:${color};">${currentLang === 'id' ? 'Jawaban Anda:' : 'Your Answer:'} ${ans.selected} ${isCorrect ? '✅' : '❌'}</div>
                ${!isCorrect ? `<div style="color:var(--btn-green);">${currentLang === 'id' ? 'Jawaban Benar:' : 'Correct Answer:'}${ans.correct}</div>` : ''}
            </div>
        `;
    });
    document.getElementById('result-breakdown').innerHTML = breakdownHTML;
}

// --- LOGIKA ANIMASI TEKS HELLO MELAYANG KE SEMUA ARAH ---
function initFloatingHellos() {
    const hellos = [
        "Halo", "Hello", "こんにちは", "안녕하세요", "Hola", 
        "Bonjour", "Hallo", "مرحبا", "你好", "Здравствуйте", 
        "नमस्ते", "Ciao", "Olá", "Sawaddee", "Xin chào"
    ];
    const container = document.createElement('div');
    container.className = 'hello-container';
    document.body.appendChild(container);

    const totalTexts = 25; 
    const floatingTexts = [];

    for(let i = 0; i < totalTexts; i++) {
        let el = document.createElement('div');
        el.className = 'hello-text';
        el.innerText = hellos[Math.floor(Math.random() * hellos.length)];

        let fontSize = Math.random() * 3 + 1.5; 
        el.style.fontSize = fontSize + 'rem';
        
        container.appendChild(el);
        
        let posX = Math.random() * window.innerWidth;
        let posY = Math.random() * window.innerHeight;
        
        let speedX = (Math.random() - 0.5) * (fontSize * 0.6); 
        let speedY = (Math.random() - 0.5) * (fontSize * 0.6);

        floatingTexts.push({ el, x: posX, y: posY, speedX, speedY });
    }

    function animateTexts() {
        floatingTexts.forEach(t => {
            t.x += t.speedX;
            t.y += t.speedY;

            if (t.x > window.innerWidth + 200) t.x = -200;
            else if (t.x < -200) t.x = window.innerWidth + 200;

            if (t.y > window.innerHeight + 100) t.y = -100;
            else if (t.y < -100) t.y = window.innerHeight + 100;

            t.el.style.transform = `translate(${t.x}px, ${t.y}px)`;
        });
        requestAnimationFrame(animateTexts);
    }
    
    animateTexts();
}
initFloatingHellos();