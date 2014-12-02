'use strict';

// Configuring the Programas module
angular.module('programas').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Programas', 'programas', 'dropdown', '/programas(/create)?');
        Menus.addSubMenuItem('topbar', 'programas', 'List Programas', 'programas');
        Menus.addSubMenuItem('topbar', 'programas', 'New Programa', 'programas/create');
        Menus.addSubMenuItem('topbar', 'programas', 'Admin Programas', 'programas/admin');
    }
]);
