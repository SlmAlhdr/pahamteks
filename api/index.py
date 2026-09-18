from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import random
import os
import re
import itertools # Library untuk siklus Round Robin

app = Flask(__name__)
CORS(app)

# --- SISTEM ROUND ROBIN API KEY ---
api_keys_pool = []

# Mengumpulkan GEMINI_API_KEY_1 sampai GEMINI_API_KEY_9 dari Vercel
for i in range(1, 10):
    key = os.environ.get(f"GEMINI_API_KEY_{i}")
    if key:
        api_keys_pool.append(key.strip())

# Fallback: Jika Anda lupa mengubah nama dan masih memakai 'GEMINI_API_KEY' biasa
if not api_keys_pool:
    single_key = os.environ.get("GEMINI_API_KEY")
    if single_key:
        api_keys_pool.append(single_key.strip())

# Membuat siklus putaran kunci (Key 1 -> Key 2 -> Key 3 -> Balik ke Key 1)
key_cycle = itertools.cycle(api_keys_pool) if api_keys_pool else None

quiz_cache = {}
users_db = {}
otp_db = {}

# --- MESIN PENGGERAK UTAMA DENGAN ROTASI KUNCI OTOMATIS ---
def generate_safe(prompt):
    if not key_cycle:
        raise Exception("API Key Gemini belum terpasang di Vercel (Gunakan GEMINI_API_KEY_1).")
    
    # Batas maksimal mencoba adalah 2x jumlah total API Key yang Anda punya
    max_attempts = len(api_keys_pool) * 2
    
    for attempt in range(max_attempts):
        # 1. Ambil kunci giliran selanjutnya
        current_key = next(key_cycle)
        
        # 2. Pasang kunci tersebut ke sistem Google
        genai.configure(api_key=current_key)
        
        # MENGGUNAKAN MODEL GEMINI TERBARU UNTUK MENGHINDARI ERROR 404
        model = genai.GenerativeModel('gemini-3.6-flash')
        
        try:
            # 3. Eksekusi perintah
            return model.generate_content(prompt)
        except Exception as e:
            err_str = str(e).lower()
            # 4. Jika kunci ini limit/habis, jangan error! Putar terus ke kunci selanjutnya.
            if "429" in err_str or "quota" in err_str:
                print(f"[ROUND ROBIN] Kunci limit. Beralih ke kunci berikutnya...")
                continue
            else:
                # Jika errornya bukan karena limit, lempar error aslinya
                raise e
                
    # Jika putaran sudah mencoba SEMUA kunci dan semuanya habis
    raise Exception("Seluruh kuota dari semua API Key Anda telah habis. Mohon tunggu beberapa saat.")

# Fungsi Pembersih JSON
def parse_safe_json(raw_text):
    try:
        text = re.sub(r'```[a-zA-Z]*\n', '', raw_text)
        text = text.replace('```', '').strip()
        start = text.find('[')
        end = text.rfind(']') + 1
        if start != -1 and end != 0:
            text = text[start:end]
        return json.loads(text)
    except Exception as e:
        raise Exception(f"Gagal membedah JSON. Teks AI: {raw_text}")

