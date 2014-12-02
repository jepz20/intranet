'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Grupo = mongoose.model('Grupo'),
	_ = require('lodash');

/**
 * Create a Grupo
 */
exports.create = function(req, res) {
	var grupo = new Grupo(req.body);
	grupo.user = req.user;

	grupo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grupo);
		}
	});
};

/**
 * Show the current Grupo
 */
exports.read = function(req, res) {
	res.jsonp(req.grupo);
};

/**
 * Update a Grupo
 */
exports.update = function(req, res) {
	var grupo = req.grupo ;

	grupo = _.extend(grupo , req.body);

	grupo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grupo);
		}
	});
};

/**
 * Delete an Grupo
 */
exports.delete = function(req, res) {
	var grupo = req.grupo ;

	grupo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grupo);
		}
	});
};

/**
 * List of Grupos
 */
exports.list = function(req, res) { Grupo.find().sort('-created').populate('user', 'displayName').exec(function(err, grupos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grupos);
		}
	});
};

/**
 * Grupo middleware
 */
exports.grupoByID = function(req, res, next, id) { Grupo.findById(id).populate('user', 'displayName').populate('padre').exec(function(err, grupo) {
		if (err) return next(err);
		if (! grupo) return next(new Error('No se puedo cargar el grupo ' + id));
		req.grupo = grupo ;
		next();
	});
};

/**
 * Grupo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles.indexOf('admin') !== -1) {
		return res.status(403).send('Usuario no esta autorizado');
	}
	next();
};
