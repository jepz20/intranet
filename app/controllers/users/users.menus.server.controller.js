'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * List of Catmenus
 */
exports.list = function(req, res) {
    var sort = {}; //campo para hacer el sort, en caso de vacio por fecha de creacion
    var limite = 99999; //cuantos datos devolvera
    var query = {}; //El query por el que se filtrara
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

    if (req.query.username) {
        query.$or = [];
        query.$or[0] = {};
        query.$or[1] = {};
        query.$or[0].username = {};
        query.$or[0].username.$regex = new RegExp(req.query.username,'gi');
        query.$or[1].displayName = {};
        query.$or[1].displayName.$regex = new RegExp(req.query.username,'gi');
        campos = {'username': 1 , 'displayName': 1};
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

    console.log('query');
    console.log(query);
    User.find(query,campos)
    .sort(sort)
    .limit(limite)
    .exec(function(err, usuarios) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(usuarios);
        }
    });
};

exports.asignarMenuAUsuario = function(req,res,next) {
    var datos = req.body;
    console.log(datos);
    User.findById(datos.usuario).exec(function(err,usuario) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        usuario.menu = datos.menu;
        usuario.save(function(usuario) {
            res.send(usuario);
        });
    });
};
