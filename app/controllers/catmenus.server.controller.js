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
	var sort = {}; //campo para hacer el sort, en caso de vacio por fecha de creacion
    var limite = 99999; //cuantos datos devolvera
    var query = {}; //El query por el que se filtrara
    var nombreConsulta;
    var campos = {};
   //busca si envio parametro para sort
    if (req.query.sort) {
		if (req.query.tipoSort) {
			sort[req.query.sort] = req.query.tipoSort;
		} else {
			sort[req.query.sort] = 1;
		}
    } else {
		sort.created = -1;
	}

    //determina si envio limite de envio
    if (req.query.limite) {
        limite= req.query.limite;
    }

	//El query

    if (req.query.nombre) {
		query.nombre = {};
    	query.nombre.$regex = new RegExp(req.query.nombre,'gi');
        campos = {};
    }

        //determina si se envio un query
    if (req.query.campoQ && req.query.valorQ) {
        //si quisieran mandar un 1 = 1 que no agregue los campos
        if (req.query.campoQ.toString() !== req.query.valorQ.toString()) {
            if (req.query.valorQ instanceof Array) {

            	query[req.query.campoQ] = {};
            	query[req.query.campoQ].$in = [];
            	query[req.query.campoQ].$in = req.query.valorQ;

            } else {
            	query[req.query.campoQ] = req.query.valorQ;
            }
        }
    }

    if (!query.nombre) {
    	query.nombre = {};
    }

    query.nombre.$ne = 'Menu sin nombre' ;

	Catmenu.find(query,campos)
	.sort(sort)
    .limit(limite)
	.populate('user', 'displayName')
    .populate('programas')
	.exec(function(err, catmenus) {
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
