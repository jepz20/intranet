'use strict';

// Catmenus controller
angular.module('catmenus').controller('CatmenusController', ['$scope', '$stateParams', '$location', 'Authentication',
 'Catmenus', '$http', '$window', 'Almacenados', function($scope, $stateParams, $location, Authentication, Catmenus, $http, $window, Almacenados ) {
		$scope.authentication = Authentication;
        $scope.seleccionProgramaActivo = '';
		// Create new Catmenu
        var edit = false;
        $scope.$on('$locationChangeStart', function (event, next, current) {
            if ($scope.catmenu) {
                if (edit) {
                    if ($scope.catmenu.nombre === 'Menu sin nombre') {
                        $scope.remove($scope.catmenu);
                    }
                }
            }
        });

    $scope.focusUsuario = 'listo';
		$scope.create = function() {
            console.log('hola');
			// Create new Catmenu object
			var catmenu = new Catmenus ({
				nombre: 'Menu sin nombre'
			});

			// Redirect after save
			catmenu.$save(function(response) {
				$scope.ir('catmenus/' + response._id + '/edit');

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
					$scope.regresar();
				});
			}
		};

		// Update existing Catmenu
		$scope.update = function() {
			var catmenu = $scope.catmenu ;

			catmenu.$update(function(response) {

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
                edit = true;
                $scope.catmenu  = response;
                var catmenuAlmacenado = Almacenados.revisaAlmacenadoOrigen('catmenu');
                if (catmenuAlmacenado) {
                    $scope.catmenu = catmenuAlmacenado.objeto;
                    $scope.update();
                }

                if ($scope.catmenu.nombre !== 'Menu sin nombre') {
                    $scope.focusPrograma = 'listo';
                    $scope.focusMenu = null;
                } else {
                    $scope.focusPrograma = null;
                    $scope.focusMenu = 'listo';
                }

                $scope.programa = '';
            });
		};

    /**
     *Busca programas por el nombre
     *@param {string} val nombre del programa
     *@return {object} programa con el nombre y la url
     */
    $scope.buscaProgramas = function(val) {
        if (val !=='' || val !== null) {
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
        }
        else return null;
    };

    /**
     *funciones luego que se selecciona un programa en la busqueda
     *@param {object} $item objeto que contiene la respuesta del typeahead
     */
    $scope.seleccionarPrograma = function($item) {
        if (!$scope.catmenu.programas) {
            $scope.catmenu.programas = [];
        }
        $scope.catmenu.programas.unshift($item);

        $scope.programa = undefined;
        console.log('seleccionarPrograma');
        console.log($scope.catmenu);

        $scope.update();
    };

    /**
     *Busca usuarios por el nombre
     *@param {string} val nombre del usuario
     *@return {object} usuario con el nombre y la url
     */
    $scope.buscaUsuarios = function(val) {
        if (val !=='' || val !== null) {
            return $http.get('users/listado', {
                params: {
                    username: val,
                    limit: 10
                }
            }).then(function(res){
                var usuarios = [];
                angular.forEach(res.data, function(item){
                    usuarios.push(item);
                });
                return usuarios;
            });
        }
        else return null;
    };

    /**
     *funciones luego que se selecciona un usuario en la busqueda
     *@param {object} $item objeto que contiene la respuesta del typeahead
     */
    $scope.seleccionarUsuario = function($item) {
        $scope.usuario = $item;
        $scope.focusUsuario = null;
        $scope.focusMenu = 'listo';
    };

    /**
     *Busca catmenus por el nombre
     *@param {string} val nombre del catmenu
     *@return {object} catmenu con el nombre y la url
     */
    $scope.buscaCatmenus = function(val) {
        if (val !=='' || val !== null) {
            return $http.get('catmenus/', {
                params: {
                    nombre: val,
                    limit: 10,
                    sort: 'nombre'
                }
            }).then(function(res){
                var catmenus = [];
                angular.forEach(res.data, function(item){
                    catmenus.push(item);
                });
                return catmenus;
            });
        }
        else return null;
    };

    /**
     *funciones luego que se selecciona un catmenu en la busqueda
     *@param {object} $item objeto que contiene la respuesta del typeahead
     */
    $scope.seleccionarCatmenu = function($item) {
        $scope.catmenu = $item;
    };


    /**
     *Redirige a la pagina que muestra el procedimiento y los pasos
     @param {string} url pagina a la que se ira
     */
    $scope.ir = function(url) {
        $location.path(url);
    };


    /**
     *Guarda el nombre del menu al presionar enter
     @param {object} $event evento del teclado
     **/
     $scope.guardaNombre = function($event) {
        //si es enter
        if ($event.keyCode === 13) {
            $scope.update();
            $event.preventDefault();
        }
     };


     var tmpProgramas = [];
     /**
     *Cuando se reordena arrastrando un item que guarde
     */
    $scope.sortableOptions = {
        update: function(e, ui) {
            tmpProgramas = $scope.catmenu.programas;
        },
        stop: function(e, ui) {
            function arraysEqual(a, b) {
              if (a === b) return true;
              if (a === null || b === null) return false;
              if (a.length !== b.length) return false;

              // If you don't care about the order of the elements inside
              // the array, you should sort both arrays here.

              for (var i = 0; i < a.length; ++i) {
                if (a[i]._id !== b[i]._id) return false;
              }
              return true;
            }
            if (arraysEqual(tmpProgramas,$scope.catmenu.programas)) {
                $scope.update();
            }
        }
    };

    /**
     *elimina del menu un programa
     *@param programa programa a eliminar
     **/
    $scope.eliminarProgramaDeMenu = function(programa) {
        $scope.catmenu.programas.splice($scope.catmenu.programas.indexOf(programa),1);
        $scope.update();
    };

    $scope.crearProgramaDesdeMenu = function() {
        Almacenados.agregaAlmacenado($scope.catmenu, 'catmenu', 'programa', 'programas/create');
    };

    $scope.regresar = function() {
        $window.history.back();
    };
}]);
