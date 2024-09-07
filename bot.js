const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// Load the JSON data
const data = JSON.parse(fs.readFileSync("menuData.json", "utf8"));

// Replace YOUR_BOT_TOKEN with the token you received from BotFather
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const foodOptions = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቁርስ /Breakfast", callback_data: "breakfast" }],
        [{ text: "ምሳ እና እራት /Main Dish", callback_data: "main_dish" }],
        [{ text: "ጣፋጭ /Sweets & Desserts", callback_data: "sweets" }],
        [{ text: "የሚጠጣ /Drinks", callback_data: "drinks" }],
        [{ text: "ትኩስ ነገር /Hot Drinks", callback_data: "hot_drinks" }],
        [{ text: "ጁስ /Juice", callback_data: "juice" }],
        [{ text: "ፋስት ፍድ /Fast Food", callback_data: "fast_food" }],
        [{ text: "ጭማሪ /Side Dish & Extra", callback_data: "side_dish" }],
        [{ text: "Kitfo & Tibs", callback_data: "kitfo_tibs" }],
      ],
    },
  };

  bot.sendMessage(chatId, "እንኳን ደህና መጡ ፣ ምን መመገብ ይፈልጋሉ?", foodOptions);
});

// Handle food type selection
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const foodType = callbackQuery.data;

  const restaurants = data.categories[foodType];

  if (!restaurants) {
    bot.sendMessage(chatId, "No restaurants available for this category.");
    return;
  }

  const restaurantOptions = {
    reply_markup: {
      inline_keyboard: restaurants.map((restaurant) => [
        {
          text: restaurant.restaurant_name,
          callback_data: `restaurant_${restaurant.restaurant_id}_${foodType}`,
        },
      ]),
    },
  };

  bot.sendMessage(
    chatId,
    `Here are restaurants offering ${foodType}:`,
    restaurantOptions
  );
});

// Handle restaurant selection and display the menu
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;

  const [_, restaurantId, foodType] = callbackQuery.data.split("_");
  const restaurant = data.categories[foodType].find(
    (rest) => rest.restaurant_id == restaurantId
  );

  if (!restaurant) {
    bot.sendMessage(chatId, "Restaurant not found.");
    return;
  }

  let menuMessage = `Menu for ${restaurant.restaurant_name}:\n\n`;
  restaurant.menu.forEach((item, index) => {
    menuMessage += `${index + 1}. ${item.name} - ${item.price}\n`;
  });

  bot.sendMessage(chatId, menuMessage);
});
