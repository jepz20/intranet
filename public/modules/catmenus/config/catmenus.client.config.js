'use strict';

// Configuring the Programas module
angular.module('catmenus').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'MenusUsuario', 'menusUsuario', 'dropdown', '/menusUsuario(/create)?');
        Menus.addSubMenuItem('topbar', 'menusUsuario', 'Listar Menus', 'catmenus');
        Menus.addSubMenuItem('topbar', 'menusUsuario', 'Nuevo Menu', 'catmenus/create');
        Menus.addSubMenuItem('topbar', 'menusUsuario', 'Asignar Menu a Usuario', 'catmenus/asignar');
    }
]);
