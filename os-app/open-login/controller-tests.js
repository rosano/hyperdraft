/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var loginController = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(loginController.OLSKControllerRoutes(), {
			WKCRouteLogin: {
				OLSKRoutePath: '/login',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: loginController.index,
				OLSKRouteLanguages: ['en'],
			},
			WKCRouteLoginSubmit: {
				OLSKRoutePath: '/login',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: loginController.submit,
				OLSKRouteLanguages: ['en'],
			},
			WKCRouteLoginDestroy: {
				OLSKRoutePath: '/logout',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: loginController.destroy,
				OLSKRouteLanguages: ['en'],
			},
		});
	});

});
