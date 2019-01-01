/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

var controllerModule = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCWriteRoute: {
				OLSKRoutePath: '/cms/write',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCWriteAction,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAuthenticate',
				],
			},
			WKCNotesLegacyRoute: {
				OLSKRoutePath: '/cms',
				OLSKRouteMethod: 'get',
				OLSKRouteRedirect: '/cms/write',
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
