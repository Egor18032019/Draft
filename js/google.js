var ss = SpreadsheetApp.getActiveSpreadsheet(), //Возвращает текущую активную электронную таблицу или null, если ее нет.
  s = ss.getActiveSheet(); //возвращает активный лист в электронной таблице.

function getData() {
  var result = [];
  var range = 'A:E';
  var values = s.getRange(range).getValues(); // getRange - Возвращает диапазон привязки.
  var last_row = parseInt(s.getLastRow()); // взяли с со строк
  var last_col = parseInt(s.getLastColumn()); // взял с колонок

  for (var i = 1; i < last_row; i++) {
    result.push(values[i,i]+values[i,+1]);
  }
  return result;
}


function doGet() {
  var data = getData();
  if (!data) {
    data = '';
  }
  return ContentService.createTextOutput(
    JSON.stringify({
      'result': data
    })).setMimeType(ContentService.MimeType.JSON);
}
