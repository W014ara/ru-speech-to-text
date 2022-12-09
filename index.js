const TelegramBot = require('node-telegram-bot-api');
const constants = require('./config');
const { createFile, translateMessage } = require('./helper');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(constants.TG_TOKEN, {polling: true});

bot.on('voice', (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Сообщение получил, перевожу текст из-зо всех сил...');

    bot.getFile(msg.voice.file_id).then(async (file) => {
        await createFile(file);
        translateMessage(bot, chatId);
    });
});

bot.on('location', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Широта: ${msg.location.latitude} и долгота: ${msg.location.longitude}`);
});
