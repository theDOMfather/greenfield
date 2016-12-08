angular.module("app.goal", [])

.controller("createController", function($scope, $http, $location) {
	$scope.user = {};
  $http.get('/user')
    .success((user) => {$scope.user = user; console.log(user)})
    .error((err) => console.error(err));

  $scope.addUser = function() {
    $http.post('/create', $scope.user)
      .success(() => $location.path('/status'))
      .error(() => $location.path('/'));
  };
});
