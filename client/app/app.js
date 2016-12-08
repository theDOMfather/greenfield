angular.module('app', [
	'app.service',
	'app.goal',
	'app.status',
	'ngRoute',	
	])

.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl:"app/goal/goal.html" 
	})
	.when('/goal', {
		templateUrl:"app/goal/goal.html",
		controller:"goalController"
	})
	.when('/status', {
		templateUrl:"app/status/status.html",
		controller:"statusController"
	})
	.otherwise({
		redirectTo: '/'
	});

});



