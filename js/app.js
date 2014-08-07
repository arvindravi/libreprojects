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
		
		$scope.getAlternative = function(id) {
			var alt;
			$scope.data.alternatives.forEach(function(alternative) {
				if(id==alternative.id) {
					alt = alternative;
				}
			});
			return alt;
		};
		
		$scope.getLicense = function(id) {
			var license;
			$scope.data.licenses.forEach(function(li) {
				if(id==li.id) {
					license = li;
				}
			});
			return license;
		}
		
		$scope.data.projects.forEach(function(project) {
			project.similarProjects = [];
			project.alternatives = [];
			project.fullLicenses = [];
			project.favorite = false;
			$scope.data.categories.forEach(function(category) {
				if(category.id==project.category) {
					category.projects.push(project);
				}
			});
			$scope.data.defaultFavorites.forEach(function(projectId) {
				if(projectId==project.id) {
					project.favorite = true;
					$scope.favorites.push(project)
				}
			});
			if(project.alternative) {
				project.alternative.forEach(function(alt) {
					project.alternatives.push($scope.getAlternative(alt));
				});
			}
			if(project.licenses) {
				project.licenses.forEach(function(license) {
					project.fullLicenses.push($scope.getLicense(license));
				})
			}
		});
		window.data = data.data;
		window.favorites = $scope.favorites;
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