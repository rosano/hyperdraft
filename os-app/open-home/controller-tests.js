/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var testingLibrary = require('OLSKTesting');

var controllerModule = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCRouteHome: {
				OLSKRoutePath: '/',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionHomeIndex,
				OLSKRouteLanguages: ['en'],
			},
			WKCRouteRefsRead: {
				OLSKRoutePath: '/:wkc_note_public_id(\\d+)',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionRefsRead,
			},
		});
	});

});
