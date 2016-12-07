angular.module('app', [
	'app.service',
	'app.goal',
	'app.status',
	'ngRoute'
	])

.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl:"app/login.html"
	})
	.when('/create', {
		templateUrl:"app/goal/create.html",
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
