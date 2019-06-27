const { json } = require("micro");
const axios = require("axios");
require("dotenv").config();

const TELEGRAM_URL = `https://api.telegram.org/bot${
  process.env.TELEGRAM_KEY
}/sendMessage`;

function postToBot(res, data) {
  axios
    .post(TELEGRAM_URL, data)
    .then(() => res.end("ok"))
    .catch(err => res.end(`Error in Sending to Telegram: ${err}`));
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
      const data = {
        chat_id: message.chat.id,
        text: message.chat.id
      };

      return postToBot(res, data);
    }
  }

  const [url, description] = message.text.split("\n");

  if (!urlRegex.test(url)) {
    return res.end();
  }

  const data = {
    chat_id: message.chat.id,
    text: message.text
  };
  postToBot(res, data);
};
