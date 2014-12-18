'use strict';

// Grupos controller
angular.module('grupos').controller('GruposController', ['$scope', '$rootScope', '$stateParams', '$location', '$http',
    '$window','Authentication', 'Grupos',
	function($scope, $rootScope, $stateParams, $location, $http, $window, Authentication, Grupos ) {
		$scope.authentication = Authentication;

		// Create new Grupo
		$scope.create = function() {
			//Si tiene un grupo padre lo agrego al listado
            var grupo;
			if ($scope.grupopadre.selected) {
				// Create new Grupo object
				grupo = new Grupos ({
					nombre: this.nombre,
					padre: $scope.grupopadre.selected._id
				});
			//si no tiene grupo padre omito el campo
			} else {
				// Create new Grupo object
				    grupo = new Grupos ({
					nombre: this.nombre
				});
			}



			// Redirect after save
			grupo.$save(function(response) {
                if ($rootScope.programaAlmacenado) {
                    $rootScope.programaAlmacenado.grupo = response;
                }
				$scope.regresar();

				// Clear form fields
				$scope.nombre = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Grupo
		$scope.remove = function( grupo ) {
			if ( grupo ) { grupo.$remove();

				for (var i in $scope.grupos ) {
					if ($scope.grupos [i] === grupo ) {
						$scope.grupos.splice(i, 1);
					}
				}
			} else {
				$scope.grupo.$remove(function() {
					$location.path('grupos');
				});
			}
		};

		// Update existing Grupo
		$scope.update = function() {
			var grupo = $scope.grupo;
            if ($scope.grupopadre.selected) {
                grupo.padre = $scope.grupopadre.selected._id;
            } else {
                grupo.padre = null;
            }

            console.log(grupo.padre);
			grupo.$update(function() {
				$location.path('grupos/' + grupo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Grupos
		$scope.find = function() {
			$scope.grupos = Grupos.query();
		};

		// Find existing Grupo
		$scope.findOne = function() {
			Grupos.get({
                grupoId: $stateParams.grupoId
            }, function(grupo) {
                $scope.grupo = grupo;
                console.log($scope.grupo);
                $scope.grupopadre.selected = $scope.grupo.padre;
            });
		};

        //Se define el modelo del dropdown para que se le pueda asignar un select
        $scope.grupopadre = {};
        //limpia el dropdown
        $scope.limpiaUiSelect = function () {
            $scope.grupopadre.selected = null;
        };

        $scope.regresar = function() {
            $window.history.back();
        };

        /**
         *Redirige a la pagina que muestra el procedimiento y los pasos
         @param {string} url pagina a la que se ira
         */
        $scope.ir = function(url) {
            $location.path(url);
        };

        $scope.limpiaBusqueda = function() {
            $scope.filtro = undefined;
            $scope.busqueda = undefined;
        };

	}
]);
