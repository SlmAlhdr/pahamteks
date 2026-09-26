import http from 'http';
import app from './app.js';
import { testDbConnection } from './config/db.js';
import { getApiKeyPoolStatus } from './config/gemini.js';

// Jalankan Express pada port environment atau port lokal default.
const PORT = process.env.PORT || 4000;
// Default development listener hanya menerima koneksi dari komputer ini.
const HOST = process.env.HOST || '127.0.0.1';
const httpServer = http.createServer(app);

httpServer.listen(PORT, HOST, async () => {
    console.log(`\n======================================================`);
    console.log(`🚀 [PahamTeks Backend] Berjalan di http://${HOST}:${PORT}`);
    console.log(`📡 [GraphQL Endpoint]: http://localhost:${PORT}/graphql`);
    console.log(`🏥 [Public Health]:    http://localhost:${PORT}/healthz`);
    console.log(`🔒 [Admin Health]:     http://localhost:${PORT}/health`);

    const keyStatus = getApiKeyPoolStatus();
    if (keyStatus.totalKeys > 0) {
        console.log(`🔑 [Gemini API]:       ${keyStatus.totalKeys} Key terdaftar dalam mode Round-Robin`);
    } else {
        console.warn(`⚠️ [Gemini API]:       Belum ada API Key di server/.env (Isi GEMINI_API_KEY_1)`);
    }

    console.log(`💾 [MySQL Database]:   Menguji koneksi...`);
    await testDbConnection();
    console.log(`======================================================\n`);
});
