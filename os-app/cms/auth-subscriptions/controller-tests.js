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
			WKCRouteSubscriptions: {
				OLSKRoutePath: '/cms/subscriptions',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: notesController.WKCActionSubscriptionsIndex,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAuthenticate',
				],
			},
		});
	});

});

describe('WKCActionSubscriptionsIndex', function testWKCActionSubscriptionsIndex() {

	it('renders page', function() {
		assert.strictEqual(notesController.WKCActionSubscriptionsIndex(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		})), [
			__dirname,
			'index',
		].join('/'));
	});

	it('returns pageData', function() {
		assert.deepEqual(notesController.WKCActionSubscriptionsIndex(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			return pageData;
		})), {});
	});

});
