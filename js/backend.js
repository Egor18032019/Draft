'use strict';
// Получение  данных

(function () {

  var URL = {
    POST: 'https://script.google.com/macros/s/AKfycby_hcQQ99DAAm1y7E8pZyKHc_OBu0spx94LPorq3m60qhrdPtcR/exec',
    GET: 'https://script.google.com/macros/s/AKfycby_hcQQ99DAAm1y7E8pZyKHc_OBu0spx94LPorq3m60qhrdPtcR/exec'
    //  GET: 'https://script.google.com/macros/s/AKfycby_hcQQ99DAAm1y7E8pZyKHc_OBu0spx94LPorq3m60qhrdPtcR/exec'
  };

  var TIMEOUT_IN_MS = 10000;
  /**
   * коды ошибок
   */
  var StatusCode = {
    OK: 200
  };

  var sendRequest = function (onLoad, onError) {
    /**
     * new XMLHttpRequest();
     */
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('При получение произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    return xhr;
  };

  var save = function (data, onLoad, onError) {
    var xhr = sendRequest(onLoad, onError);

    xhr.open('POST', URL.POST);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    var xhr = sendRequest(onLoad, onError);

    xhr.open('GET', URL.GET);
    xhr.send();
  };

  var onLoadData = function (data) {
    window.adapter.adapter(data)
  };
  var onSaveData = function () {
    console.log(`data`)
  };
  var onError = function (errorMessage) {
    console.log(errorMessage)

  }

  var onLoadForm = () => {
    load(onLoadData, onError);
  }

 var updateSheet = (dsd)=>{
   console.log(dsd)

  console.log(`dsdsdsdsdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)
}

  var onSaveForm = () => {
    console.log(`data`)
    updateSheet(`dsdasdasds`);
  }
  var loadingButton = document.querySelector('.load-open');
  loadingButton.addEventListener('click', onLoadForm);
  var saveButton = document.querySelector('.save-open');
  saveButton.addEventListener('click', onSaveForm);
  window.backend = {
    load: load,
    save: save,
    updateSheet: updateSheet,

  };
})();


