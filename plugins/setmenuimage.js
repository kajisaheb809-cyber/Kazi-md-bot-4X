import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  command: 'setmenuimage',
  aliases: ['setmenuimg'],
  category: 'owner',
  description: 'Set menu image',

  async handler(sock, message) {
    try {
      const chatId = message.key.remoteJid;

      const ctx =
        message.message?.extendedTextMessage?.contextInfo;

      if (!ctx?.quotedMessage) {
        return await sock.sendMessage(
          chatId,
          {
            text: '📷 Reply to an image/sticker'
          },
          { quoted: message }
        );
      }

      const quotedMsg = ctx.quotedMessage;

      const media =
        quotedMsg.imageMessage ||
        quotedMsg.stickerMessage;

      if (!media) {
        return await sock.sendMessage(
          chatId,
          {
            text: '❌ Reply must contain image/sticker'
          },
          { quoted: message }
        );
      }

      // target
      const targetMessage = {
        key: {
          remoteJid: chatId,
          id: ctx.stanzaId,
          participant: ctx.participant,
        },
        message: quotedMsg,
      };

      // download
      const buffer = await downloadMediaMessage(
        targetMessage,
        'buffer',
        {},
        {
          logger: undefined,
          reuploadRequest: sock.updateMediaMessage,
        }
      );

      let finalBuffer = buffer;

      // convert
      if (
        quotedMsg.stickerMessage ||
        !media.mimetype?.includes('jpeg')
      ) {
        finalBuffer = await sharp(buffer)
          .jpeg({ quality: 90 })
          .toBuffer();
      }

      // path
      const imagePath = path.join(
        process.cwd(),
        'assets',
        'menu.jpg'
      );

      // save
      fs.writeFileSync(imagePath, finalBuffer);

      // success
      await sock.sendMessage(
        chatId,
        {
          text: '✅ Menu image updated successfully!'
        },
        { quoted: message }
      );

    } catch (err) {
      console.log(err);

      await sock.sendMessage(
        message.key.remoteJid,
        {
          text: `❌ Error: ${err.message}`
        },
        { quoted: message }
      );
    }
  },
};
