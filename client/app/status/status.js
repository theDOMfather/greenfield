angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};
  $http.get('/user')
    .success((user) => {
      $scope.user = user;
      $scope.user.style = 'width:' + $scope.user.grade + '%;';
      if (user.grade > 70) {
        $scope.user.class = 'progress-bar progress-bar-success active';
      } else if (user.grade > 40) {
        $scope.user.class = 'progress-bar progress-bar-warning active';
      } else {
        $scope.user.class = 'progress-bar progress-bar-danger active';
      }
    })
    .error((err) => console.error(err));
    
});
