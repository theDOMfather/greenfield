angular.module("app.goal", [])

.controller("goalController", function($scope, goalFactory) {
  $scope.newUser = {};
  $scope.goalArea = $scope.newUser.goal;
  $scope.phoneArea = $scope.newUser.phoneNumber;
  $scope.buddynameArea = $scope.newUser.buddyname;
  $scope.buddyrelationArea = $scope.newUser.buddyRelation;
  $scope.buddyphoneArea = $scope.newUser.buddyPhone;
  $scope.alertArea = $scope.newUser.alertTime;

  $scope.addUser = function() {
    console.log($scope);
    goalFactory.add($scope.newUser)
      .then(function(data) {
        console.log(data);
        $scope.data = data;
      });
  };
});
