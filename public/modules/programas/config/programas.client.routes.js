'use strict';

//Setting up route
angular.module('programas').config(['$stateProvider',
	function($stateProvider) {
		// Programas state routing
		$stateProvider.
		state('listProgramas', {
			url: '/programas',
			templateUrl: 'modules/programas/views/list-programas.client.view.html'
		}).
		state('listAdminProgramas', {
			url: '/programas/admin',
			templateUrl: 'modules/programas/views/list-admin-programas.client.view.html'
		}).
		state('createPrograma', {
			url: '/programas/create',
			templateUrl: 'modules/programas/views/create-programa.client.view.html'
		}).
		state('viewPrograma', {
			url: '/programas/:programaId',
			templateUrl: 'modules/programas/views/view-programa.client.view.html'
		}).
		state('editPrograma', {
			url: '/programas/:programaId/edit',
			templateUrl: 'modules/programas/views/edit-programa.client.view.html'
		});
	}
]);
