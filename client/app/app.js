angular.module('app', [
	'app.service',
	'app.goal',
	'app.status',
	'ngRoute'
	])

.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl:"login/index.html"
	})
	.when('/create', {
		templateUrl:"app/create/create.html",
		controller:"createController"
	})
	.when('/status', {
		templateUrl:"app/status/status.html",
		controller:"statusController"
	})
	.otherwise({
		redirectTo: '/'
	});

});
