angular.module("app.AddBuddy", [])

.controller("buddyController", function($scope, buddyFactory) {
	$scope.data = {};
	//$scope.textArea = ''; 

   $scope.add = function() {
   	buddyFactory.addBuddy({
         nameArea: $scope.nameArea,
         relationArea: $scope.relationArea,
         numberArea: $scope.numberArea,
         messageArea: $scope.messageArea,
   		timeArea: $scope.timeArea,
         submitArea: $scope.submitArea
   	})
   	.then(function(data) {
   		console.log(data);
   		$scope.data= data; 
   	});

  };
 
});