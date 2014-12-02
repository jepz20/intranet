'use strict';

// Catmenus controller
angular.module('catmenus').controller('CatmenusController', ['$scope', '$stateParams', '$location', 'Authentication', 'Catmenus',
	function($scope, $stateParams, $location, Authentication, Catmenus ) {
		$scope.authentication = Authentication;

		// Create new Catmenu
		$scope.create = function() {
			// Create new Catmenu object
			var catmenu = new Catmenus ({
				name: this.name
			});

			// Redirect after save
			catmenu.$save(function(response) {
				$location.path('catmenus/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Catmenu
		$scope.remove = function( catmenu ) {
			if ( catmenu ) { catmenu.$remove();

				for (var i in $scope.catmenus ) {
					if ($scope.catmenus [i] === catmenu ) {
						$scope.catmenus.splice(i, 1);
					}
				}
			} else {
				$scope.catmenu.$remove(function() {
					$location.path('catmenus');
				});
			}
		};

		// Update existing Catmenu
		$scope.update = function() {
			var catmenu = $scope.catmenu ;

			catmenu.$update(function() {
				$location.path('catmenus/' + catmenu._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Catmenus
		$scope.find = function() {
			$scope.catmenus = Catmenus.query();
		};

		// Find existing Catmenu
		$scope.findOne = function() {
			$scope.catmenu = Catmenus.get({ 
				catmenuId: $stateParams.catmenuId
			});
		};
	}
]);