'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Catmenu = mongoose.model('Catmenu'),
	_ = require('lodash');

/**
 * Create a Catmenu
 */
exports.create = function(req, res) {
	var catmenu = new Catmenu(req.body);
	catmenu.user = req.user;

	catmenu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(catmenu);
		}
	});
};

/**
 * Show the current Catmenu
 */
exports.read = function(req, res) {
	res.jsonp(req.catmenu);
};

/**
 * Update a Catmenu
 */
exports.update = function(req, res) {
	var catmenu = req.catmenu ;

	catmenu = _.extend(catmenu , req.body);

	catmenu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(catmenu);
		}
	});
};

/**
 * Delete an Catmenu
 */
exports.delete = function(req, res) {
	var catmenu = req.catmenu ;
	Catmenu.remove({'nombre': 'Menu sin nombre'});

	catmenu.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(catmenu);
		}
	});
};

/**
 * List of Catmenus
 */
exports.list = function(req, res) {
		Catmenu.find({'nombre': {$ne: 'Menu sin nombre'} }).sort('-created').populate('user', 'displayName').exec(function(err, catmenus) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(catmenus);
			}
		});
};

/**
 * Catmenu middleware
 */
exports.catmenuByID = function(req, res, next, id) {
 		Catmenu.findById(id)
 		.populate('user', 'displayName')
 		.populate('programas')
 		.exec(function(err, catmenu) {
		if (err) return next(err);
		if (! catmenu) return next(new Error('Failed to load Catmenu ' + id));
		req.catmenu = catmenu ;
		next();
	});
};

/**
 * Catmenu authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.catmenu.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
