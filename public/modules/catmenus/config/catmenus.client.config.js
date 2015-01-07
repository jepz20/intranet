'use strict';

// Configuring the Programas module
angular.module('catmenus').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Menus', 'menusUsuario', 'dropdown', '/menusUsuario(/create)?');
        Menus.addSubMenuItem('topbar', 'menusUsuario', 'Crear Menu', 'catmenus/create');
        Menus.addSubMenuItem('topbar', 'menusUsuario', 'Administrar Menus', 'catmenus');
        Menus.addSubMenuItem('topbar', 'menusUsuario', 'Asignar Menu a Usuario', 'catmenus/asignar');
    }
]);
