'use strict';


angular.module('core').controller('DrawerController', ['$scope', 'Authentication', 'ManejoDrawer',
    function($scope, Authentication, ManejoDrawer) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.drawer = ManejoDrawer.drawer;

        $scope.escuchando = function ($event) {
            ManejoDrawer.escuchando($event);
        };

        $scope.limpiarOCerrarDrawer = function($event) {
            ManejoDrawer.limpiarOCerrarDrawer($event);
        };
    }
]);
