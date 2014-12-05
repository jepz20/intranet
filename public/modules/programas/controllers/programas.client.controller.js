'use strict';

// Programas controller
angular.module('programas').controller('ProgramasController', ['$scope', '$stateParams', '$location',
 '$window', 'Authentication', 'Programas', 'Grupos', 'CargarArchivo', 'ManejoDrawer',
 function($scope, $stateParams, $location, $window, Authentication, Programas, Grupos, CargarArchivo, ManejoDrawer ) {
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
				nombre: this.nombre,
				url: this.url,
				icono: icono_ext,
				grupo: grupo
			});

			// Redirect after save
			programa.$save(function(response) {
				if (response.icono)
					if (response.icono.length > 0)
						$scope.uploadIcono(response.icono);
				$location.path('programas/admin');

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
				$location.path('programas/admin');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Programas
		$scope.find = function() {
			$scope.programas = Programas.query(function(response) {
				//ordenar la informacion por grupo
				var porGrupo = [];
				for (var i = response.length - 1; i >= 0; i--) {
					if(response[i].grupo) {
						if (porGrupo.indexOf(response[i].grupo.nombre) === -1){
							porGrupo.push(response[i].grupo.nombre);
						}
					} else {
						if (porGrupo.indexOf('') === -1){
							porGrupo.push('');
						}
					}
				}
			});
		};

		// Find existing Programa
		$scope.findOne = function() {
			$scope.programa = Programas.get({
				programaId: $stateParams.programaId
			}, function(response) {
				$scope.grupo.selected = response.grupo;
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
			$scope.filtro = undefined;
			$scope.poneFocus('filtro');
			$window.open(url);
		};

		$scope.poneFocus = function (id) {
			document.getElementById(id).focus();
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
	    $scope.drawerShown = ManejoDrawer.drawer;

  		$scope.toggleModal = function() {
    		ManejoDrawer.toggleModal();
  		};

  		$scope.limpiarOCerrarDrawer = function($event) {
  			console.log($event.keyCode);
  			if ($scope.filtro) {
  				if ($scope.filtro.nombre) {
  					if ($scope.filtro.nombre === '') {
						ManejoDrawer.toggleModal();
  					}
  					else {
  						$scope.filtro.nombre = '';
  					}
  				} else
					ManejoDrawer.toggleModal();
  			} else {
				ManejoDrawer.toggleModal();
  			}
  			$event.preventDefault();
  		};

  		$scope.enterAlPrograma = function($event) {
  			if ($scope.programasFiltrado) {
  				if ($scope.programasFiltrado.constructor === Array) {
  					$scope.irAUrl($scope.programasFiltrado[0].url );
  				} else {
					$scope.irAUrl($scope.programasFiltrado.url );
  				}
  			}
  			$event.preventDefault();
  		};

  		$scope.escuchando = function ($event) {
  			if ($event.keyCode === 80) {
  				$scope.toggleModal();
  			}
  		};
	}
]);



//\b(?=\w*[al])\w+\b
