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

describe('WKCWriteAction', function testWKCWriteAction() {

	it('renders page', function() {
		assert.strictEqual(mainModule.WKCWriteAction(null, OLSKTesting.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		})), [
			__dirname,
			'view',
		].join('/'));
	});

	it('returns pageData', function() {
		assert.deepEqual(mainModule.WKCWriteAction(null, OLSKTesting.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			return pageData;
		})), {});
	});

});
