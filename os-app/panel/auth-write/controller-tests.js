/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const OLSKTesting = require('OLSKTesting');

const mainModule = require('./controller.js');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(mainModule.OLSKControllerRoutes(), {
			WKCWriteRoute: {
				OLSKRoutePath: '/panel/write',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: mainModule.WKCWriteAction,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAuthenticate',
				],
			},
		});
	});

});
