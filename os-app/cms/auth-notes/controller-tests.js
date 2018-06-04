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
			WKCRouteNotes: {
				OLSKRoutePath: '/notes',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: notesController.WKCActionNotesIndex,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAuthenticate',
				],
			},
		});
	});

});

describe('WKCActionNotesIndex', function testWKCActionNotesIndex() {

	it('renders page', function() {
		assert.strictEqual(notesController.WKCActionNotesIndex(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		})), [
			__dirname,
			'index',
		].join('/'));
	});

	it('returns pageData', function() {
		assert.deepEqual(notesController.WKCActionNotesIndex(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			return pageData;
		})), {});
	});

});
