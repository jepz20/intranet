'use strict';

//Setting up route
angular.module('grupos').config(['$stateProvider',
	function($stateProvider) {
		// Grupos state routing
		$stateProvider.
		state('listGrupos', {
			url: '/grupos',
			templateUrl: 'modules/grupos/views/list-grupos.client.view.html'
		}).
		state('createGrupo', {
			url: '/grupos/create',
			templateUrl: 'modules/grupos/views/create-grupo.client.view.html'
		}).
		state('viewGrupo', {
			url: '/grupos/:grupoId',
			templateUrl: 'modules/grupos/views/view-grupo.client.view.html'
		}).
		state('editGrupo', {
			url: '/grupos/:grupoId/edit',
			templateUrl: 'modules/grupos/views/edit-grupo.client.view.html'
		});
	}
]);