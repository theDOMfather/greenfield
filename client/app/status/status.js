angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};

  $http.get('/user')
    .success(function(user) {
      $scope.user = user;
      console.log('user.responses:  ',user.responses);
    })
    .error(function(data) {
      console.error(err);
    })
});
