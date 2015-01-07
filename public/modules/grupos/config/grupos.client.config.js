'use strict';

// Configuring the Grupo module
angular.module('grupos').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Grupo', 'grupos', 'dropdown', '/grupos(/create)?');
        Menus.addSubMenuItem('topbar', 'grupos', 'Crear Grupo', 'grupos/create');
        Menus.addSubMenuItem('topbar', 'grupos', 'Administar Grupo', 'grupos');
    }
]);
