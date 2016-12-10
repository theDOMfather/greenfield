angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};
  $http.get('/user')
    .success((user) => {
      $scope.user = user;
      $scope.responses = user.responses.map((tuple) => {
        if (tuple[1] === '1') {
          tuple[1] = 'you didn\'t suck';
        } else if (tuple[1] === '2') {
          tuple[1] = 'you blew it';
        }
        return tuple;
      });
      $scope.progBarStyle = 'width:' + $scope.user.grade + '%;';
      if (user.grade > 70) {
        $scope.progBarClass = 'progress-bar progress-bar-success active';
      } else if (user.grade > 40) {
        $scope.progBarClass = 'progress-bar progress-bar-warning active';
      } else {
        $scope.progBarClass = 'progress-bar progress-bar-danger active';
      }
    });
    $scope.user.responses = $scope.user.responses.map(function(item){
    		return [moment(item[0]).format('YYY/MM/DD'), item[1]];
    })  
    .error((err) => console.error(err))

});
