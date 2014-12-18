'use strict';

// Catmenus controller
angular.module('catmenus').controller('CatmenusController', ['$scope', '$stateParams', '$location', 'Authentication',
 'Catmenus', '$http', function($scope, $stateParams, $location, Authentication, Catmenus, $http ) {
		$scope.authentication = Authentication;
        $scope.seleccionProgramaActivo = '';
		// Create new Catmenu
		$scope.create = function() {
            console.log('hola');
			// Create new Catmenu object
			var catmenu = new Catmenus ({
				nombre: 'Menu sin nombre'
			});

			// Redirect after save
			catmenu.$save(function(response) {
				$location.path('catmenus/' + response._id + '/edit');

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
			Catmenus.get({
				catmenuId: $stateParams.catmenuId
			}, function (response) {
                $scope.catmenu  = response;
                console.log('response');
                console.log(response);
                if (response.nombre !== 'Menu sin nombre') {
                    console.log('hola con nombre',response.nombre,'Menu sin nombre');
                    $scope.focusPrograma = 'listo';
                    $scope.focusMenu = null;
                } else {
                    console.log('hola sin nombre',response.nombre,'Menu sin nombre');
                    $scope.focusPrograma = null;
                    $scope.focusMenu = 'listo';
                }

                $scope.programa = '';
            });
		};

	/**
     *Busca procedimientos por el nombre
     *@param {string} val nombre del programa
      *@return {object} programa con el nombre y la url
     */
    $scope.buscaProgramas = function(val) {
        return $http.get('programas/', {
            params: {
                nombre: val,
                limit: 10
            }
        }).then(function(res){
            var programas = [];
            angular.forEach(res.data, function(item){
                programas.push(item);
            });
            return programas;
        });
    };

    /**
     *funciones luego que se selecciona un programa en la busqueda
     *@param {object} $item objeto que contiene la respuesta del typeahead
     */
    $scope.seleccionarPrograma = function($item) {
        if (!$scope.programas) {
            $scope.programas = [];
        }
        $scope.programas.unshift($item);

        $scope.programa = undefined;
    };

    /**
     *Redirige a la pagina que muestra el procedimiento y los pasos
     @param {string} url pagina a la que se ira
     */
    $scope.ir = function(url) {
        $location.path(url);
    };

	}
]);
