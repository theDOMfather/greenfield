angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};
  $http.get('/user')
    .success((user) => {
      $scope.user = user;
      $scope.responses = user.responses;
      $scope.progBarStyle = 'width:' + $scope.user.grade + '%;';
      if (user.grade > 70) {
        $scope.progBarClass = 'progress-bar progress-bar-success active';
      } else if (user.grade > 40) {
        $scope.progBarClass = 'progress-bar progress-bar-warning active';
      } else {
        $scope.progBarClass = 'progress-bar progress-bar-danger active';
      }
    })
    .error((err) => console.error(err));

});
