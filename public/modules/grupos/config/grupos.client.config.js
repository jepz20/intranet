'use strict';

// Configuring the Grupo module
angular.module('grupos').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Grupo', 'grupos', 'dropdown', '/grupos(/create)?');
        Menus.addSubMenuItem('topbar', 'grupos', 'List Grupo', 'grupos');
        Menus.addSubMenuItem('topbar', 'grupos', 'New Grupo', 'grupos/create');
    }
]);
