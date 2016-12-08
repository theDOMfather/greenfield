angular.module("app.goal", [])

.controller("goalController", function($scope, goalFactory) {
	 $scope.user = {}; // this clear the previous time
 
   $scope.addUser = function() {
   	//console.log($scope.user);
   	goalFactory.add($scope.user) //all user inputs
   	.then(function(data) {
   		console.log(data); // this data is from server, with user's{ all inout property} & status code.....
   		//$scope.data= data; 
   	});
  };
}); 

