import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_DICTIONARY } from '../graphql/queries';

// Database profil perbandingan bahasa manusia
const HUMAN_LANG_DATA = {
  'Indonesia': {
    family: 'Austronesia (Melayik)',
    script: 'Alfabet Latin',
    syntax: 'SVO (Subjek - Verba - Objek), tanpa infleksi tenses rumit',
    strengths: 'Ejaan fonetis mudah dipelajari, tanpa konjugasi gender/waktu, kosakata pinjaman kaya',
    sample: '"Selamat pagi! Senang bertemu dengan Anda."',
    difficulty: 'Sangat Mudah (Level 1) bagi penutur Asia & Barat'
  },
  'Inggris': {
    family: 'Indo-Eropa (Jermanik Barat)',
    script: 'Alfabet Latin',
    syntax: 'SVO, memiliki 12-16 tenses waktu, irregular verbs',
    strengths: 'Bahasa pengantar global (lingua franca dunia), kepustakaan sains & teknologi terluas',
    sample: '"Good morning! It is a pleasure to meet you."',
    difficulty: 'Mudah ke Menengah (Level 2)'
  },
  'Jepang': {
    family: 'Japonik',
    script: 'Kanji, Hiragana, Katakana',
    syntax: 'SOV (Subjek - Objek - Verba), partikel penanda topik (wa, ga, o)',
    strengths: 'Tingkat kesopanan bernuansa tinggi (Keigo), fonetik konsisten, budaya anime/manga/inovasi',
    sample: '"おはようございます！お会いできて嬉しいです。 (Ohayou gozaimasu!)"',
    difficulty: 'Tinggi (Level 4-5) karena sistem 3 aksara & Kanji'
  },
  'Arab': {
    family: 'Afroasiatik (Semitik)',
    script: 'Huruf Hijaiyah (Kanan ke Kiri / RTL)',
    syntax: 'VSO / SVO, sistem akar kata triliteral (3 konsonan dasar)',
    strengths: 'Kekayaan morfologi & diksi puitis, bahasa kitab suci & sastra Timur Tengah',
    sample: '"صباح الخير! يسعدني أن ألتقي بك. (Sabahul khair!)"',
    difficulty: 'Tinggi (Level 4-5) karena fonetik khas tenggorokan & tata bahasa nahwu/sharaf'
  },
  'Prancis': {
    family: 'Indo-Eropa (Roman)',
    script: 'Alfabet Latin dengan aksen (é, è, ç)',
    syntax: 'SVO, pembagian gender kata benda (maskulin / feminin)',
    strengths: 'Bahasa diplomasi, gastronomi, seni internasional, pelafalan melodius',
    sample: '"Bonjour! Ravi de vous rencontrer."',
    difficulty: 'Menengah (Level 3) karena ejaan senyap (silent letters)'
  },
  'Jerman': {
    family: 'Indo-Eropa (Jermanik Barat)',
    script: 'Alfabet Latin + Umlaut (ä, ö, ü) & ß',
    syntax: 'SVO dalam klausa utama, SOV dalam anak kalimat, 4 kasus tata bahasa (Kasus)',
    strengths: 'Struktur logika presisi, kata majemuk fleksibel, bahasa rekayasa & teknik',
    sample: '"Guten Morgen! Es freut mich, Sie kennenzulernen."',
    difficulty: 'Menengah ke Tinggi (Level 3-4)'
  },
  'Spanyol': {
    family: 'Indo-Eropa (Roman / Iberia)',
    script: 'Alfabet Latin + ñ',
    syntax: 'SVO, bahasa pro-drop (subjek sering diserap dalam verba)',
    strengths: 'Penutur terbanyak ke-2 di dunia, fonetis mudah dibaca, kehangatan budaya Latin',
    sample: '"¡Buenos días! Es un placer conocerte."',
    difficulty: 'Mudah ke Menengah (Level 2)'
  },
  'Korea': {
    family: 'Koreanik',
    script: 'Hangul (Alfabet fonetik ilmiah)',
    syntax: 'SOV, partikel tata bahasa lengkap, hierarki kehormatan honorifik',
    strengths: 'Sistem tulisan Hangul paling mudah dipelajari di dunia, ekspresi budaya K-Wave',
    sample: '"좋은 아침입니다! 만나서 반갑습니다. (Joeun achimimnida!)"',
    difficulty: 'Tinggi (Level 4)'
  }
};

