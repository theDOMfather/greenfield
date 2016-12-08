angular.module("app.goal", [])

.controller("goalController", function($scope, goalFactory) {
  $scope.user = {}; // this clear the previous time


  $scope.addUser = function() {
    console.log("hello from inside add user");
    goalFactory.add($scope.user) //all user inputs

    .then(function(data) {
      // $scope.data= data;
    });
  };
});