@app.route('/api/send_otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email', '').strip()
    if not email: return jsonify({'error': 'Email wajib diisi!'}), 400
    if email in users_db: return jsonify({'error': 'Email terdaftar! Sign In.'}), 400
    otp_db[email] = "123456" 
    return jsonify({'message': 'Kode terkirim!'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    fname = data.get('fname', '').strip()
    lname = data.get('lname', '').strip()
    otp_code = data.get('otp', '').strip()
    
    if not email or not password or not fname or not lname:
        return jsonify({'error': 'Data tidak lengkap!'}), 400
    if otp_db.get(email) != otp_code:
        return jsonify({'error': 'Kode OTP salah!'}), 400
    if email in users_db:
        return jsonify({'error': 'Email terdaftar!'}), 400
        
    full_name = f"{fname} {lname}"
    users_db[email] = {'name': full_name, 'password': password}
    del otp_db[email]
    return jsonify({'message': 'Pendaftaran berhasil.', 'name': full_name})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    if email not in users_db: return jsonify({'error': 'Email tidak ditemukan!'}), 400
    if users_db[email]['password'] != password: return jsonify({'error': 'Kata sandi salah!'}), 400
    return jsonify({'message': 'Login berhasil!', 'name': users_db[email]['name']})

@app.route('/api/user_log', methods=['POST'])
def user_log():
    return jsonify({'status': 'logged'})

LANGUAGES = {
    "afrikaans": "af", "albanian": "sq", "amharic": "am", "arabic": "ar", "armenian": "hy", "azerbaijani": "az",
    "basque": "eu", "belarusian": "be", "bengali": "bn", "bosnian": "bs", "bulgarian": "bg", "catalan": "ca",
    "cebuano": "ceb", "chichewa": "ny", "chinese (simplified)": "zh-cn", "chinese (traditional)": "zh-tw",
    "corsican": "co", "croatian": "hr", "czech": "cs", "danish": "da", "dutch": "nl", "english": "en",
    "esperanto": "eo", "estonian": "et", "filipino": "tl", "finnish": "fi", "french": "fr", "frisian": "fy",
    "galician": "gl", "georgian": "ka", "german": "de", "greek": "el", "gujarati": "gu", "haitian creole": "ht",
    "hausa": "ha", "hawaiian": "haw", "hebrew": "he", "hindi": "hi", "hmong": "hmn", "hungarian": "hu",
    "icelandic": "is", "igbo": "ig", "indonesian": "id", "irish": "ga", "italian": "it", "japanese": "ja",
    "javanese": "jw", "kannada": "kn", "kazakh": "kk", "khmer": "km", "korean": "ko", "kurdish (kurmanji)": "ku",
    "kyrgyz": "ky", "lao": "lo", "latin": "la", "latvian": "lv", "lithuanian": "lt", "luxembourgish": "lb",
    "macedonian": "mk", "malagasy": "mg", "malay": "ms", "malayalam": "ml", "maltese": "mt", "maori": "mi",
    "marathi": "mr", "mongolian": "mn", "myanmar (burmese)": "my", "nepali": "ne", "norwegian": "no",
    "pashto": "ps", "persian": "fa", "polish": "pl", "portuguese": "pt", "punjabi": "pa", "romanian": "ro",
    "russian": "ru", "samoan": "sm", "scots gaelic": "gd", "serbian": "sr", "sesotho": "st", "shona": "sn",
    "sindhi": "sd", "sinhala": "si", "slovak": "sk", "slovenian": "sl", "somali": "so", "spanish": "es",
    "sundanese": "su", "swahili": "sw", "swedish": "sv", "tajik": "tg", "tamil": "ta", "telugu": "te",
    "thai": "th", "turkish": "tr", "ukrainian": "uk", "urdu": "ur", "uzbek": "uz", "vietnamese": "vi",
    "welsh": "cy", "xhosa": "xh", "yiddish": "yi", "yoruba": "yo", "zulu": "zu"
}

@app.route('/api/languages', methods=['GET'])
def get_languages():
    return jsonify(LANGUAGES)

@app.route('/api/translate', methods=['POST'])
def translate_text():
    data = request.json
    teks = data.get('text', '').strip()
    if not teks: return jsonify({'translated_text': ''})

    source_name = next((k for k, v in LANGUAGES.items() if v == data.get('source')), "Auto Detect")
    target_name = next((k for k, v in LANGUAGES.items() if v == data.get('target')), "English")
            
    try:
        prompt = f"Translate exactly from {source_name} to {target_name}:\n{teks}\n\nONLY output the translation."
        response = generate_safe(prompt)
        return jsonify({'translated_text': response.text.strip().strip('"')})
    except Exception as e:
        return jsonify({'translated_text': f'⚠️ AI Error: {str(e)}'})

@app.route('/api/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.json
    categories = data.get('categories', [])
    level = data.get('level', 'Pemula')
    cache_key = f"{level}_{'_'.join(categories)}"
    
    if cache_key in quiz_cache:
        cached_data = quiz_cache[cache_key].copy()
        random.shuffle(cached_data) 
        return jsonify(cached_data)
        
    prompt = f"""
    Buat 5 soal kuis tingkat {level} materi: {', '.join(categories)}.
    Format JSON Array persis ini:
    [
      {{ "instruction": "Perintah", "question": "Soal lengkap", "options": ["A", "B", "C", "D"], "answer": "A" }}
    ]
    GANTI tanda kutip ganda (") di dalam soal/opsi dengan kutip tunggal ('). Output JSON saja.
    """
    try:
        response = generate_safe(prompt)
        quiz_data = parse_safe_json(response.text)
        quiz_cache[cache_key] = quiz_data
        return jsonify(quiz_data)
    except Exception as e:
        err_msg = str(e).replace('"', "'")
        return jsonify([{
            "instruction": "🚨 SISTEM ERROR",
            "question": f"Detail: {err_msg}",
            "options": ["Cek API Key", "Tunggu", "Refresh", "Ok"],
            "answer": "Cek API Key"
        }])

@app.route('/api/generate_challenge', methods=['POST'])
def generate_challenge():
    data = request.json
    category = data.get('category', 'General')
    prompt = f"""
    Buat 3 soal ujian SULIT topik: {category}.
    Format JSON Array persis ini:
    [
      {{ "instruction": "Tantangan", "question": "Soal lengkap", "options": ["A", "B", "C", "D"], "answer": "A" }}
    ]
    GANTI tanda kutip ganda (") di dalam soal/opsi dengan kutip tunggal ('). Output JSON saja.
    """
    try:
        response = generate_safe(prompt)
        challenge_data = parse_safe_json(response.text)
        return jsonify(challenge_data)
    except Exception as e:
        err_msg = str(e).replace('"', "'")
        return jsonify([{
            "instruction": "🚨 SISTEM ERROR",
            "question": f"Detail: {err_msg}",
            "options": ["Cek API", "Tunggu", "Ok", "Batal"],
            "answer": "Ok"
        }])

@app.route('/api/dictionary', methods=['POST'])
def dictionary():
    data = request.json
    keyword = data.get('keyword', '')
    prompt = f"Kamus AI. Cari: '{keyword}'. Berikan Definisi & contoh kalimat (jika bahasa) atau Fungsi & contoh (jika IT). Tolak jika di luar topik edukasi."
    try:
        response = generate_safe(prompt)
        return jsonify({'result': response.text.strip()})
    except Exception as e:
        return jsonify({'result': f'⚠️ AI Error: {str(e)}'})

@app.route('/')
@app.route('/index.html')
def home():
    try:
        file_path = os.path.join(os.path.dirname(__file__), '..', 'index.html')
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"<h1>Memuat Tampilan...</h1><p>Error: {e}</p>"