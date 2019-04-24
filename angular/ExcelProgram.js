let app = angular.module("ExcelModule",['angular-js-xlsx']);

app.service('parseDate', function() {
  this.default = function (date) {
        return Date.parse(date).toString("yyyy-MM-dd");
    }
  this.expression = function (date,expression) {
        return Date.parse(date).toString(expression);
    }
});

app.service("trim_all_indexes",function(parseDate){
    this.default = function(jsonData,date_keys)
    {
      let cleaned_jsondata = [];

        jsonData.forEach(function(element){
            let cleaned_object = {};
            for(let key in element)
            {
              if(date_keys.indexOf(key.trim())!= -1)
              {
                cleaned_object[key.trim()] = parseDate.default(element[key]);
              }
              else
              {
                cleaned_object[key.trim()] = element[key];
              }

            }
        cleaned_jsondata.push(cleaned_object);
          });

        return cleaned_jsondata;

    }


  });

app.controller('testController', function($scope,trim_all_indexes,$http) {
  $scope.read = function (workbook) {
    /* DO SOMETHING WITH workbook HERE */
    for (let sheetName in workbook.Sheets) {

      console.log(sheetName);

      let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      $scope.cleaned_jsondata = trim_all_indexes.default(jsonData,["FECHA"]);

      console.log($scope.cleaned_jsondata);

    }

    /*let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets["Hoja1"]);

    $scope.cleanedJsondata = trim_all_indexes.default(jsonData,["FECHA"]);

    console.log($scope.cleaned_jsondata); */

  }

  $scope.error = function (e) {
    /* DO SOMETHING WHEN ERROR IS THROWN */
    console.log(e);
  }

  $scope.test = "test app";

  $scope.sendDataToServer = () =>{

    let request = $http.post("http://localhost:8000/api/testExcel",{excelData:$scope.cleaned_jsondata,userId:1});

    request.then((response)=>{

      Swal.fire(
        'Good job!',
        'well done!',
        'success'
      )

      console.log(response);
    });

    response.catch((error)=>{

      Swal.fire(
        'Bad!',
        ':(',
        'error'
      )

       console.error(error);
    })
  }

});
