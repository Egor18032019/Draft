const fetch = require('node-fetch');
const fs = require('fs');

const URL = {
  POST: `https://sheets.googleapis.com/v4/spreadsheets/AIzaSyACvURZ36YS0q1lcePVxO13mLWuu02uq6g/values:batchUpdate`,
  // POST: `https://script.google.com/macros/s/AKfycby_hcQQ99DAAm1y7E8pZyKHc_OBu0spx94LPorq3m60qhrdPtcR/exec`,
  GET801: `https://script.google.com/macros/s/AKfycby_hcQQ99DAAm1y7E8pZyKHc_OBu0spx94LPorq3m60qhrdPtcR/exec`,
  GET901: `https://script.google.com/macros/s/AKfycbxlU4-ran0HBA9kFVPT0uh_xxZgHJU2PipOHWVZhcEJEJThaZuK/exec`
};

// картинки для бота лежащие на Yandex Object Sнtorage; опционально
const PICTURE = {
  PLAN8: "https://storage.yandexcloud.net/img-bot-bucket/tg-bot-img/Ekaterinburg_8floor.jpg",
  PLAN9: 'https://storage.yandexcloud.net/img-bot-bucket/tg-bot-img/Ekaterinburg_9floor.jpg',
  BILBO: 'https://storage.yandexcloud.net/img-bot-bucket/tg-bot-img/1603267171549.jpg',
  EKB: 'https://storage.yandexcloud.net/img-bot-bucket/tg-bot-img/mapEkb.jpg',
}

const AUDIO = [
  "https://storage.yandexcloud.net/img-bot-bucket/tg-bot-audio/Defend Castle.mp3",
  "https://storage.yandexcloud.net/img-bot-bucket/tg-bot-audio/Win Battle.mp3",
  "https://storage.yandexcloud.net/img-bot-bucket/tg-bot-audio/LoseCombat.mp3",
  "https://storage.yandexcloud.net/img-bot-bucket/tg-bot-audio/Surrender Battle.mp3",
]

