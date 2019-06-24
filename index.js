const { json } = require("micro");
const axios = require("axios");
require("dotenv").config();

const TELEGRAM_URL = `https://api.telegram.org/bot${
  process.env.TELEGRAM_KEY
}/sendMessage`;

function postToBot(res, chatId, text) {
  axios
    .post(TELEGRAM_URL, {
      chat_id: chatId,
      text
    })
    .then(() => res.end("ok"))
    .catch(err => res.end(`Error: ${err}`));
}

module.exports = async (req, res) => {
  const body = await json(req);
  const { message } = body;
  const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  if (!message) {
    return res.end();
  }

  if (message.entities) {
    const command = message.entities.find(
      entity => entity.type === "bot_command"
    );
    if (command && message.text.includes("/id")) {
      return postToBot(res, message.chat.id, message.chat.id);
    }
  }

  const [url, description] = message.text.split("\n");

  if (!urlRegex.test(url)) {
    return res.end();
  }

  postToBot(res, message.chat.id, message.text);
};
