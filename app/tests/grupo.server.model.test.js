'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grupo = mongoose.model('Grupo');

/**
 * Globals
 */
var user, grupo, grupo_padre;

/**
 * Unit tests
 */
describe('Grupo Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
            role: ['admin']
		});

		user.save(function() {
			grupo = new Grupo({
            nombre: 'Grupo Name',
				user: user
			});
			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return grupo.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save withoutnombre', function(done) {
			grupo.nombre= '';

			return grupo.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

    describe('Metodo Guardar con padre', function () {
        it ('deberia guarda con un padre que exista', function (done) {
            grupo_padre = new Grupo ( {
               nombre: 'Grupo con Padre',
                user: user,
                padre: grupo
            });

            return grupo.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
    });
	afterEach(function(done) {
		Grupo.remove().exec();
		User.remove().exec();

		done();
	});
});
