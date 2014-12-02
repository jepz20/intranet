'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var grupos = require('../../app/controllers/grupos');

	// Grupos Routes
	app.route('/grupos')
		.get(grupos.list)
		.post(users.requiresLogin, grupos.create);

	app.route('/grupos/:grupoId')
		.get(grupos.read)
		.put(users.requiresLogin, grupos.hasAuthorization, grupos.update)
		.delete(users.requiresLogin, grupos.hasAuthorization, grupos.delete);

	// Finish by binding the Grupo middleware
	app.param('grupoId', grupos.grupoByID);
};