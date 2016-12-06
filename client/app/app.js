angular.module('app', [
	'app.service',
	'app.goal',
	'ngRoute'
	])

.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl:"app/goal/goal.html",
		controller:"goalController"
	})
	.otherwise({
		redirectTo: '/'
	});

});



