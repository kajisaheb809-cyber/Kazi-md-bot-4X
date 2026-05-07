/*****************************************************************************
 *                                                                           *
 *                     Developed By Kazi-md-bot-4X                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/kajisaheb809-cyber                         *
 *  ▶️  YouTube  : https://www.youtube.com/@Kazi-md-bot-4X                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VbC8MBZHrDZelHN6bJ2C     *
 *                                                                           *
 *    © 2026 kajisaheb809-cyber. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the Kazi-md-bot-4X Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
export default {
    command: 'uptime',
    aliases: ['runtime'],
    category: 'general',
    description: 'Show bot status information',
    usage: '.uptime',
    isPrefixless: true,
    async handler(sock, message) {
        const chatId = message.key.remoteJid;
        const commandHandler = (await import('../lib/commandHandler.js')).default;
        const uptimeMs = process.uptime() * 1000;
        const formatUptime = (ms) => {
            const sec = Math.floor(ms / 1000) % 60;
            const min = Math.floor(ms / (1000 * 60)) % 60;
            const hr = Math.floor(ms / (1000 * 60 * 60)) % 24;
            const day = Math.floor(ms / (1000 * 60 * 60 * 24));
            const parts = [];
            if (day)
                parts.push(`${day}d`);
            if (hr)
                parts.push(`${hr}h`);
            if (min)
                parts.push(`${min}m`);
            parts.push(`${sec}s`);
            return parts.join(' ');
        };
        const startedAt = new Date(Date.now() - uptimeMs).toLocaleString();
        const ramMb = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
        const commandCount = commandHandler.commands.size;
        const text = `🤖 *Kazi-md-bot-4X STATUS*\n\n` +
            `⏱ Uptime: ${formatUptime(uptimeMs)}\n` +
            `🚀 Started: ${startedAt}\n` +
            `📦 Plugins: ${commandCount}\n` +
            `💾 RAM: ${ramMb} MB`;
        await sock.sendMessage(chatId, { text });
    }
};
/*****************************************************************************
 *                                                                           *
 *                     Developed By Kazi-md-bot-4X                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/kajisaheb809-cyber                         *
 *  ▶️  YouTube  : https://www.youtube.com/@Kazi-md-bot-4X                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VbC8MBZHrDZelHN6bJ2C     *
 *                                                                           *
 *    © 2026 kajisaheb809-cyber. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the Kazi-md-bot-4X Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
