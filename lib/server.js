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
    <a href="/pair">👉 Open Pair Page</a>
    `);
});

/* ================= PAIR PAGE ================= */
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
            .box{
                background:#1e293b;
                padding:25px;
                border-radius:10px;
                width:320px;
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
                font-weight:bold;
                cursor:pointer;
                border-radius:6px;
            }
        </style>
    </head>
    <body>
        <div class="box">
            <h3>Generate Pair Code</h3>
            <form action="/pair-code">
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

    // Bot ready check
    if (!global.QasimDev) {
        return res.send(`
        <h2>⚠️ Bot Not Ready</h2>
        <p>Please wait 20–30 seconds and try again.</p>
        <a href="/pair">⬅ Back</a>
        `);
    }

    try {
        const code = await global.QasimDev.requestPairingCode(number);

        res.send(`
        <h2>✅ Pair Code Generated</h2>
        <p><b>Number:</b> ${number}</p>
        <h1 style="color:green">${code}</h1>
        <a href="/pair">⬅ Back</a>
        `);

    } catch (err) {
        res.send(`
        <h2>❌ Error</h2>
        <p>${err.message}</p>
        <a href="/pair">⬅ Back</a>
        `);
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

export { app, server, PORT };
