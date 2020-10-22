const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const fs = require('fs');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'secret token';

// Create a bot that uses 'polling' to fetch new updates
// Создаем бота, который использует 'опрос' для получения новых обновлений
const bot = new TelegramBot(token, {
  polling: true
});
bot.on("polling_error", (msg) => console.log(msg));
const idAdmin = 592775497;
// получить информацию о боте и вывести в консоль
bot.getMe().then(function (me) {
  console.log('Имя этого бота %s!', me.username);
});

// Соответствует '/\[что угодно]/'
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' - это полученное сообщение от Telegram
  // 'match' - это результат выполнения указанного выше регулярного выражения для текстового содержимого
  // сообщения

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  // отправляем обратно в чат найденное 'что угодно'
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg, match) => {
  console.log(msg)
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Приветик, ' + msg.chat.first_name + '!');
  openKlava(chatId);
});

// открываем нижнию клавиатуру
const openKlava = (chatId) => {
  bot.sendMessage(chatId, 'Клавиатура открыта', {
    reply_markup: {
      keyboard: [
        [{
            text: 'Да'
          },
          {
            text: 'Нет'
          }, {
            text: 'Закрыть'
          }
        ],
        [{
          text: 'Заказать разработку бота',
          request_contact: true
        }],
        [{
          text: 'Про автора'
        }]
      ],
      one_time_keyboard: false
    }
  })
}

// конфиг вызовов от пользователя
const keyboard = [
  [{
    // text: `План 8 этажа ${emoji.get('ru')}`,
    text: `План 8 этажа`,
    callback_data: 'plan8' // данные для обработчика событий
  }, {
    text: 'План 9 этажа', // текст на кнопке
    callback_data: 'plan9' // данные для обработчика событий
  }],
  [{
    text: 'Как дела у Бильбо ?',
    callback_data: 'textB'
  }],
  [{
      text: 'кол-во занятых рабочих мест на 8 этаже',
      callback_data: '8floor'
    },
    {
      text: 'кол-во занятых р.м. на 9 этаже',
      callback_data: '9floor'
    }
  ],
  [{
    text: 'Музыка',
    callback_data: 'musik'
  }],
  [{
    text: 'Написать мне',
    url: 'https://t.me/EgorPrishedko' //внешняя ссылка
  }]
];

const sendMusik = (chatId, first_name) => {
  fs.readdir('./musik/', function (err, files) {
    const rf = files[Math.floor(Math.random() * files.length)];
    bot.sendMessage(chatId, '' + first_name + ', лови класику!');
    bot.sendAudio(chatId, './musik/' + rf).then(() => {
      bot.sendMessage(chatId, 'И слушай!');
    });
  })
}
const sendText = (chatId, first_name) => {
  bot.sendMessage(chatId, 'Спит Бильбошный. ' + first_name + ` небуди его!`);
}

async function onLoadForm(url) {
  try {
      const data = await fetch(url);
      const json = await data.json();
      const answer = adapter(json);
      return answer;
    } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Мысль потеряна! Попробуй ещё раз.';
  }
}


const sendFloor = async (chatId, url) => {
  let arrSpace = await onLoadForm(url)
  bot.sendMessage(chatId, arrSpace.length + ` рм занято`);
}

const forTitleFilter = (places, filter) => {
  return places.filter((place) => {
    return place.titlle.toLowerCase() === filter;
  });
};


// Listen for any kind of message. There are different kinds of messages.
bot.on('message',
  (msg) => {
    const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
    const first_name = msg.chat.first_name; // имя того кто пришёл
    // console.log(msg)
    if (msg.text) {
      const text = msg.text.toLowerCase();
      if (~text.indexOf("start")) { // ~ писать обязательно
        bot.sendMessage(chatId, 'Привет, Босс! Чего хочешь?', {
          reply_markup: { // прикручиваем список возможных вызовов
            inline_keyboard: keyboard
          }
        })
      } else if (~text.indexOf("закрыть")) {
        bot.sendMessage(chatId, 'Клавиатура закрыта', {
          reply_markup: {
            remove_keyboard: true
          }
        })
      } else if (~text.indexOf("дур")) {
        bot.sendMessage(chatId, '' + first_name + ', не ругайся, а то обижусь!');
      } else if (~text.indexOf("туп")) {
        bot.sendMessage(chatId, '' + first_name + ', не ругайся, а то обижусь!');
      } else if (~text.indexOf("музык")) {
        sendMusik(chatId, first_name);
      } else if (~text.indexOf("бильбо")) {
        bot.sendMessage(chatId, `Гав гав !`);
      } else if (~text.indexOf("поиск")) {
        let index = text.slice(6)
        const arrayWorkedSpace8 = forTitleFilter(floor8, index)
        const arrayWorkedSpace9 = forTitleFilter(floor9, index)
        // выдавать первое найденое совпадение или все ?
        if (arrayWorkedSpace8.length > 0) {
          bot.sendMessage(chatId, `Рабочее место №` + arrayWorkedSpace8[0].id + ` на 8 этаже`);
        } else if (arrayWorkedSpace9.length > 0) {
          bot.sendMessage(chatId, `Рабочее место №` + arrayWorkedSpace9[0].id + ` на 9 этаже`);
        } else {
          bot.sendMessage(chatId, `Не можем найти сотрудника`);
        }
      } else {
        bot.sendMessage(chatId, '' + first_name + ', я тебя не понимать!');
      }
      // console.log(msg)
    }
  })

