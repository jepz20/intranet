'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'ManejoDrawer',
	function($scope, Authentication, Menus, ManejoDrawer) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.escuchando = function ($event) {
            ManejoDrawer.escuchando($event);
        };

        $scope.toggleModal = function() {
            if ($scope.isCollapsed) {
                $scope.toggleCollapsibleMenu();
            }
            ManejoDrawer.toggleModal();
        };

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
