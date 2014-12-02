'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var catmenus = require('../../app/controllers/catmenus');

	// Catmenus Routes
	app.route('/catmenus')
		.get(catmenus.list)
		.post(users.requiresLogin, catmenus.create);

	app.route('/catmenus/:catmenuId')
		.get(catmenus.read)
		.put(users.requiresLogin, catmenus.hasAuthorization, catmenus.update)
		.delete(users.requiresLogin, catmenus.hasAuthorization, catmenus.delete);

	// Finish by binding the Catmenu middleware
	app.param('catmenuId', catmenus.catmenuByID);
};