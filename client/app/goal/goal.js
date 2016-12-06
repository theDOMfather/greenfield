angular.module("app.goal", [])

.controller("goalController", function($scope, goalFactory) {
	 $scope.user = {}; // this clear the previous time


   $scope.addUser = function() {
   	goalFactory.add($scope.user) //all user inputs

   	.then(function(data) {
   		console.log(data);
   		// $scope.data= data; 
   	});
  };
}); 