// Database profil perbandingan bahasa pemrograman
const CODE_LANG_DATA = {
  'JavaScript': {
    paradigm: 'Multi-paradigma: Fungsional, Event-Driven, Berbasis Objek (Prototypal)',
    typing: 'Dinamis, Tipe Lemah (Weakly Typed)',
    syntax: 'C-family, curly braces {}, async/await, first-class functions',
    strengths: 'Berjalan di semua browser web modern, ekosistem npm raksasa, full-stack (Node.js)',
    sample: 'const sapa = (nama) => console.log(`Halo, ${nama}!`);',
    execution: 'JIT Compiled / Interpreted (V8 Engine)'
  },
  'Python': {
    paradigm: 'Multi-paradigma: OOP, Fungsional, Imperatif, Skrip',
    typing: 'Dinamis, Tipe Kuat (Strongly Typed)',
    syntax: 'Indentation-sensitive (tanpa kurung kurawal), sangat mirip bahasa Inggris alami',
    strengths: 'Standar de-facto untuk AI, Machine Learning, Data Science, sintaks sangat bersih',
    sample: 'def sapa(nama):\n    print(f"Halo, {nama}!")',
    execution: 'Interpreted (CPython bytecode)'
  },
  'TypeScript': {
    paradigm: 'Superset terstruktur dari JavaScript dengan Static Type Checking',
    typing: 'Statis dengan Type Inference, compile-time validation',
    syntax: 'Sintaks JavaScript diperkaya Interface, Generics, dan Type Annotations',
    strengths: 'Mencegah bug runtime saat development, autocompletion IDE terbaik, standar enterprise web',
    sample: 'function sapa(nama: string): void {\n  console.log(`Halo, ${nama}!`);\n}',
    execution: 'Transpiled ke JavaScript'
  },
  'Go (Golang)': {
    paradigm: 'Konkuren, Prosedural, Komposisi (Structs & Interfaces tanpa Pewarisan Klasik)',
    typing: 'Statis, Tipe Kuat (Strongly Typed)',
    syntax: 'Minimalis, tanpa ternary operator, tanpa exception (explicit error return)',
    strengths: 'Goroutine concurrency ringan luar biasa, kompilasi super cepat ke binary tunggal',
    sample: 'func sapa(nama string) {\n    fmt.Printf("Halo, %s!\\n", nama)\n}',
    execution: 'Compiled langsung ke Native Machine Code'
  },
  'Rust': {
    paradigm: 'Fungsional, Sistemik, Konkuren tanpa Data Races',
    typing: 'Statis, Kuat, dengan Borrow Checker & Ownership System',
    syntax: 'Ekspresi kaya, pattern matching, tanpa null pointer (menggunakan Option/Result)',
    strengths: 'Keamanan memori tanpa Garbage Collector (Zero-Cost Abstractions), performa setara C++',
    sample: 'fn sapa(nama: &str) {\n    println!("Halo, {}!", nama);\n}',
    execution: 'Compiled via LLVM ke Native Machine Code'
  },
  'C++': {
    paradigm: 'Multi-paradigma: Prosedural, Berorientasi Objek, Generik (Templates)',
    typing: 'Statis, Tipe Kuat dengan konversi manual',
    syntax: 'C-family, pointer manual, alokasi memori heap/stack fleksibel',
    strengths: 'Kecepatan eksekusi puncak, kontrol perangkat keras langsung, standar game engine & OS',
    sample: 'void sapa(std::string nama) {\n    std::cout << "Halo, " << nama << "!\\n";\n}',
    execution: 'Compiled langsung ke Native Machine Code'
  },
  'Java': {
    paradigm: 'Berorientasi Objek Murni (Class-based OOP), Fungsional (Streams)',
    typing: 'Statis, Tipe Kuat dengan tipe primitif & wrapper objek',
    syntax: 'Verbos, eksplisit, penanganan exception terstruktur (checked/unchecked)',
    strengths: 'Prinsip "Write Once, Run Anywhere" via JVM, dominan di enterprise backend & Android legacy',
    sample: 'public static void sapa(String nama) {\n    System.out.println("Halo, " + nama + "!");\n}',
    execution: 'JVM Bytecode dengan JIT Optimization'
  }
};

