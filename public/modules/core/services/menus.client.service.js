'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
])
.service('Almacenados', [ '$rootScope', '$location', function($rootScope, $location){

 	/**
     *Almacena un objeto en el rootScope para que si crea otro objeto pueda regresar y utilizar
     *el objeto creado
     *@param {object} objeto el objeto que se va a guardar
     *@param {string} origen el tipo de objeto que se esta guardando
     *@param {string} destino el tipo de objeto que se esta guardando
     *@param {url}  a que direccion va a redireccionar
     */

   var agregaAlmacenado = function(objeto, origen, destino, url) {
    	var almacenado = {};
    	almacenado.objeto = objeto;
    	almacenado.destino = destino;
    	almacenado.origen = origen;
    	if ($rootScope.almacenado) {
    		if ($rootScope.almacenado.length <= 0) {
    			$rootScope.almacenado = [almacenado];
    		} else $rootScope.almacenado.push(almacenado);
    	} else $rootScope.almacenado = [almacenado];
		ir(url);
    };

    /**
     *Revisa si existe un almacenado que se produjo desde este origen
     * y ejecuta un proceso
     *@param {string} origen origen del almacenado
     **/
	var revisaAlmacenadoOrigen = function(origen) {
		if (!origen) {
			return false;
		}
		var existeAlmacenado = false;
		if ($rootScope.almacenado && $rootScope.almacenado.length > 0){
			for (var i = 0; i < $rootScope.almacenado.length; i++) {
				if ($rootScope.almacenado[i].origen === origen) {
					existeAlmacenado = true;
					break;
				}

			}
			if (existeAlmacenado) {
				var objetoEncontrado = $rootScope.almacenado[i];
				$rootScope.almacenado.splice(i,1);
				return (objetoEncontrado);
			}
			else return null;
		}
	};

    /**
     *Revisa si existe un almacenado que se dirige a este destino
     * y ejecuta un proceso
     *@param {string} destino destino del almacenado
     *@return {number} posicion en que se encuentra el objecto que lo llamo y si no lo encuentra -1
     **/
    var revisaAlmacenadoDestino = function(destino) {
        var existeAlmacenado = false;
        if ($rootScope.almacenado && $rootScope.almacenado.length > 0){
            for (var i = 0; i < $rootScope.almacenado.length; i++) {
                if ($rootScope.almacenado[i].destino === destino) {
                    existeAlmacenado = true;
                    return i;
                }
            }
            return -1;
        } else return -1;
    };

	/**
     *Redirige a la pagina que muestra el procedimiento y los pasos
     @param {string} url pagina a la que se ira
     */
    var ir = function(url) {
        $location.path(url);
    };

    return {
        agregaAlmacenado: agregaAlmacenado,
        revisaAlmacenadoOrigen: revisaAlmacenadoOrigen,
        revisaAlmacenadoDestino: revisaAlmacenadoDestino,
        ir: ir
    };
}]);
