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
import yts from 'yt-search';
export default {
    command: 'ytsearch',
    aliases: ['yts', 'playlist', 'playlista'],
    category: 'music',
    description: 'Search YouTube',
    usage: '.yts [query]',
    async handler(sock, message, args, context) {
        const { chatId, config } = context;
        const query = args.join(' ');
        const prefix = config.prefix;
        if (!query) {
            return sock.sendMessage(chatId, {
                text: `Example: *${prefix}yts* Lil Peep`
            }, { quoted: message });
        }
        try {
            await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });
            const result = await yts(query);
            const videos = result.videos.slice(0, 10);
            if (videos.length === 0) {
                return sock.sendMessage(chatId, { text: '❌ No results found.' });
            }
            let searchText = `✨ *MUSIC SEARCH* ✨\n\n`;
            videos.forEach((v, index) => {
                searchText += `*${index + 1}.🎧 ${v.title}*\n`;
                searchText += `*⌚ Duration:* ${v.timestamp}\n`;
                searchText += `*👀 Views:* ${v.views}\n`;
                searchText += `*🔗 URL:* ${v.url}\n`;
                searchText += `──────────────────\n`;
            });
            await sock.sendMessage(chatId, {
                image: { url: videos[0].image },
                caption: searchText
            }, { quoted: message });
        }
        catch (error) {
            console.error('YouTube Search Error:', error);
            await sock.sendMessage(chatId, { text: '❌ Error searching YouTube.' });
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
