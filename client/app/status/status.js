angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};
  $http.get('/user')
    .success((user) => {$scope.user = user; console.log("this is from status.js", $scope.user)})
    .error((err) => console.error(err));

});
