'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grupo = mongoose.model('Grupo'),
	Programa = mongoose.model('Programa'),
	Catmenu = mongoose.model('Catmenu');

/**
 * Globals
 */
var user, catmenu, grupo, programa1, programa2;

/**
 * Unit tests
 */
describe('Catmenu Model Unit Tests:', function() {
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
				programa1 = new Programa({
					nombre: 'Programa 1',
					url: 'https://10.172.1.4:5500/em/console/logon/logon',
					icono: 'nada.aa',
					user: user,
					grupo: grupo
				});
				programa1.save(function() {
					programa2 = new Programa({
						nombre: 'Programa 2',
						url: 'https://10.172.1.4:5500/em/console/logon/logout',
						icono: 'nada.ab',
						user: user,
						grupo: grupo
					});
					programa2.save(function() {
						catmenu = new Catmenu({
							nombre: 'Catmenu Name',
							user: user,
							programas: [programa1, programa2]
						});
						done();
					});
				});
			});
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return catmenu.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without nombre', function(done) {
			catmenu.nombre = '';

			return catmenu.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Catmenu.remove().exec();
		User.remove().exec();

		done();
	});
});
