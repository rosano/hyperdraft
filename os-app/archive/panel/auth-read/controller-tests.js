/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const OLSKTesting = require('OLSKTesting');

var controllerModule = require('./controller.js');
var apiSubscriptionsModel = require('../../api/auth-subscriptions/model');

describe('OLSKControllerRoutes', function test_OLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCReadRoute: {
				OLSKRoutePath: '/panel/read',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCReadAction,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAuthenticate',
				],
			},
		});
	});

});
