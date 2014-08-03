angular.module('lp', ['ui.bootstrap'])

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

.controller('HomeCtrl', function($scope, $http, LibreProjects, $modal) {
	LibreProjects.getData().then(function(data){
		$scope.data = data.data;
		$scope.data['nop'] = $scope.data.projects.length;
		$scope.data.categories.forEach(function(category){ category.projects=[]; });
		$scope.favorites = [];
		$scope.data.projects.forEach(function(project) {
			$scope.data.categories.forEach(function(category) {
				if(category.id==project.category) {
					category.projects.push(project);
				}
			});
			$scope.data.defaultFavorites.forEach(function(projectId) {
				if(projectId==project.id) {
					$scope.favorites.push(project);
				}
			})
		});
		$scope.data.categories.push({
			id: "favorites",
			position: "16",
			projects: $scope.favorites
		});
		window.data = data.data;
	});
	
    $scope.open = function (project) {
		
       var modalInstance = $modal.open({
         templateUrl: 'projectModal.html',
         controller: ModalInstanceCtrl,
         resolve: {
           project: function() {
			   console.log(project);
			   return project;
           }
         }
       });
     };
	 
	 var ModalInstanceCtrl = function ($scope, $modalInstance, project) {
		 
	   $scope.project = project;
	   
	   $scope.ok = function () {
	     $modalInstance.close();
	   };

	   $scope.cancel = function () {
	     $modalInstance.dismiss('cancel');
	   };
	 };
})