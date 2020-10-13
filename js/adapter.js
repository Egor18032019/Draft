(function () {

  var loadingTeg = document.querySelector('.text-here');

  var adapter = function (data) {
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

      console.log(`nextArray: `, nextArray)

      result.push(adapterArray)

    }
    loadingTeg.innerHTML = result
    console.log(`result: `, result)
    return result;
  }

  window.adapter = {
    adapter: adapter,
  };
})();
