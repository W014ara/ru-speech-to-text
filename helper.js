const constants = require("./config");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {Deepgram} = require("@deepgram/sdk");

const filePath = path.resolve(__dirname, constants.VOICE_PATH, constants.VOICE_NAME);

const createFile = async function(file) {
    const url = `https://api.telegram.org/file/bot${constants.TG_TOKEN}/${file.file_path}`;

    const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream",
    });

    return response.data.pipe(fs.createWriteStream(filePath));
};

const translateMessage = function (bot, chatId) {
    const mimetype = constants.MIME_TYPE;
    const deepgram = new Deepgram(constants.DEEPGRAM_TOKEN);

    setTimeout(() => {deepgram.transcription.preRecorded(
        {buffer: fs.readFileSync(`${constants.VOICE_PATH}/${constants.VOICE_NAME}`), mimetype},
        {language: constants.DEEPGRAM_LANGUAGE},
    ).then((transcription) => {
        if (transcription) {
            console.log("Successfully message");

            const resultMessage = transcription.results.channels[0].alternatives[0].transcript;

            bot.sendMessage(chatId, `Переведенное сообщение: <i><b>${resultMessage}</b></i>`, {
                parse_mode: 'html'
            }).then(r => r);
        } else {
            console.log("Message is empty");
            bot.sendMessage(chatId, "Не могу перевести, попробуй еще раз").then(r => r);
        }
    }).catch((err) => {
        console.log("Error while translating message:", err);
        bot.sendMessage(chatId, "Не могу перевести, попробуй еще раз").then(r => r);
    })}, 500);
}


exports.createFile = createFile;
exports.translateMessage = translateMessage;