bot.on('sticker', (msg) => { //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер

  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'картинками не питаюсь', {});
})
// обработчик событий нажатий на клавиатуру
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const first_name = query.message.chat.first_name; // имя польователя

  let img = '';

  if (query.data === 'plan8') {
    img = PICTURE.PLAN8;
  }
  if (query.data === 'plan9') {
    img = PICTURE.PLAN9;
  }
  if (query.data === 'musik') {
    sendMusik(chatId, first_name);
  }
  if (query.data === 'textB') {
    sendText(chatId, first_name);
  }
  if (query.data === '8floor') {
    let url=URL.GET801;
    sendFloor(chatId, url);
  }
  if (query.data === '9floor') {
    let url=URL.GET901;
    sendFloor(chatId, url);
  }
// если img-есть то посылаем фото и открываем клавиатуру
  if (img) {
    bot.sendPhoto(chatId, img, { // прикрутим клаву
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  }
});
// // когда требуется не отправлять заново сообщения, а поправить уже существующее
// // text — измененный текст сообщения, opt — Дополнительные опции для запроса к telegram, такие как наличие клавиатуры, форматирование текста и другое.
// let text = `для примера`
// const opt = {
//   parse_mode: 'markdown',
//   disable_web_page_preview: false,
//   reply_markup: JSON.stringify({
//     inline_keyboard: [
//       [{
//           text: `Русский`,
//           callback_data: 'rus'
//         },
//         {
//           text: `English`,
//           callback_data: 'eng'
//         }
//       ]
//     ]
//   })
// }
// bot.editMessageText(text, opt)
// node js/main.js
// https://api.telegram.org/bot1253154776:AAGGzQ7BYnzNdYMtd-kqboQD0lkKyD2VhZ8/setWebHook?url=https://functions.yandexcloud.net/d4ejunv64v507n85ksr6
//------------------------ запросы
const URL = {
  POST: `https://sheets.googleapis.com/v4/spreadsheets/AIzaSyACvURZ36YS0q1lcePVxO13mLWuu02uq6g/values:batchUpdate`,
  // POST: `https://script.google.com/macros/s/AKfycby_hcQQ99DAAm1y7E8pZyKHc_OBu0spx94LPorq3m60qhrdPtcR/exec`,
  GET801: `https://script.google.com/macros/s/AKfycby_hcQQ99DAAm1y7E8pZyKHc_OBu0spx94LPorq3m60qhrdPtcR/exec`,
  GET901: `https://script.google.com/macros/s/AKfycbxlU4-ran0HBA9kFVPT0uh_xxZgHJU2PipOHWVZhcEJEJThaZuK/exec`
};

const PICTURE = {
  PLAN8: 'img/Ekaterinburg_8floor.jpg',
  PLAN9: 'img/Ekaterinburg_9floor.jpg',
}

  const adapter = function (data) {
    var result = []
    var dataArray = data.result
    console.log(`dataArray.length: `, dataArray.length)
    for (var i = 0; i < dataArray.length; i++) {
      var nextArray = dataArray[i]
           var adapterArray = {
            id: nextArray[0],
            titlle: nextArray[1],
            company: nextArray[2],
            departmens:nextArray[3],
            otdel: nextArray[4],
            gender: nextArray[5],
            coordinateX: nextArray[6],
            coordinateY: nextArray[7],
            avatar: nextArray[8],
            timein:nextArray[9],
            timeout: nextArray[10],
            description: nextArray[11],
            photo:nextArray[12],
            notebook: nextArray[13],
            apllebook: nextArray[14],
            sistemnik: nextArray[15],
            telephone: nextArray[16],
      }

      result.push(adapterArray)

    }
    console.log(`result: `, result.length)
    return result;
  }

// ----------------------------------------------------моки
const floor8 = `floor8`


const floor9 = `floor9`
