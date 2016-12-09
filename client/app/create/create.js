angular.module("app.goal", [])

.controller("createController", function($scope, $http, $location, createFactory) {
	$scope.user = {};
  $http.get('/user')
    .success((user) => $scope.user = user)
    .error((err) => console.error(err));

  $scope.addUser = function() {
    createFactory.add($scope.user)
      .then(() => $location.path('/status'));
  };
});
