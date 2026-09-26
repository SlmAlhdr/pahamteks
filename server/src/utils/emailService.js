import nodemailer from 'nodemailer';

/**
 * Konfigurasi Nodemailer Transporter
 * Mendukung Gmail langsung (dengan App Password) atau custom SMTP host.
 */
function createTransporter(preferredPort = null) {
  const user = (process.env.EMAIL_USER || process.env.SMTP_USER || '').trim();
  const rawPass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').trim();
  const pass = rawPass.replace(/\s+/g, ''); // Menghapus spasi otomatis jika pengguna copy-paste dari Sandi Aplikasi Google
  const host = process.env.SMTP_HOST;
  const port = preferredPort || (process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      pool: false
    });
  }

  // Default menggunakan Gmail SMTP resmi (port 465 SSL atau port 587 TLS)
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    pool: false
  });
}

/**
 * Mengirim email kode verifikasi OTP resmi ke email tujuan
 * @param {string} toEmail - Alamat email penerima
 * @param {string} otpCode - Kode OTP 6 digit
 * @returns {Promise<{success: boolean, message: string, previewUrl?: string}>}
 */
export async function sendOtpEmail(toEmail, otpCode) {
  const transporter = createTransporter();

  const subject = `Kode Verifikasi PahamTeks: ${otpCode}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verifikasi Akun PahamTeks</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333333; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0f2c3f, #115930); padding: 30px 20px; text-align: center; color: #ffffff; }
        .logo { font-size: 26px; font-weight: 900; letter-spacing: 0.5px; }
        .logo span { color: #7ef2e0; }
        .content { padding: 35px 30px; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 700; margin-bottom: 15px; color: #153a52; }
        .otp-box { background: #eefaf8; border: 2px dashed #7ef2e0; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0; }
        .otp-number { font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #0a4d3c; margin: 0; font-family: monospace; }
        .otp-label { font-size: 13px; color: #666666; margin-top: 8px; }
        .notice { font-size: 13px; color: #777777; background: #fafafa; border-left: 4px solid #ff9f43; padding: 12px 16px; border-radius: 4px; margin-top: 20px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; background: #fafafa; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Paham<span>Teks</span></div>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">Platform Pembelajaran Bahasa & Logika Pemrograman</p>
        </div>
        <div class="content">
          <div class="greeting">Halo, Calon Pengguna PahamTeks!</div>
          <p>Terima kasih telah melakukan pendaftaran. Silakan gunakan kode verifikasi di bawah ini untuk mengonfirmasi email dan mengaktifkan akun resmi Anda:</p>
          
          <div class="otp-box">
            <div class="otp-number">${otpCode}</div>
            <div class="otp-label">Kode Verifikasi Resmi (Berlaku 10 Menit)</div>
          </div>

          <p>Masukkan kode di atas pada formulir pendaftaran aplikasi PahamTeks.</p>

          <div class="notice">
            <strong>Keamanan:</strong> Jangan bagikan kode ini kepada siapapun. Pihak PahamTeks tidak akan pernah meminta kode verifikasi ini.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} PahamTeks. Seluruh hak cipta dilindungi undang-undang.<br>
          Email ini dikirim secara otomatis, mohon untuk tidak membalas email ini.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.warn('[EMAIL SERVICE] Gagal: EMAIL_USER dan EMAIL_PASS belum diisi di environment!');
    return {
      success: false,
      delivered: false,
      message: 'Email pengirim belum dikonfigurasi di Vercel. Harap tambahkan EMAIL_USER dan EMAIL_PASS di Vercel Dashboard > Settings > Environment Variables.'
    };
  }

  try {
    const sender = process.env.EMAIL_FROM || `"PahamTeks" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: sender,
      to: toEmail,
      subject,
      html: htmlContent
    });

    console.log(`[EMAIL SERVICE] OTP berhasil dikirim ke ${toEmail}. MessageId: ${info.messageId}`);
    return {
      success: true,
      delivered: true,
      message: `Kode verifikasi resmi telah dikirim ke ${toEmail}. Silakan cek kotak masuk atau folder spam Anda.`
    };
  } catch (err) {
    console.error('[EMAIL SERVICE ERROR]', err.message);
    return {
      success: false,
      delivered: false,
      message: `Gagal mengirim email: ${err.message}. Pastikan alamat email dan 16-karakter Sandi Aplikasi Google (EMAIL_PASS) Anda benar.`
    };
  }
}

/**
 * Mengirim email kode verifikasi reset kata sandi ke email tujuan
 * @param {string} toEmail - Alamat email penerima
 * @param {string} otpCode - Kode OTP 6 digit
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendPasswordResetEmail(toEmail, otpCode) {
  const transporter = createTransporter();

  const subject = `Kode Reset Kata Sandi PahamTeks: ${otpCode}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Kata Sandi PahamTeks</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333333; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0f2c3f, #c0392b); padding: 30px 20px; text-align: center; color: #ffffff; }
        .logo { font-size: 26px; font-weight: 900; letter-spacing: 0.5px; }
        .logo span { color: #ff7675; }
        .content { padding: 35px 30px; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 700; margin-bottom: 15px; color: #153a52; }
        .otp-box { background: #fff5f5; border: 2px dashed #ff7675; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0; }
        .otp-number { font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #d63031; margin: 0; font-family: monospace; }
        .otp-label { font-size: 13px; color: #666666; margin-top: 8px; }
        .notice { font-size: 13px; color: #777777; background: #fafafa; border-left: 4px solid #ff9f43; padding: 12px 16px; border-radius: 4px; margin-top: 20px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; background: #fafafa; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Paham<span>Teks</span></div>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">Pengaturan Ulang Kata Sandi Akun</p>
        </div>
        <div class="content">
          <div class="greeting">Halo Pengguna PahamTeks,</div>
          <p>Kami menerima permintaan untuk mereset kata sandi akun PahamTeks Anda. Silakan gunakan kode verifikasi di bawah ini untuk mengonfirmasi penggantian kata sandi baru:</p>
          
          <div class="otp-box">
            <div class="otp-number">${otpCode}</div>
            <div class="otp-label">Kode Reset Kata Sandi (Berlaku 10 Menit)</div>
          </div>

          <p>Masukkan kode ini pada jendela Atur Ulang Kata Sandi di aplikasi PahamTeks beserta kata sandi baru Anda.</p>

          <div class="notice">
            <strong>Perhatian Keamanan:</strong> Jika Anda tidak pernah meminta reset kata sandi, abaikan email ini. Akun Anda tetap aman dan kata sandi Anda tidak akan berubah tanpa kode ini.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} PahamTeks. Seluruh hak cipta dilindungi undang-undang.<br>
          Email ini dikirim secara otomatis, mohon untuk tidak membalas email ini.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.error('[EMAIL SERVICE] Gagal: EMAIL_USER dan EMAIL_PASS belum diisi!');
    return {
      success: false,
      message: 'Pengirim email belum dikonfigurasi pada sistem server.'
    };
  }

  try {
    const sender = process.env.EMAIL_FROM || `"PahamTeks Keamanan" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: sender,
      to: toEmail,
      subject,
      html: htmlContent
    });

    console.log(`[EMAIL SERVICE] OTP Reset Password terkirim ke ${toEmail}. MessageId: ${info.messageId}`);
    return {
      success: true,
      message: `Kode reset kata sandi telah dikirim ke ${toEmail}. Silakan cek kotak masuk atau spam.`
    };
  } catch (err) {
    console.error('[EMAIL SERVICE RESET ERROR]', err.message);
    return {
      success: false,
      message: `Gagal mengirim email reset: ${err.message}`
    };
  }
}
