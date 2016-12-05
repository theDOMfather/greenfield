angular.module('app.service',[])

.factory('buddyFactory', function($http) {

	var addBuddy = function (data){
		return $http({
			method: 'POST',
			url:'/buddy',
			data: JSON.stringify(data)
		})
		.then(function(data) {
			return JSON.stringify(data.data);
		});
	};

	return {
       addBuddy:addBuddy
	};
})



.factory('alertFactory',  function($http) {

	var setAlert = function() {
		return $http({
			method:'POST',
			url:'/setAlert',
			data: JSON.stringify(data)
		})
		.then(function(data) {
			return data;
		});
    };

		return {
			setAlert: setAlert
		};	


});