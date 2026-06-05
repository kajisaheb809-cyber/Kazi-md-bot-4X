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

/* ================= HOME ================= */
app.get('/', (req, res) => {
    res.send(`
    <h2>${packageInfo.name}</h2>
    <p>${packageInfo.description}</p>
    <a href="/pair">Go Pair Page</a>
    `);
});

/* ================= PAIR PAGE ================= */
app.get('/pair', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Pair Code</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body{
                margin:0;
                background:#0f172a;
                color:white;
                font-family:Arial;
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
            }
            .box{
                background:#1e293b;
                padding:20px;
                border-radius:10px;
                width:300px;
                text-align:center;
            }
            input,button{
                width:100%;
                padding:10px;
                margin-top:10px;
                border:none;
                border-radius:6px;
            }
            button{
                background:#25d366;
                font-weight:bold;
                cursor:pointer;
            }
        </style>
    </head>
    <body>
        <div class="box">
            <h3>Generate Pair Code</h3>
            <form action="/pair-code" method="GET">
                <input name="number" placeholder="8801629143977" required />
                <button type="submit">Generate</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

/* ================= PAIR CODE ================= */
app.get('/pair-code', async (req, res) => {
    const number = req.query.number;

    if (!number) {
        return res.send("❌ Number missing");
    }

    try {
        if (!global.QasimDev) {
            return res.send("⚠️ Bot not ready. Try again later.");
        }

        const code = await global.QasimDev.requestPairingCode(number);

        res.send(`
        <h2>✅ Pair Code Generated</h2>
        <p>Number: ${number}</p>
        <h3 style="color:green">${code}</h3>
        <a href="/pair">Back</a>
        `);

    } catch (err) {
        res.send("❌ Error: " + err.message);
    }
});

/* ================= HEALTH ================= */
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
        bot: packageInfo.name
    });
});

/* ================= EXPORT ================= */
export { app, server, PORT };
