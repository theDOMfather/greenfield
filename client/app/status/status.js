angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};
  $http.get('/user')

    .success(function(user) {
    	$scope.user = user;
    	$scope.user.responses = $scope.user.responses.map(function(item){
    		return [moment(item[0]).format(), item[1]];
    	});
    });

});
