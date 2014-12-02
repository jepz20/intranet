'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Programa Schema
 */
var ProgramaSchema = new Schema({
	nombre: {
		type: String,		
		required: 'Favor llene el nombre del programa',
		trim: true
	},
    url: {
        type: String,
        required: 'Favor llene la direccion del programa',
        trim: true
    },
    icono: {
        type: String,
        trim: true,
        default: ''
    },
    veces_usado: {
        type: Number,
        default: 0
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    grupo: {
        type: Schema.ObjectId,
        ref: 'Grupo'
    }
});

mongoose.model('Programa', ProgramaSchema);