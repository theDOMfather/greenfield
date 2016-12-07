angular.module('app.service', [])

.factory('createFactory', function($http) {
  var add = function(data) {
    return $http({
        method: 'POST',
        url: '/create',
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
    get: function() {
      return $http.get('/status');
    }
  };
});
