angular.module('app.service', [])

.factory('goalFactory', function($http) {
  var add = function(data) {
    console.log("hello from inside factory.");
    return $http({
        method: 'POST',
        url: '/goal',
        data: JSON.stringify(data)
      })
      .then(function(data) {
        return data;
      });
  };
  return {
    add: add
  };
});
// .factory('buddyFactory', function($http) {
// 	var addBuddy = function (data){
// 		return $http({
// 			method: 'POST',
// 			url:'/buddy',
// 			data: JSON.stringify(data)
// 		})
// 		.then(function(data) {
// 			return JSON.stringify(data.data);
// 		});
// 	};
// 	return {
//        addBuddy:addBuddy
// 	};
// });
