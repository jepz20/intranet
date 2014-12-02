'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var programas = require('../../app/controllers/programas');

	// Programas Routes
	app.route('/programas')
		.get(programas.list)
		.post(users.requiresLogin, programas.create);

	app.route('/programas/:programaId')
		.get(programas.read)
		.put(users.requiresLogin, programas.hasAuthorization, programas.update)
		.delete(users.requiresLogin, programas.hasAuthorization, programas.delete);

	app.route('/programas/uploadicono')
		.post(programas.agregarArchivos);

	// Finish by binding the Programa middleware
	app.param('programaId', programas.programaByID);
};
