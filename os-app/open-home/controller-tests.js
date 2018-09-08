/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

var homeController = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(homeController.OLSKControllerRoutes(), {
			WKCRouteHome: {
				OLSKRoutePath: '/',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: homeController.WKCActionHomeIndex,
				OLSKRouteLanguages: ['en'],
			},
			WKCRouteRefsRead: {
				OLSKRoutePath: '/:wkc_note_public_id(\\d+)',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: homeController.WKCActionRefsRead,
			},
		});
	});

});

describe('WKCActionHomeIndex', function testWKCActionHomeIndex() {

	it('renders page', function() {
		homeController.WKCActionHomeIndex(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			assert.strictEqual(viewPath, [
				__dirname,
				'index',
				].join('/'));
		}));
	});

	it('returns pageData', function() {
		homeController.WKCActionHomeIndex(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			assert.deepEqual(pageData, {});
		}));
	});

});
