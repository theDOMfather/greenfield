angular.module("app.alert", [])

.controller("alertController", function($scope, alertFactory) {
	$scope.data = {};

	$scope.alert = function() {
		alertFactory.setAlert()
		.then(function() {
			$scope.data = data;
		});
	};

});