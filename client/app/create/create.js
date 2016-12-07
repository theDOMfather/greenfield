angular.module("app.goal", [])

.controller("createController", function($scope, createFactory) {
	$scope.user = {}; // this clear the previous time

  $scope.addUser = function() {
   	goalFactory.add($scope.user) //all user inputs

   	.then(function(data) {
   		console.log(data);
   		// $scope.data= data;
   	});
  };
});
