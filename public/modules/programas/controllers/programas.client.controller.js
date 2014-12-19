'use strict';

// Programas controller
angular.module('programas').controller('ProgramasController', ['$scope', '$rootScope', '$stateParams', '$location',
 '$window', '$timeout', 'Authentication', 'Programas', 'Grupos', 'CargarArchivo', 'ManejoDrawer', 'Almacenados',
 function($scope, $rootScope, $stateParams, $location, $window, $timeout, Authentication, Programas, Grupos, CargarArchivo, ManejoDrawer, Almacenados ) {
		$scope.authentication = Authentication;

		// Create new Programa
		$scope.create = function() {
			var grupo,icono_ext;
			if ($scope.fileImagen)
			{
				icono_ext = $scope.fileImagen.name.substr($scope.fileImagen.name.length-3,3);
			}
			else icono_ext = '';
			if ($scope.grupo.selected) {
				grupo = $scope.grupo.selected._id;
			} else {
				grupo = null;
			}
			// Create new Programa object
			var programa = new Programas ({
				nombre: this.programa.nombre,
				url: this.programa.url,
				icono: icono_ext,
				grupo: grupo
			});

			// Redirect after save
			programa.$save(function(response) {
				if (response.icono) {
					if (response.icono.length > 0) {
						$scope.uploadIcono(response.icono);
					}
				}

		        var posicion = Almacenados.revisaAlmacenadoDestino('programa');
	            if ( posicion >= 0)
	            {
	                if ($rootScope.almacenado[posicion].origen === 'catmenu') {
	                    $rootScope.almacenado[posicion].objeto.programas.unshift(response);
	                }
	            }
				$scope.regresar();

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse,prog) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Programa
		$scope.remove = function( programa ) {
			if ( programa ) { programa.$remove();

				for (var i in $scope.programas ) {
					if ($scope.programas [i] === programa ) {
						$scope.programas.splice(i, 1);
					}
				}
			} else {
				$scope.programa.$remove(function() {
					$location.path('programas');
				});
			}
		};

		// Update existing Programa
		$scope.update = function() {
			var icono_ext;
			if ($scope.fileImagen)
			{
				icono_ext = $scope.fileImagen.name.substr($scope.fileImagen.name.length-3,3);
			}
			else {
				icono_ext = null;
			}
			$scope.programa.icono = icono_ext || $scope.programa.icono;

			if ($scope.grupo.selected) {
				$scope.programa.grupo = $scope.grupo.selected._id;
			} else {
				$scope.programa.grupo = null;
			}

			var programa = $scope.programa ;

			programa.$update(function(response) {
				if (icono_ext) {
					$scope.uploadIcono(response.icono);
				}
				$scope.regresar();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Programas
		$scope.find = function() {
			Programas.query(function(response) {
				//ordenar la informacion por grupo
				$scope.programas = response;
			});
		};

		// Find existing Programa
		$scope.findOne = function() {
			$scope.programa = Programas.get({
				programaId: $stateParams.programaId
			}, function(response) {
				$scope.grupo.selected = response.grupo;
				$scope.inicioCreaEdita();
			});
		};

		//Se crea el objetos de grupo vacio para que pueda usarlo el uiselect
		$scope.grupo={};

		//Busca los grupos para ser asignado a un programa
		$scope.buscaGrupos = function() {
			$scope.grupos = Grupos.query();
		};

		$scope.limpiaUiSelect = function() {
			$scope.grupo.selected = null;
		};

		$scope.limpiaBusqueda = function() {
			$scope.filtro = undefined;
			$scope.busqueda = undefined;
		};

		$scope.uploadIcono = function(nombreIcono) {
	        var files = [];
	        var cont = 0;
	        if ($scope.fileImagen) {
	            files[cont] = $scope.fileImagen;
	            cont++;
	        }
			var uploadUrl = '/programas/uploadIcono?nombreIcono=' + nombreIcono;
	        CargarArchivo
	            .uploadFileToUrl(files, uploadUrl);
		};

		$scope.irAUrl = function (url,id) {
			$scope.toggleModal();
			$timeout(function() {
				$window.open(url);
			},300);
		};

		$scope.borrarIcono = function () {
			$scope.programa.icono='';
			$scope.fileImagen = undefined;
		};

		/**
	     *Redirige a la pagina que muestra el procedimiento y los pasos
	     @param {string} url pagina a la que se ira
	     */
	    $scope.ir = function(url) {
	        $location.path(url);
	    };


	    /**
	     *Almacena un objeto en el rootScope para que si crea otro objeto pueda regresar y utilizar
	     *el objeto creado
	     *@param {object} objeto el objeto que se va a guardar
	     *@param {string} origen el tipo de objeto que se esta guardando
	     *@param {string} destino el tipo de objeto que se esta guardando
	     *@param {url}  a que direccion va a redireccionar
	     */

	    $scope.agregaAlmacenado = function(objeto, origen, destino, url) {
	    	Almacenados.agregaAlmacenado(objeto, origen, destino, url);
	    };

  		$scope.toggleModal = function() {
    		ManejoDrawer.toggleModal();
  		};

  		$scope.enterAlPrograma = function($event, url, id) {
  			//Enter
  			if ($event.keyCode === 13 && $event.target.tagName !== 'INPUT') {
  				$scope.irAUrl(url,id);
  				$event.preventDefault();
  			}
  		};

  		$scope.enterOEscAlFiltro = function($event) {
  			if ($event.target.tagName === 'INPUT') {
  				//Enter
	  			if ($event.keyCode === 13) {
	  				var url,id;
	  				if ($scope.programasFiltrado) {
	  					if ($scope.programasFiltrado.length > 0) {
		  					url = $scope.programasFiltrado[0].url ;
		  					id = $scope.programasFiltrado[0].id ;
	  						$scope.irAUrl(url,id);
	  					}
	  				} else if ($scope.programas) {
						url = $scope.programas[0].url;
	  					id = $scope.programas[0].id ;
	  					$scope.irAUrl(url,id);
	  				}
	  				$event.preventDefault();
	  			}
	  			if ($event.keyCode === 27) {
	  				if ($scope.filtro) {
	  					if ($scope.filtro.nombre) {
	  						if ($scope.filtro.nombre.length > 0)
	  							$scope.filtro = null;
	  						else {
	  							ManejoDrawer.toggleModal();
	  						}
	  					} else {
	  						ManejoDrawer.toggleModal();}
	  					$scope.filtro = null;
	  				} else {
	  					ManejoDrawer.toggleModal();
	  				}
	  				$event.preventDefault();
	  			}
  			}
  		};

  		$scope.inicioCreaEdita = function() {
  			$scope.buscaGrupos();
  			var programaAlmacenado = Almacenados.revisaAlmacenadoOrigen('programa');
  			if (programaAlmacenado) {
  				$scope.programa = programaAlmacenado.objeto;
  				if (programaAlmacenado.destino === 'grupo') {
  					$scope.grupo.selected = $scope.programa.grupo;
  				}
  			}
  		};

        $scope.regresar = function() {
            $window.history.back();
        };

        $scope.urlPreLlenado = function() {
        	if ($scope.programa.url === '' || $scope.programa.url === undefined) {
        		$scope.programa.url = 'http://';
        	}
        };
	}
]);

