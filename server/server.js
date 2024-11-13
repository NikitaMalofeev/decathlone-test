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
const PORT = process.env.PORT || 3000; // Добавлено значение по умолчанию

let corsOptions = {
    origin: [
        'https://decathlone-employee-app.netlify.app',
        'https://decathlone-qr-code-app.netlify.app'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.use(express.json());

// WebSocket-соединение
wss.on('connection', (ws) => {
    console.log('Клиент подключился к WebSocket');
    ws.send('Добро пожаловать! Соединение установлено.');

    ws.on('message', (message) => {
        console.log('Получено сообщение от клиента:', message);
    });

    ws.on('close', () => {
        console.log('Клиент отключился от WebSocket');
    });
});

// Database initialization
db.run(`CREATE TABLE IF NOT EXISTS scan_logs (
  id INTEGER PRIMARY KEY,
  employee_name TEXT,
  qr_code TEXT,
  scan_time TIMESTAMP
)`);

app.options('*', cors(corsOptions));

// Endpoint for scanning
// Endpoint for scanning
app.post('/scan', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://decathlone-employee-app.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

            // Отправка сообщения всем подключенным клиентам WebSocket
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'scan', // Добавлено поле type для идентификации сообщения
                        employeeName,
                        qrCode,
                        scanTime
                    }));
                }
            });
        }
    );
});


// Start server
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
