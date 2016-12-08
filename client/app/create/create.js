angular.module("app.goal", [])

.controller("createController", function($scope, $http, $location, createFactory) {
	$scope.user = {};
  $http.get('/user')
    .success((user) => {$scope.user = user; console.log(user)})
    .error((err) => console.error(err));

  $scope.addUser = function() {
    createFactory.add($scope.user);
    $location.path('/status');
  };
});