export default function LanguageInsights({ t, currentLang }) {
  const [insightMode, setInsightMode] = useState('human'); // 'human' | 'code'
  const [lang1, setLang1] = useState(insightMode === 'human' ? 'Indonesia' : 'JavaScript');
  const [lang2, setLang2] = useState(insightMode === 'human' ? 'Inggris' : 'Python');

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [fetchDictionary, { loading: aiLoading }] = useLazyQuery(GET_DICTIONARY);

  const handleModeChange = (mode) => {
    setInsightMode(mode);
    if (mode === 'human') {
      setLang1('Indonesia');
      setLang2('Inggris');
    } else {
      setLang1('JavaScript');
      setLang2('Python');
    }
    setAiAnalysis('');
  };

  const handleRunAiComparison = async () => {
    const prompt = `Bandingkan secara mendalam dan terstruktur fitur antara bahasa ${lang1} dan ${lang2}. Soroti perbedaan arsitektur/tata bahasa, kemudahan belajar, serta skenario penggunaan terbaik masing-masing. Berikan dalam bahasa Indonesia yang ringkas dan profesional.`;
    setAiAnalysis(currentLang === 'id' ? 'Menghubungi AI untuk perbandingan mendalam...' : 'Connecting to AI for deep comparison...');
    try {
      const res = await fetchDictionary({ variables: { keyword: prompt } });
      if (res.data?.dictionary?.result) {
        setAiAnalysis(res.data.dictionary.result);
      } else if (res.data?.dictionary?.error) {
        setAiAnalysis(res.data.dictionary.error);
      }
    } catch (err) {
      setAiAnalysis('⚠️ Error: ' + err.message);
    }
  };

  const currentDataset = insightMode === 'human' ? HUMAN_LANG_DATA : CODE_LANG_DATA;
  const langList = Object.keys(currentDataset);
  const data1 = currentDataset[lang1] || {};
  const data2 = currentDataset[lang2] || {};

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
      <div className="hero" style={{ marginBottom: '22px' }}>
        <h1>{t('insights_title')}</h1>
        <p>{t('insights_subtitle')}</p>
      </div>

      {/* Mode Switcher: Bahasa Manusia vs Bahasa Pemrograman */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px' }}>
        <button
          className={`sub-tab-btn ${insightMode === 'human' ? 'active' : ''}`}
          onClick={() => handleModeChange('human')}
        >
          🌐 {t('insights_mode_human')}
        </button>
        <button
          className={`sub-tab-btn ${insightMode === 'code' ? 'active' : ''}`}
          onClick={() => handleModeChange('code')}
        >
          💻 {t('insights_mode_code')}
        </button>
      </div>

      {/* Selector Pemilihan 2 Bahasa */}
      <div className="insights-selector-bar">
        <div className="insights-select-col">
          <label>{t('insights_select_1')}</label>
          <select
            className="insights-select"
            value={lang1}
            onChange={(e) => setLang1(e.target.value)}
          >
            {langList.map((l) => (
              <option key={l} value={l} disabled={l === lang2}>{l}</option>
            ))}
          </select>
        </div>

        <div className="insights-vs-badge">VS</div>

        <div className="insights-select-col">
          <label>{t('insights_select_2')}</label>
          <select
            className="insights-select"
            value={lang2}
            onChange={(e) => setLang2(e.target.value)}
          >
            {langList.map((l) => (
              <option key={l} value={l} disabled={l === lang1}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matriks Perbandingan Fitur Dua Kolom */}
      <div className="comparison-matrix">
        {/* Kolom Bahasa 1 */}
        <div className="comparison-col">
          <div className="comparison-header col-1">
            <h3>{lang1}</h3>
            <span className="comparison-badge">{insightMode === 'human' ? data1.family : data1.typing}</span>
          </div>
          <div className="comparison-body">
            <div className="comparison-item">
              <span className="item-label">
                {insightMode === 'human' ? t('insights_card_family') : 'Paradigma'}
              </span>
              <p>{insightMode === 'human' ? data1.family : data1.paradigm}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">
                {insightMode === 'human' ? 'Aksara / Huruf' : 'Sistem Pengetikan'}
              </span>
              <p>{insightMode === 'human' ? data1.script : data1.typing}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">{t('insights_card_syntax')}</span>
              <p>{data1.syntax}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">{t('insights_card_pros')}</span>
              <p>{data1.strengths}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">
                {insightMode === 'human' ? t('insights_card_difficulty') : 'Mekanisme Eksekusi'}
              </span>
              <p>{insightMode === 'human' ? data1.difficulty : data1.execution}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">{t('insights_card_sample')}</span>
              <pre className="sample-box">{data1.sample}</pre>
            </div>
          </div>
        </div>

        {/* Kolom Bahasa 2 */}
        <div className="comparison-col">
          <div className="comparison-header col-2">
            <h3>{lang2}</h3>
            <span className="comparison-badge">{insightMode === 'human' ? data2.family : data2.typing}</span>
          </div>
          <div className="comparison-body">
            <div className="comparison-item">
              <span className="item-label">
                {insightMode === 'human' ? t('insights_card_family') : 'Paradigma'}
              </span>
              <p>{insightMode === 'human' ? data2.family : data2.paradigm}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">
                {insightMode === 'human' ? 'Aksara / Huruf' : 'Sistem Pengetikan'}
              </span>
              <p>{insightMode === 'human' ? data2.script : data2.typing}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">{t('insights_card_syntax')}</span>
              <p>{data2.syntax}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">{t('insights_card_pros')}</span>
              <p>{data2.strengths}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">
                {insightMode === 'human' ? t('insights_card_difficulty') : 'Mekanisme Eksekusi'}
              </span>
              <p>{insightMode === 'human' ? data2.difficulty : data2.execution}</p>
            </div>
            <div className="comparison-item">
              <span className="item-label">{t('insights_card_sample')}</span>
              <pre className="sample-box">{data2.sample}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol AI Deep Dive Comparison */}
      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
        <button
          className="btn-huge btn-cyan"
          style={{ padding: '14px 30px', fontSize: '1rem', fontWeight: 800 }}
          onClick={handleRunAiComparison}
          disabled={aiLoading}
        >
          {aiLoading ? 'Menganalisis Perbandingan...' : `✨ Minta Analisis Perbandingan AI (${lang1} vs ${lang2})`}
        </button>
      </div>

      {/* Hasil Analisis AI */}
      {aiAnalysis && (
        <div className="ai-comparison-result-card">
          <div className="ai-result-title">
            <span>🤖 Hasil Analisis Komparatif AI: {lang1} & {lang2}</span>
          </div>
          <div className="ai-result-content">
            {aiAnalysis}
          </div>
        </div>
      )}
    </div>
  );
}
