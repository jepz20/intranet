'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Catmenu Schema
 */
var CatmenuSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Porfavor llene el nombre del menu',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	programas: [{
		type: Schema.ObjectId,
		ref: 'Programa'
	}]
});

mongoose.model('Catmenu', CatmenuSchema);
