'use strict';

//Catmenus service used to communicate Catmenus REST endpoints
angular.module('catmenus').factory('Catmenus', ['$resource',
	function($resource) {
		return $resource('catmenus/:catmenuId', { catmenuId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);