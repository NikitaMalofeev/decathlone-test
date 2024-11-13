// Filename - server.js

// Requiring modules
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');

// Creating express app object
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = new sqlite3.Database('./database.db');
const PORT = process.env.PORT || 3000;

// CORS configuration for specific origins
let corsOptions = {
    origin: [
        'decathlone-employee-app.netlify.app',
        'decathlone-qr-code-app.netlify.app'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
};

app.use(express.json());
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// Database initialization
db.run(`CREATE TABLE IF NOT EXISTS scan_logs (
  id INTEGER PRIMARY KEY,
  employee_name TEXT,
  qr_code TEXT,
  scan_time TIMESTAMP
)`);

// Endpoint for scanning
app.post('/scan', cors(corsOptions), (req, res) => {
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

// Start server
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
