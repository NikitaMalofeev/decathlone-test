const express = require('express');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = new sqlite3.Database('./database.db');
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
    'https://decathlone-employee-app.netlify.app',
    'https://decathlone-qr-code-app.netlify.app'
];

app.use(express.json());
app.options('*', cors());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.options('*', cors());

db.run(`CREATE TABLE IF NOT EXISTS scan_logs (
  id INTEGER PRIMARY KEY,
  employee_name TEXT,
  qr_code TEXT,
  scan_time TIMESTAMP
)`);

app.post('/scan', (req, res) => {
    const { employeeName, qrCode } = req.body;
    const scanTime = new Date().toISOString();

    db.run(
        `INSERT INTO scan_logs (employee_name, qr_code, scan_time) VALUES (?, ?, ?)`,
        [employeeName, qrCode, scanTime],
        function (err) {
            if (err) {
                return res.status(500).send('Ошибка записи данных');
            }
            res.status(200).send('Данные успешно сохранены');

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ employeeName, qrCode, scanTime }));
                }
            });
        }
    );
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
