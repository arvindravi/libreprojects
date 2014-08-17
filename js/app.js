angular.module('lp', ['ui.bootstrap'])

.factory('LibreProjects', function($q, $http) {
	var dataUrl = 'data/data.json';
	function getData() {
		return $http.get(dataUrl).then(function success(data) {
			return data.data;
		});
	}
	
	function getFavorites() {
		var favorites = [];
		return $http.get(dataUrl).then(function success(data) {
			data.data.projects.forEach(function(project) {
				if(data.data.defaultFavorites.indexOf(project.id) != -1) {
					project.favorite = true;
					favorites.push(project);
				}
			});
			console.log(favorites);
			return favorites;
		});
	}
	
	return {
		getData: getData,
		getFavorites: getFavorites
	}
})

.controller('HomeCtrl', function($scope, $http, LibreProjects, $modal) {	
	LibreProjects.getData().then(function(data){
		$scope.data = data;
		$scope.data['nop'] = $scope.data.projects.length;
		$scope.data.categories.forEach(function(category){ category.projects=[]; });
		
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
			
			if($scope.data.defaultFavorites.indexOf(project.id) != -1) {
				project.favorite = true;
			} 
			else {
				project.favorite = false;
			};
			
			$scope.data.categories.forEach(function(category) {
				if(category.id==project.category) {
					category.projects.push(project);
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
		
		$scope.toggleFavorite = function(project) {
			if(project.favorite) {
				project.favorite = false;
				$scope.favorites.pop(project);
				console.log(project);
			}
			else
			{
				project.favorite = true;
				$scope.favorites.push(project);
				console.log(project);
			}
		}
		window.data = data;
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

.controller('FavoritesCtrl', function($scope, LibreProjects) {
	LibreProjects.getFavorites().then(function(favorites) {
		$scope.favorites = favorites;
		console.log($scope.favorites);
	})
})