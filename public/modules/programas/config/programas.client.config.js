'use strict';

// Configuring the Programas module
angular.module('programas').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Programas', 'programas', 'dropdown', '/programas(/create)?');
        Menus.addSubMenuItem('topbar', 'programas', 'Crear Programa', 'programas/create');
        Menus.addSubMenuItem('topbar', 'programas', 'Administrar Programas', 'programas/admin');
    }
]);
