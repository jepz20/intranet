'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Programa = mongoose.model('Programa'),
    fs = require('fs'),
    path = require('path'),
    Busboy = require('busboy'),
    os = require('os'),
    inspect = require('util').inspect,
    im = require('imagemagick'),
	_ = require('lodash');

/**
 * Create a Programa
 */
exports.create = function(req, res) {
	var programa = new Programa(req.body);
	programa.user = req.user;
    if (programa.icono)
        if (programa.icono.length > 0)
            programa.icono = programa._id + '.' + programa.icono;

	programa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * Show the current Programa
 */
exports.read = function(req, res) {
	res.jsonp(req.programa);
};

/**
 * Update a Programa
 */
exports.update = function(req, res) {
	var programa = req.programa ;

	programa = _.extend(programa , req.body);

	programa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * Delete an Programa
 */
exports.delete = function(req, res) {
	var programa = req.programa ;

	programa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * List of Programas
 */
exports.list = function(req, res) { Programa.find().sort('-created').populate('user', 'displayName').populate('grupo').exec(function(err, programas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programas);
		}
	});
};

/**
 * Programa middleware
 */
exports.programaByID = function(req, res, next, id) { Programa.findById(id).populate('user', 'displayName').populate('grupo').exec(function(err, programa) {
		if (err) return next(err);
		if (! programa) return next(new Error('No se pudo cargar el programa ' + id));
		req.programa = programa ;
		next();
	});
};

/**
 * Programa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles.indexOf('admin') !== -1) {
		return res.status(403).send('Usuario no esta autorizado');
	}
	next();
};

/**
 *Carga la imagen y video del procedimiento ademas de hacer
 *un thumbnail de la imagen
 */
exports.uploadIcono = function (req, res) {
    var programaId = req.query.programaId;
    var newImagenName;
    if (req.files){
        if (req.files.length > 0) {
            var rootPath = path.normalize(__dirname + '/../..');
            rootPath = rootPath + '/public/modules/programas/img/';
            /*Guarda la imagen*/
            if (req.files.image) {
                if (req.files.image.size !== 0) {
                    var imagen = req.files.image;
                    var imagenName = imagen.name;
                    newImagenName = programaId ;
                    var newPathImagen = rootPath + newImagenName;
                    console.log(newPathImagen);
                    fs.readFile(imagen.path, function (err, data) {
                        /// If there's an error
                        if(!imagenName){
                            console.log('There was an error');
                            res.send('Nose se guardo la imagen');
                        } else {
                            /// write file to uploads/fullsize folder
                            fs.writeFile(newPathImagen, data);
                        }
                    });
                } else {
                    newImagenName = '';
                }
            } else {
                console.log('no venian imagenes');
            }

            var responseObj = {
                imagenUrl: newImagenName
            };
            res.send(JSON.stringify(responseObj));
        } else {
            console.log('no venia nada');
        }
    }
    else {
        console.log('no hay nada');
        res.send({ msg: 'No existia el archivo ' + new Date().toString() });
    }
};


exports.agregarArchivos = function (req,res,next) {
    var nombreIcono = req.query.nombreIcono;
    var busboy = new Busboy({ headers: req.headers, limits: {
        fileSize: 5*1024*1024
    }});
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var rootPath = path.normalize(__dirname + '/../..');
        rootPath = rootPath + '/public/modules/programas/img/';
        if (fieldname === 'image') {
            var newPathImagen = rootPath + nombreIcono;
            console.log(newPathImagen);
            file.pipe(fs.createWriteStream(newPathImagen));
            var responseObj = {
                imagenUrl: nombreIcono
            };
            file.on('end', function() {
               fs.readFile(newPathImagen, function (err, data) {
                    /// If there's an error
                    if(!data){
                        console.log('There was an error');
                        res.send('Nose se guardo la imagen');
                    } else {
                        im.resize({
                            srcPath: newPathImagen,
                            dstPath: newPathImagen,
                            width:   '72!',
                            height:   '72!'
                        }, function(err){
                            if (err) throw err;
                        });
                    }
                });
            });
            res.send(JSON.stringify(responseObj));
        }
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.end();
    });
    req.pipe(busboy);
};
