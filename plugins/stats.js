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
import CommandHandler from '../lib/commandHandler.js';
export default {
    command: 'perf',
    aliases: ['metrics', 'diagnostics'],
    category: 'general',
    description: 'View command performance and error metrics',
    usage: '.perf',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        try {
            const report = CommandHandler.getDiagnostics();
            if (!report || report.length === 0) {
                return await sock.sendMessage(chatId, { text: '_No performance data collected yet._' }, { quoted: message });
            }
            let text = `📊 *PLUGINS PERFORMANCE*\n\n`;
            report.forEach((cmd, index) => {
                const errorText = cmd.errors > 0 ? `❗ Errors: ${cmd.errors}` : `✅ Smooth`;
                text += `${index + 1}. *${cmd.command.toUpperCase()}*\n`;
                text += `   ↳ Calls: ${cmd.usage}\n`;
                text += `   ↳ Latency: ${cmd.average_speed}\n`;
                text += `   ↳ Status: ${errorText}\n\n`;
            });
            await sock.sendMessage(chatId, {
                text: text.trim(),
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '0029VbC8MBZHrDZelHN6bJ2C@newsletter',
                        newsletterName: 'Kazi-md-bot-4X PERFORMANCE',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }
        catch (error) {
            console.error('Error in perf command:', error);
            await sock.sendMessage(chatId, { text: '❌ Failed to fetch performance metrics.' }, { quoted: message });
        }
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
