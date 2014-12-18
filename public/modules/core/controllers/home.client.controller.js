'use strict';


angular.module('core').controller('HomeController', ['$scope', '$rootScope','Authentication', 'ManejoDrawer',
	function($scope, $rootScope, Authentication, ManejoDrawer) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        $scope.drawerShown = ManejoDrawer.drawerShown;
        $scope.escuchando = function ($event) {
            ManejoDrawer.escuchando($event);
        };

        $scope.toggleModal = function () {
            ManejoDrawer.toggleModal();
        };
    }
]);
