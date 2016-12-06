angular.module('app.service',[])

.factory('goalFactory',  function($http) {
	var add = function(data) {
		return $http({
			method:'POST',
			url:'/goal',
			data: JSON.stringify(data)
		})
		.then(function(data) {
			return data;
		});
    };
		return {
			add: add
		};	
})
.factory('statusFactory', function($http) {
	return {
		get : function() {
			return $http.get('/status');
		}
	}
})
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