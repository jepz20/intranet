'use strict';

//Grupos service used to communicate Grupos REST endpoints
angular.module('grupos').factory('Grupos', ['$resource',
	function($resource) {
		return $resource('grupos/:grupoId', { grupoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);