const randArr = (arr) => {
  const rand = Math.floor(Math.random() * arr.length);
  return arr[rand]
}
// конфиг вызовов от пользователя
const inline_keyboard = [
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
      departmens: nextArray[3],
      otdel: nextArray[4],
      gender: nextArray[5],
      coordinateX: nextArray[6],
      coordinateY: nextArray[7],
      avatar: nextArray[8],
      timein: nextArray[9],
      timeout: nextArray[10],
      description: nextArray[11],
      photo: nextArray[12],
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

const {
  random,
  includes
} = require('lodash');
// Определение функции поиска ключевых слов во фразе юзера:
function getTrigger(str) {
  const triggerWords = ['дурак', 'дура', 'тупой', 'умри', 'глупый', 'глуп', `дурой`];
  for (let item of triggerWords) {
    if (includes(str, item.toLowerCase())) {
      return true;
    }
  }
  return false;
}

// API "умных мыслей":
const api = `http://api.forismatic.com/api/1.0/?method=getQuote&format=json&key=${random(1, 999999)}&lang=ru`;
// Страница для донатов (опционально):
const donateUrl = 'https://sobe.ru/na/vkusnyawka_dlya_bilbowki';
// Сылка на Екатеринбург на Яндекс картах
const pageEkbUrl = 'https://yandex.ru/maps/geo/yekaterinburg/53166537/?ll=60.601571%2C56.788751&source=wizgeo&utm_medium=maps-desktop&utm_source=serp&z=10';

// Определение функции получения данных c гугл таблицы:
async function getData(url) {
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
/**
 * Определение функции получения данных с гугл таб и возврат длины массива
 * @param {string} url адрес где брать
 * @returns {number} кол-во р.м.
 */
const sendQuantity = async (url) => {
  let arrSpace = await getData(url)
  return arrSpace.length;
}
/**
 * Определение функции получения данных и возврат отформатированной цитаты:
 * @param {string} url
 * @returns {string} цитата
 */
const sendQuote = async (url) => {
  try {
    const data = await fetch(url);
    const json = await data.json();
    const quote = json.quoteText;
    const author = json.quoteAuthor.length === 0 ? 'Автор не известен' : json.quoteAuthor;
    return `<b>${quote}</b>\n\u2014 <i>${author}</i>`;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Мысль потеряна! Попробуй ещё раз.';
  }
}

/**
 * Определение функции получения данных и возврат отфильтрованных данных:
 * @param {string} url
 * @param {string} filter
 * @returns {number} номер рабочего места(в строке вернет или числом ?)
 */
const forTitleFilter = async (url, filter) => {
  let arrSpace = await getData(url)
  console.log(`arrSpace ` + JSON.stringify(arrSpace))
  return arrSpace.filter((place) => {
    console.log(`place ` + JSON.stringify(place))
    return place.titlle.toLowerCase() === filter;
  });
};
// Яндекс-функция:
module.exports.bot = async (event) => {
  const body = JSON.parse(event.body);
  // обьявляем переиспользуемы переменные
  let first_name;
  let botMsg;
  let photoUrl;
  let redirectUrl;
  let inlineKeyText;
  let isPhoto = false;
  let isAudio = false;
  let msg = {};
  let audioUrl;

  // если приходит с инлайн клавиатуры
  if (body.callback_query) {
    console.log("=====================plan8========================")
    const queryMsg = body.callback_query.data
    first_name = body.callback_query.from.first_name; // имя того кто пришёл
    if (queryMsg === 'plan8') {
      console.log(body.callback_query.from + " - body.callback_query..from")
      first_name = body.callback_query.from.first_name; // имя того кто пришёл
      isPhoto = true;
      inlineKeyText = 'План 8 этажа';
      photoUrl = PICTURE.PLAN8;
      redirectUrl = pageEkbUrl;
    }
    if (queryMsg === 'plan9') {
      isPhoto = true;
      inlineKeyText = 'План 9 этажа';
      photoUrl = PICTURE.PLAN9;
      redirectUrl = pageEkbUrl;
    }
    if (queryMsg === '8floor') {
      isPhoto = false;
      let url = URL.GET801;
      botMsg = await sendQuantity(url) + ` р.м. занято`;
      redirectUrl = pageEkbUrl
    }
    if (queryMsg === '9floor') {
      isPhoto = false;
      let url = URL.GET901;
      botMsg = await sendQuantity(url) + ` р.м. занято`;
      redirectUrl = pageEkbUrl
    }
    if (queryMsg === 'textB') {
      isPhoto = true;
      inlineKeyText = 'Гуляет он. ' + first_name + ` дашь вкусняшку ? `;
      photoUrl = PICTURE.BILBO;
      redirectUrl = donateUrl
    }
    if (queryMsg === 'musik') {
      isAudio = true;
      inlineKeyText = 'Еще музыки ?';
      audioUrl = randArr(AUDIO);
    }

    if (isPhoto) {
      msg = {
        'method': 'sendPhoto',
        'photo': photoUrl,
        'chat_id': body.callback_query.from.id,
        'reply_markup': JSON.stringify({
          inline_keyboard: [
            [{
              text: inlineKeyText,
              url: redirectUrl
            }]
          ]
        })
      };
    } else if (isAudio) {
      msg = {
        'method': 'sendAudio',
        'chat_id': body.callback_query.from.id,
        'audio': audioUrl,
        'reply_markup': JSON.stringify({
          keyboard: [
            [{
              text: 'Еще музыки ?'
            }]
          ]
        })
      };
    } else {
      // Шлём текстовое сообщение:
      msg = {
        'method': 'sendMessage',
        'parse_mode': 'HTML',
        'chat_id': body.callback_query.from.id,
        'text': botMsg,
        // Устанавливаем кнопки для быстрого ввода:
        'reply_markup': JSON.stringify({
          keyboard: [
            [{
              text: 'Умная мысль'
            }],
            [{
              text: 'Кинуть монетку'
            }]
          ]
        })
      };
    }
  }
  // обычным способом
  if (body.message) {
    console.log(`---body.message---` + JSON.stringify(body.message.text))
    first_name = body.message.from.first_name;
    const text = body.message.text;
    const userMsg = text.toLowerCase();
    if (getTrigger(userMsg)) {
      botMsg = first_name + ', не ругайся, а то обижусь!'
    } else if (userMsg === '/start') {
      botMsg = 'Приветик, ' + first_name + '!';
    } else if (userMsg === '/help') {
      botMsg = 'Нажими на кнопку и получишь ответ. Если нужнно знать номер рабочего места сотрудника набери "Поиск {номер этажа} {ИмяФамилия}".Если нужна умная мысль - жми на кнопку "Умная мысль", и получи их бесплатно.';
    } else if (~userMsg.indexOf(`клавиатуру`)) { //или ~ или includes
      botMsg = 'Клавиатура закрыта ';
    } else if (userMsg.includes(`поиск 8 `)) { //или ~ или includes
      let index = userMsg.slice(8)
      const url = URL.GET801
      const arrayWorkedSpace9 = await forTitleFilter(url, index)
      // выдавать первое найденое совпадение или все ?
      // а если будут совпадения ? маловероятно но...
      console.log(arrayWorkedSpace9.length)
      if (arrayWorkedSpace9.length > 0) {
        botMsg = `Рабочее место №` + arrayWorkedSpace9[0].id + ` на 9 этаже`;
      } else {
        botMsg = `Не можем найти сотрудника`;
      }
    } else if (userMsg.includes(`поиск 9 `)) { //или ~ или includes
      let index = userMsg.slice(8)
      const url = URL.GET901
      const arrayWorkedSpace9 = await forTitleFilter(url, index)
      // выдавать первое найденое совпадение или все ?
      // а если будут совпадения ? маловероятно но...
      console.log(arrayWorkedSpace9.length)
      if (arrayWorkedSpace9.length > 0) {
        botMsg = arrayWorkedSpace9[0].id + ` р.м на 9 этаже`;
      } else {
        botMsg = `Не смог найти сотрудника на 9 этаже`;
      }
    } else if (userMsg === 'умная мысль') { //или ~ или includes
      botMsg = await sendQuote(api);
    } else if (userMsg === 'кинуть монетку') {
      console.log("----кинуть монетку-------")
      isPhoto = true;
      inlineKeyText = 'На вкусняшку для Бильбошки !';
      photoUrl = PICTURE.BILBO;
      redirectUrl = donateUrl;
    } else {
      botMsg = 'Давай не будем отвлекаться.Сосредоточься !';
    }
    if (isPhoto) {
      msg = {
        'method': 'sendPhoto',
        'photo': photoUrl,
        'chat_id': body.message.chat.id,
        'reply_markup': JSON.stringify({
          inline_keyboard: [
            [{
              text: inlineKeyText,
              url: redirectUrl
            }]
          ]
        })
      };
    } else if (userMsg === '/start') {
      msg = {
        'method': 'sendMessage',
        'parse_mode': 'HTML',
        'chat_id': body.message.chat.id,
        'text': botMsg,
        // Устанавливаем кнопки для быстрого ввода:
        'reply_markup': JSON.stringify({
          inline_keyboard: inline_keyboard,
        })
      };
    } else if (userMsg.includes(`клавиатуру`)) {
      msg = {
        'method': 'sendMessage',
        'parse_mode': 'HTML',
        'chat_id': body.message.chat.id,
        'text': botMsg,
        // Устанавливаем кнопки для быстрого ввода:
        'reply_markup': JSON.stringify({
          remove_keyboard: true
        })
      };
    } else {
      // Шлём текстовое сообщение:
      msg = {
        'method': 'sendMessage',
        'parse_mode': 'HTML',
        'chat_id': body.message.chat.id,
        'text': botMsg,
        // Устанавливаем кнопки для быстрого ввода:
        'reply_markup': JSON.stringify({
          keyboard: [
            [{
              text: 'Умная мысль'
            }],
            [{
              text: 'Закрыть клавиатуру'
            }],
            [{
              text: 'Кинуть монетку'
            }]
          ]
        })
      };
    }
  }
  console.log(`---msg---` + JSON.stringify(msg))

  // Возвращаем результат в Telegram:
  return {
    'statusCode': 200,
    'headers': {
      'Content-Type': 'application/json; charset=utf-8'
    },
    'body': JSON.stringify(msg),
    'isBase64Encoded': false
  };
};
