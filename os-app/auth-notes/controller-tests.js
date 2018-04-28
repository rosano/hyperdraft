/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var notesController = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes () {
	
	it('returns route objects', function () {
		assert.deepEqual(notesController.OLSKControllerRoutes(), {
			WKCRouteNotes: {
				OLSKRoutePath: '/notes',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: notesController.index,
				OLSKRouteLanguages: ['en'],
			},
		});
	});

});
