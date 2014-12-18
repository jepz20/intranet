'use strict';

//Programas service used to communicate Programas REST endpoints
angular.module('programas').factory('Programas', ['$resource',
	function($resource) {
		return $resource('programas/:programaId', { programaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.service('CargarArchivo', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
    this.uploadFileToUrl = function(files, uploadUrl){

        var deferred = $q.defer();
        var fd = new FormData();
        var tipo;
        if (files.length > 0) {
            for (var i = files.length - 1; i >= 0; i--) {
                tipo = files[i].type.substring(0,files[i].type.indexOf('/'));
                fd.append(tipo, files[i]);
            }
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(err){
                deferred.reject(err);
            });
        } else {
            deferred.resolve('');
        }
        return deferred.promise;
    };
}])
.service('ManejoDrawer', [ function(){
    var drawer = {};
    drawer.shown = false;
    drawer.ultimoFocus = 0;
    drawer.limite = 20;
    var limpiarOCerrarDrawer = function($event) {
        toggleModal();
        $event.preventDefault();
    };

    var toggleModal = function() {
        drawer.shown = !drawer.shown;
        drawer.ultimoFocus = -1;
    };

    var escuchando = function ($event) {
        var tag = $event.target.tagName;

        var focusPrograma = function (posicion,vecesIntento) {
            try {
                document.getElementById('programa' + posicion).focus();
            }
            catch(err) {
                var maximo = 0;
                var pos = posicion - 1;
                if (posicion -1 > 1) {
                    while ( pos > posicion - vecesIntento) {
                        try {
                            document.getElementById('programa' + pos).focus();
                            drawer.ultimoFocus = pos;
                            break;
                        }
                        catch(err) {
                            pos = pos - 1;
                        }
                    }
                    if (pos <= posicion - vecesIntento) {
                        document.getElementById('programa0').focus();
                        drawer.ultimoFocus = 0;
                    }
                } else {
                    document.getElementById('programa0').focus();
                    drawer.ultimoFocus = 0;
                }
            }
        };

        if ($event.keyCode === 80 &&  tag !== 'INPUT' && tag !== 'TEXTAREA') {
            toggleModal();
            $event.preventDefault();
        }
        if (drawer.shown) {

            //Flecha a la derecha
            if ($event.keyCode === 39 && tag !== 'INPUT' && tag !== 'TEXTAREA') {
                drawer.ultimoFocus++;
                if (drawer.ultimoFocus > drawer.limite) {
                    drawer.ultimoFocus = -1;
                }
                focusPrograma(drawer.ultimoFocus,1);
                $event.preventDefault();
            }

            //Flecha arriba
            if ($event.keyCode === 38  && tag !== 'INPUT') {
                drawer.ultimoFocus = drawer.ultimoFocus - 4;
                if ( drawer.ultimoFocus < 0 ) {
                    document.getElementById('filtro').focus();
                    drawer.ultimoFocus = -1;
                } else {
                    focusPrograma(drawer.ultimoFocus,4);
                }
                $event.preventDefault();
            }

            //Flecha a la izquierda
            if ($event.keyCode === 37  && tag !== 'INPUT' && tag !== 'TEXTAREA') {
                drawer.ultimoFocus--;
                if (drawer.ultimoFocus < 0) {
                    document.getElementById('filtro').focus();
                    drawer.ultimoFocus = -1;
                } else {
                    focusPrograma(drawer.ultimoFocus,1);
                }
                $event.preventDefault();
            }

            //Flecha para abajo
            if ($event.keyCode === 40 ) {
                if ( tag === 'INPUT') {
                    drawer.ultimoFocus++;
                    focusPrograma(0);
                } else {
                    drawer.ultimoFocus = drawer.ultimoFocus + 4;
                }
                focusPrograma(drawer.ultimoFocus,4);
                $event.preventDefault();
            }

            //Escape
            if ($event.keyCode === 27 && tag !== 'INPUT') {
                toggleModal();
                $event.preventDefault();
            }

            //Letra F, para regresar al filtro
            if ($event.keyCode === 70  && tag !== 'INPUT' && tag !== 'TEXTAREA') {
                drawer.ultimoFocus = -1;
                document.getElementById('filtro').focus();
                $event.preventDefault();
            }
        }
    };

    return {
        toggleModal: toggleModal,
        drawer: drawer,
        escuchando: escuchando
    };
}]);
