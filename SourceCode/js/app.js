angular.module('myApp', [])
    .controller('ViewCtr', function ($scope, $http) {
        $scope.getPharmacy = function () {
			// Getting values from view using ng model
            var latitude = $scope.lat
            var longitude =$scope.lon
            var dataParams = latitude.toString() + "," + longitude.toString();
            if (latitude != null && latitude !=""  && longitude != null && longitude != "") {
					// Calling API
                    $http.get('http://127.0.0.1:5000/getData?dataParams='+dataParams).then(function(result)
                        {
							// Sending result from API to view using {}
							var outputdata = result.data;
                            $scope.Name = outputdata["Name"];
                            $scope.Address = outputdata["Address"];
                            $scope.Distance = outputdata["Distance"];
                        },function(err)
                        {
							alert("Server failed");
                            console.log(err);
                        })
            }
        }
    });
