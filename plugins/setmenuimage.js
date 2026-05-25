import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  command: 'setmenuimage',
  aliases: ['setmenuimg', 'changemenuimage'],
  category: 'owner',
  description: 'Set bot menu image',
  usage: '.setmenuimage',

  async handler(sock, message, args, context) {
    try {
      const { chatId, sendMessage } = context;

      const quoted =
        message.message?.extendedTextMessage?.contextInfo;

      if (!quoted?.quotedMessage) {
        return await sendMessage(
          chatId,
          {
            text: '📷 Reply to an image or sticker'
          },
          { quoted: message }
        );
      }

      const quotedMsg = quoted.quotedMessage;

      const media =
        quotedMsg.imageMessage ||
        quotedMsg.stickerMessage;

      if (!media) {
        return await sendMessage(
          chatId,
          {
            text: '❌ Reply must contain image/sticker'
          },
          { quoted: message }
        );
      }

      const targetMessage = {
        key: {
          remoteJid: chatId,
          id: quoted.stanzaId,
          participant: quoted.participant,
        },
        message: quotedMsg,
      };

      const buffer = await downloadMediaMessage(
        targetMessage,
        'buffer',
        {},
        {
          logger: undefined,
          reuploadRequest: sock.updateMediaMessage,
        }
      );

      if (!buffer) {
        return await sendMessage(
          chatId,
          {
            text: '❌ Failed to download media'
          },
          { quoted: message }
        );
      }

      let finalBuffer = buffer;

      // convert sticker/webp/png to jpg
      if (
        quotedMsg.stickerMessage ||
        !media.mimetype?.includes('jpeg')
      ) {
        finalBuffer = await sharp(buffer)
          .jpeg({ quality: 90 })
          .toBuffer();
      }

      // save image
      const imagePath = path.join(
        process.cwd(),
        'assets',
        'menu.jpg'
      );

      fs.writeFileSync(imagePath, finalBuffer);

      await sendMessage(
        chatId,
        {
          text: '✅ Menu image updated successfully!'
        },
        { quoted: message }
      );

    } catch (err) {
      console.log(err);

      await context.sendMessage(
        context.chatId,
        {
          text: `❌ Error: ${err.message}`
        },
        { quoted: message }
      );
    }
  },
};
