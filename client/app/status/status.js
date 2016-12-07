angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};
  
  $http.get('/status')
    .success(function(data) {
      $scope.user = data[0];
      console.log('this is supposed to be $scope.user from status.js ', $scope.user); 
    })
    .error(function(data) {
      console.log('Error: ' + data)
    })
}); 
