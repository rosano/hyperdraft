/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var testingLibrary = require('OLSKTesting');

var controllerModule = require('./controller');
var apiSubscriptionsModel = require('../../api/auth-subscriptions/model');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCReadRoute: {
				OLSKRoutePath: '/cms/read',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCReadAction,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAuthenticate',
				],
			},
		});
	});

});

describe('WKCReadAction', function testWKCReadAction() {

	it('renders page', function() {
		assert.strictEqual(controllerModule.WKCReadAction(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		})), [
			__dirname,
			'view',
		].join('/'));
	});

	it('returns pageData', function() {
		assert.deepEqual(controllerModule.WKCReadAction(null, testingLibrary.OLSKTestingFakeResponseForRender(function(viewPath, pageData) {
			return pageData;
		})), {
			OLSKPagePublicConstants: {
				WKCSubscriptionHandlerFeedRSS: apiSubscriptionsModel.WKCSubscriptionHandlerFeedRSS(),
				WKCSubscriptionHandlerFeedAtom: apiSubscriptionsModel.WKCSubscriptionHandlerFeedAtom(),
				WKCSubscriptionHandlerFile: apiSubscriptionsModel.WKCSubscriptionHandlerFile(),
				WKCSubscriptionHandlerPage: apiSubscriptionsModel.WKCSubscriptionHandlerPage(),
				WKCSubscriptionHandlerCustomTwitter: apiSubscriptionsModel.WKCSubscriptionHandlerCustomTwitter(),
			},
		});
	});

});
