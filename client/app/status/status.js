angular.module("app.status", [])

.controller("goalController", function($scope, goalFactory) {
  

   $scope.addUser = function() {
    goalFactory.add($scope.newUser)
    .then(function(data) {
      console.log(data);
      $scope.data= data; 
    });
  };
}); 
