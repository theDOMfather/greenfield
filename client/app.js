//module name can be changed depending on what we decide
angular.module('hassle', [
  'hassle.login', 
  'hassle.goal',
  'ngRoute'
  ])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/goal', {  //this path can be changed to something more appropriate
      templateUrl: 'client/goal.html',
      controller: 'goalController'
    })
    .otherwise({
      redirectTo:'/'
    });
});