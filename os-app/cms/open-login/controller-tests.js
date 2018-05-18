/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var loginController = require('./controller');
var sharedController = require('../../_shared/controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(loginController.OLSKControllerRoutes(), {
			WKCRouteLogin: {
				OLSKRoutePath: '/login',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: loginController.WKCActionLoginIndex,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareEnsureDatabase',
				],
			},
			WKCRouteLoginSubmit: {
				OLSKRoutePath: '/login',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: loginController.WKCActionLoginSubmit,
				OLSKRouteLanguages: ['en'],
			},
			WKCRouteLoginDestroy: {
				OLSKRoutePath: '/logout',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: loginController.WKCActionLoginDestroy,
				OLSKRouteLanguages: ['en'],
			},
		});
	});

});

describe('OLSKControllerSharedMiddlewares', function testOLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(loginController.OLSKControllerSharedMiddlewares(), {
			WKCSharedMiddlewareAuthenticate: [
				sharedController.WKCSharedMiddlewareEnsureDatabase,
				loginController.WKCLoginMiddlewareAuthenticate,
			],
		});
	});

});

describe('WKCLoginMiddlewareAuthenticate', function testWKCLoginMiddlewareAuthenticate() {

	var fakeRequest = function(inputData = {}) {
		return {
			session: Object.assign({}, inputData),
		};
	};

	var fakeResponse = function() {
		return {
			redirect: function(inputData) {
				return inputData;
			}
		};
	};

	var fakeNext = function(inputData) {
		return typeof inputData === 'undefined' ? 'RETURNED_UNDEFINED' : inputData;
	};

	it('redirects to login without session data', function() {
		assert.deepEqual(loginController.WKCLoginMiddlewareAuthenticate(fakeRequest(), fakeResponse()), loginController.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	});

	it('redirects to login without token', function() {
		assert.deepEqual(loginController.WKCLoginMiddlewareAuthenticate(fakeRequest({
			WKCInsecureSessionToken: null,
		}), fakeResponse()), loginController.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	});

	it('redirects to login with blank token', function() {
		assert.deepEqual(loginController.WKCLoginMiddlewareAuthenticate(fakeRequest({
			WKCInsecureSessionToken: '',
		}), fakeResponse()), loginController.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	});

	it('redirects to login with whitespace token', function() {
		assert.deepEqual(loginController.WKCLoginMiddlewareAuthenticate(fakeRequest({
			WKCInsecureSessionToken: ' ',
		}), fakeResponse()), loginController.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	});

	it('returns next(undefined) with any token', function() {
		assert.deepEqual(loginController.WKCLoginMiddlewareAuthenticate(fakeRequest({
			WKCInsecureSessionToken: 'alpha',
		}), fakeResponse(), fakeNext), 'RETURNED_UNDEFINED');
	});

});
