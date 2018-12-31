/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

var controllerModule = require('./controller');
var apiSubscriptionsModel = require('../../api/auth-subscriptions/model');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCRouteSubscriptions: {
				OLSKRoutePath: '/cms/subscriptions',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionSubscriptionsIndex,
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
		assert.strictEqual(controllerModule.WKCActionSubscriptionsIndex(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		})), [
			__dirname,
			'index',
		].join('/'));
	});

	it('returns pageData', function() {
		assert.deepEqual(controllerModule.WKCActionSubscriptionsIndex(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			return pageData;
		})), {
			OLSKPagePublicConstants: {
				WKCSubscriptionHandlerFeedRSS: apiSubscriptionsModel.WKCSubscriptionHandlerFeedRSS(),
				WKCSubscriptionHandlerFeedAtom: apiSubscriptionsModel.WKCSubscriptionHandlerFeedAtom(),
				WKCSubscriptionHandlerFile: apiSubscriptionsModel.WKCSubscriptionHandlerFile(),
				WKCSubscriptionHandlerPage: apiSubscriptionsModel.WKCSubscriptionHandlerPage(),
			},
		});
	});

});
