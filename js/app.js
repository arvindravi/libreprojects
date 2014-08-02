angular.module('lp', [])

.factory('LibreProjects', function($q, $http) {
	var deferred = $q.defer();
	var dataUrl = 'data/data.json';
	return {
		getData: function() {
			deferred.resolve($http.get(dataUrl));
			return deferred.promise;
		}
	}
})

.controller('HomeCtrl', function($scope, $http, LibreProjects) {
	LibreProjects.getData().then(function(data){
		$scope.data = data.data;
		$scope.data['nop'] = $scope.data.projects.length;
		$scope.data.categories.forEach(function(category){ category.projects=[]; });
		$scope.data.projects.forEach(function(project) {
			$scope.data.categories.forEach(function(category) {
				if(category.id==project.category) {
					category.projects.push(project);
				}
			})
		});
		console.log($scope.data);
		window.data = data.data;
	});
})