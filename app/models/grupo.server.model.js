'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grupo Schema
 */
var GrupoSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Favor llenar el nombre del grupo',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
    padre: {
        type: Schema.ObjectId,
        ref: 'Grupo'
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Grupo', GrupoSchema);
