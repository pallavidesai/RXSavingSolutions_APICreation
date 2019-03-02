
'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [])
    .controller('ViewCtr', function ($scope, $http) {
        $scope.getPharmacy = function () {
            var latitude = $scope.lat
            var longitude =$scope.lon
            var dataParams = latitude.toString() + "," + longitude.toString();

            if (latitude != null && latitude != "") {
                    $http.get('http://127.0.0.1:5000/getData?dataParams='+dataParams).then(function(result)
                        {
                            var outputdata=result.data;
                            console.log("the length of the data is  :"+outputdata.length);
                            console.log("The values are:-"+JSON.stringify(outputdata) );
                            $scope.Name = outputdata["Name"];
                            $scope.Address = outputdata["Address"];
                            $scope.Distance = outputdata["Distance"];
                        },function(err)
                        {
                            alert("failed");
                            console.log(err);
                        })
            }
        }
    });
