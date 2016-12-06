angular.module('app', [
	'app.service',
	'app.goal',
	'ngRoute'
	])

.config(function($routeProvider) {
	$routeProvider
	// .when('/buddy', {
	// 	templateUrl:"app/accountabilitybuddy/buddy.html",
	// 	controller:"buddyController"
	// })
	.when('/goal', {
		templateUrl:"app/goal/goal.html",
		controller:"goalController"
	})
	.otherwise({
		redirectTo: '/'
	});

});



