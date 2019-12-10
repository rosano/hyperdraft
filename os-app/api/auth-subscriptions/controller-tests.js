/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var controllerModule = require('./controller.js');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCRouteAPISubscriptionsCreate: {
				OLSKRoutePath: '/api/subscriptions',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: controllerModule.WKCActionAPISubscriptionsCreate,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPISubscriptionsRead: {
				OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionAPISubscriptionsRead,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPISubscriptionsUpdate: {
				OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: controllerModule.WKCActionAPISubscriptionsUpdate,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPISubscriptionsDelete: {
				OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
				OLSKRouteMethod: 'delete',
				OLSKRouteFunction: controllerModule.WKCActionAPISubscriptionsDelete,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPISubscriptionsSearch: {
				OLSKRoutePath: '/api/subscriptions/search',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionAPISubscriptionsSearch,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPISubscriptionsFetch: {
				OLSKRoutePath: '/api/subscriptions/fetch',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: controllerModule.WKCActionAPISubscriptionsFetch,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});
