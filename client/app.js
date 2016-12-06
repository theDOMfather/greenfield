angular.module('app', [
	'app.AddBuddy',
	'app.service',
	'app.alert',
	'app.account',
	'ngRoute'
	])
.config(function($routeProvider) {
	$routeProvider
	.when('/buddy', {
		templateUrl:"app/accountabilitybuddy/buddy.html",
		controller:"buddyController"
	})
	.when('/alert', {
		templateUrl:"app/alertTime/alert.html",
		controller:"alertController"

	})
	.when('/account', {
		templateUrl:"app/account/account.html",
		controller:"accountController"
	})
	.when('/goal', {
		templateUrl:"app/goal/goal.html"
		//controller:"accountController"
	})
	.otherwise({
		redirectTo: '/'
	});

});



