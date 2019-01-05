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
			WKCWriteRoute: {
				OLSKRoutePath: '/panel/write',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCWriteAction,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAuthenticate',
				],
			},
			WKCWriteLegacyRoute: {
				OLSKRoutePath: '/panel',
				OLSKRouteMethod: 'get',
				OLSKRouteRedirect: '/panel/write',
			},
		});
	});

});

describe('WKCWriteAction', function testWKCWriteAction() {

	it('renders page', function() {
		assert.strictEqual(controllerModule.WKCWriteAction(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		})), [
			__dirname,
			'view',
		].join('/'));
	});

	it('returns pageData', function() {
		assert.deepEqual(controllerModule.WKCWriteAction(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			return pageData;
		})), {});
	});

});
