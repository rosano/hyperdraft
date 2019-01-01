/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

var notesController = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(notesController.OLSKControllerRoutes(), {
			WKCWriteRoute: {
				OLSKRoutePath: '/cms/write',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: notesController.WKCWriteAction,
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
		assert.strictEqual(notesController.WKCWriteAction(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		})), [
			__dirname,
			'view',
		].join('/'));
	});

	it('returns pageData', function() {
		assert.deepEqual(notesController.WKCWriteAction(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			return pageData;
		})), {});
	});

});
