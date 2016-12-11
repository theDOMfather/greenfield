angular.module("app.finish", [])

.controller("finishController", function($scope, $http, $location) {
  $scope.finishGoal = function() {
    $http.post('/finish')
      .success((user) => $location.path('/create'))
  };
});
