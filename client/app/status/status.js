angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};
  $http.get('/user')
    .success((user) => {
      $scope.user = user;
      $scope.user.style = 'width:' + $scope.user.grade + '%;';
    })
    .error((err) => console.error(err));

});
