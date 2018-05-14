/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var apiController = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(apiController.OLSKControllerRoutes(), {
			WKCRouteAPIRoot: {
				OLSKRoutePath: '/api/',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: apiController.WKCAPIRoot,
			},
			WKCRouteAPINotesAdd: {
				OLSKRoutePath: '/api/notes',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: apiController.index,
			},
		});
	});

});
