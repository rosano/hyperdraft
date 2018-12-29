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

describe('OLSKControllerSharedMiddlewares', function testOLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(controllerModule.OLSKControllerSharedMiddlewares(), {
			WKCSubscribeMiddlewareIgnoreJSMap: controllerModule.WKCSubscribeMiddlewareIgnoreJSMap,
		});
	});

});

describe('WKCSubscribeMiddlewareIgnoreJSMap', function testWKCSubscribeMiddlewareIgnoreJSMap() {

	it('returns status 200', function() {
		var res = testingLibrary.OLSKTestingFakeResponseForStatus();
		controllerModule.WKCSubscribeMiddlewareIgnoreJSMap(Object.assign(testingLibrary.OLSKTestingFakeRequest(), {
			originalUrl: '/alfa.js.map',
		}), res, testingLibrary.OLSKTestingFakeNext());
		// assert.deepEqual(, 'hello');
		assert.strictEqual(res.statusCode, 200);
	});

	it('returns next(undefined)', function() {
		assert.deepEqual(controllerModule.WKCSubscribeMiddlewareIgnoreJSMap(Object.assign(testingLibrary.OLSKTestingFakeRequest(), {
			originalUrl: '/alfa.js',
		}), testingLibrary.OLSKTestingFakeResponseForStatus(), testingLibrary.OLSKTestingFakeNext()), 'RETURNED_UNDEFINED');
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
				WKCSubscriptionTypeFeedRSS: apiSubscriptionsModel.WKCSubscriptionTypeFeedRSS(),
				WKCSubscriptionTypeFeedAtom: apiSubscriptionsModel.WKCSubscriptionTypeFeedAtom(),
				WKCSubscriptionTypeFile: apiSubscriptionsModel.WKCSubscriptionTypeFile(),
				WKCSubscriptionTypePage: apiSubscriptionsModel.WKCSubscriptionTypePage(),
			},
		});
	});

});
