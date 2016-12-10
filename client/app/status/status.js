angular.module("app.status", [])

.controller("statusController", function($scope, $http) {
  $scope.user = {};
  $http.get('/user')
    .success((user) => {
      $scope.user = user;

      $scope.responses = user.responses.map((tuple) => {
        if (tuple) {
          tuple[0] = moment(tuple[0]).fromNow();
          if (tuple[1] === '1') {
            tuple[1] = 'you didn\'t suck';
          } else if (tuple[1] === '2') {
            tuple[1] = 'you blew it';
          }
        }
        return tuple;
      }).reverse();

      $scope.progBarStyle = 'width:' + $scope.user.grade + '%;';
      if (user.grade > 70) {
        $scope.progBarClass = 'progress-bar progress-bar-success active';
        $scope.image = 'assets/strippercorn.png';
        $scope.message = 'This unicorn stripper is here to tell you what a great job you\'re doing!';
      } else if (user.grade > 40) {
        $scope.progBarClass = 'progress-bar progress-bar-warning active';
        $scope.image = 'assets/stickfigure.png';
        $scope.message = 'This shitty stick figure as an indication of how average we find your performance so far.';
      } else {
        $scope.progBarClass = 'progress-bar progress-bar-danger active';
        $scope.image = 'assets/brony.png';
        $scope.message = 'Rainbow dash is incredibly dissappointed in your performance. Get your shit together...';
      }
    });
    $scope.user.responses = $scope.user.responses.map(function(item){
    		return [moment(item[0]).format('YYY/MM/DD'), item[1]];
    })  
    .error((err) => console.error(err))

});
