import axios from 'axios';
import 'dotenv/config';

const token = process.env.BOT_TOKEN;

const url = `https://api.telegram.org/bot${token}/getMe`;

const res = await axios.get(url);
console.log(res.data);
