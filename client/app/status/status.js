angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  // $scope.user = 
  
  $http.get('/status')
    .success(function(data) {
      $scope.todos = data;
      console.log('this is supposed to be data', data); 
    })
    .error(function(data) {
      console.log('Error: ' + data)
    })
    
 
}); 
