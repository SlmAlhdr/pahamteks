const canvas = document.getElementById('auroraCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let time = 0;

// Fungsi untuk menyesuaikan ukuran canvas dengan layar browser
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// Memanggil resize saat layar diubah ukurannya
window.addEventListener('resize', resize);
resize();

// Fungsi untuk menggambar satu lapisan gelombang aurora
function drawAurora(yOffset, color, speed, waveHeight) {
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    // Looping untuk membentuk titik-titik gelombang dari kiri ke kanan
    for (let x = 0; x <= width; x += 10) {
        // Mengkombinasikan fungsi sin dan cos agar gerakan gelombang terlihat acak dan natural
        let y = yOffset 
              + Math.sin(x * 0.002 + time * speed) * waveHeight 
              + Math.cos(x * 0.005 + time * speed * 0.8) * (waveHeight * 0.5);
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    // Membuat gradasi warna agar gelombang perlahan memudar transparan ke bawah
    let gradient = ctx.createLinearGradient(0, yOffset - waveHeight, 0, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.fill();
}

// Fungsi animasi utama yang berjalan 60 frame per detik
function animate() {
    // Menghapus frame sebelumnya
    ctx.clearRect(0, 0, width, height);

    // Efek blending 'screen' untuk membuat warna aurora terlihat menyala/glowing saat bertumpuk
    ctx.globalCompositeOperation = 'screen';

    // Menggambar 3 lapisan aurora (Hijau, Biru Muda, dan Ungu)
    // Parameter: Tinggi Vertikal, Warna (RGBA), Kecepatan Gerak, Tinggi Gelombang
    drawAurora(height * 0.4, 'rgba(0, 255, 128, 0.15)', 0.001, 150);  // Hijau
    drawAurora(height * 0.5, 'rgba(0, 200, 255, 0.1)', 0.0015, 120);  // Biru Muda
    drawAurora(height * 0.3, 'rgba(128, 0, 255, 0.1)', 0.0008, 200);  // Ungu Gelap

    time += 1;
    requestAnimationFrame(animate); // Memutar animasi secara terus menerus
}

// Memulai animasi
animate();