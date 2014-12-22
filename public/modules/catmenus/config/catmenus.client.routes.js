'use strict';

//Setting up route
angular.module('catmenus').config(['$stateProvider',
	function($stateProvider) {
		// Catmenus state routing
		$stateProvider.
		state('listCatmenus', {
			url: '/catmenus',
			templateUrl: 'modules/catmenus/views/list-catmenus.client.view.html'
		}).
		state('createCatmenu', {
			url: '/catmenus/create',
			templateUrl: 'modules/catmenus/views/create-catmenu.client.view.html'
		}).
		state('asignaCatmenu', {
			url: '/catmenus/asignar',
			templateUrl: 'modules/catmenus/views/asignar-catmenu.client.view.html'
		}).
		state('viewCatmenu', {
			url: '/catmenus/:catmenuId',
			templateUrl: 'modules/catmenus/views/view-catmenu.client.view.html'
		}).
		state('editCatmenu', {
			url: '/catmenus/:catmenuId/edit',
			templateUrl: 'modules/catmenus/views/edit-catmenu.client.view.html'
		});
	}
]);
