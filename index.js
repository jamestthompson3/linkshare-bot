const { json } = require("micro");
const axios = require("axios");
require("dotenv").config();

const TELEGRAM_URL = `https://api.telegram.org/bot${
  process.env.TELEGRAM_KEY
}/sendMessage`;

module.exports = async (req, res) => {
  const body = await json(req);
  const { message } = body;
  console.log(body);
  const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

  if (!message || !urlRegex.test(message.text)) {
    return res.end();
  }

  axios
    .post(TELEGRAM_URL, {
      chat_id: message.chat.id,
      text: message.text
    })
    .then(() => res.end("ok"))
    .catch(err => res.end(`Error: ${err}`));
};
