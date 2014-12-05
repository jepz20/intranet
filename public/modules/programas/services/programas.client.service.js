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

    var limpiarOCerrarDrawer = function($event) {
        toggleModal();
        $event.preventDefault();
    };

    var toggleModal = function() {
        drawer.shown = !drawer.shown;
    };

    var escuchando = function ($event) {
        var tag = $event.target.tagName;
        if ($event.keyCode === 80 &&  tag !== 'INPUT' && tag !== 'TEXTAREA') {
            toggleModal();
            $event.preventDefault();
        }
        //console.log($event.keyCode);
    };

    return {
        toggleModal: toggleModal,
        drawer: drawer,
        escuchando: escuchando
    };
}]);
