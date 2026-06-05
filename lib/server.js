import express from 'express';
import { createServer } from 'http';
import config from '../config.js';

const packageInfo = {
    name: config.botName || 'Kazi-MD-bot-4X',
    version: config.version || '6.0.0',
    description: config.description || 'WhatsApp Bot',
    author: config.author || 'GlobalTechInfo'
};

const app = express();
const server = createServer(app);
const PORT = config.port || 5000;

/* ===================== HOME PAGE ===================== */
app.get('/', (req, res) => {
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${packageInfo.name.toUpperCase()} Status</title>
        <style>
            body { margin:0; background:#0f172a; color:white; font-family:Arial; }
            .container { padding:30px; text-align:center; }
            .box { background:#1e293b; padding:20px; border-radius:12px; }
            a { color:#25d366; text-decoration:none; font-weight:bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="box">
                <h2>${packageInfo.name}</h2>
                <p>${packageInfo.description}</p>
                <p>Uptime: ${uptimeString}</p>
                <a href="/pair">👉 Generate Pair Code</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

/* ===================== PAIR PAGE (NEW) ===================== */
app.get('/pair', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Pair Code Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body{
                margin:0;
                font-family:Arial;
                background:#0f172a;
                color:white;
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
            }
            .card{
                background:#1e293b;
                padding:25px;
                border-radius:12px;
                width:300px;
                text-align:center;
            }
            input{
                width:100%;
                padding:10px;
                margin:10px 0;
                border:none;
                border-radius:6px;
            }
            button{
                width:100%;
                padding:10px;
                background:#25d366;
                border:none;
                color:black;
                font-weight:bold;
                border-radius:6px;
                cursor:pointer;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h3>Pair Code Generator</h3>
            <form action="/pair-code" method="GET">
                <input type="text" name="number" placeholder="8801629143977" required />
                <button type="submit">Generate Pair Code</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

/* ===================== HEALTH ===================== */
app.get('/health', (req, res) => {
    const mem = process.memoryUsage();
    res.json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        memory: {
            rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`
        },
        version: packageInfo.version,
        bot: packageInfo.name,
        timestamp: new Date().toISOString()
    });
});

/* ===================== PROCESS ===================== */
app.get('/process', (req, res) => {
    const { send } = req.query;
    if (!send)
        return res.status(400).json({ error: 'Missing send query' });

    res.json({ status: 'Received', data: send });
});

/* ===================== CHAT ===================== */
app.get('/chat', (req, res) => {
    const { message, to } = req.query;
    if (!message || !to)
        return res.status(400).json({ error: 'Missing message or to query' });

    res.json({ status: 200, info: 'Message received (not implemented)' });
});

/* ===================== EXPORT ===================== */
export { app, server, PORT };
