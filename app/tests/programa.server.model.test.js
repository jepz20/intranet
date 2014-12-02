'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grupo = mongoose.model('Grupo'),
	Programa = mongoose.model('Programa');


/**
 * Globals
 */
var user, programa, grupo;

/**
 * Unit tests
 */
describe('Programa Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			grupo = new Grupo({
            	nombre: 'Grupo Prueba',
				user: user
			});
			grupo.save(function() {
				programa = new Programa({
					nombre: 'Programa Name',
					url: 'https://10.172.1.4:5500/em/console/logon/logon',
					icono: 'nada.aa',
					user: user,
					grupo: grupo
				});
				done();
			});
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return programa.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			programa.nombre = '';

			return programa.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Programa.remove().exec();
		User.remove().exec();

		done();
	});
});
