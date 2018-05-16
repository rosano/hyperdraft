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
				OLSKRouteFunction: loginController.WKCActionLoginIndex,
				OLSKRouteLanguages: ['en'],
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
			WKCSharedMiddlewareAuthenticate: loginController.WKCLoginMiddlewareAuthenticate,
		});
	});

});

describe('WKCLoginMiddlewareAuthenticate', function testWKCLoginMiddlewareAuthenticate() {

	var fakeRequest = function(inputData = {}) {
		return {
			session: Object.assign({}, inputData),
		};
	};

	var fakeResponse = function(callback) {
		return {
			redirect: function(inputData) {
				return callback(inputData);
			}
		};
	};

	it('redirects to login without session data', function() {
		loginController.WKCLoginMiddlewareAuthenticate(fakeRequest(), fakeResponse(function(inputData) {
			assert.deepEqual(inputData, loginController.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
		}));
	});

	it('redirects to login without token', function() {
		loginController.WKCLoginMiddlewareAuthenticate(fakeRequest({
			WKCInsecureSessionToken: null,
		}), fakeResponse(function(inputData) {
			assert.deepEqual(inputData, loginController.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
		}));
	});

	it('redirects to login with blank token', function() {
		loginController.WKCLoginMiddlewareAuthenticate(fakeRequest({
			WKCInsecureSessionToken: '',
		}), fakeResponse(function(inputData) {
			assert.deepEqual(inputData, loginController.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
		}));
	});

	it('redirects to login with whitespace token', function() {
		loginController.WKCLoginMiddlewareAuthenticate(fakeRequest({
			WKCInsecureSessionToken: ' ',
		}), fakeResponse(function(inputData) {
			assert.deepEqual(inputData, loginController.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
		}));
	});

	it('calls next with any token', function() {
		loginController.WKCLoginMiddlewareAuthenticate(fakeRequest({
			WKCInsecureSessionToken: 'alpha',
		}), fakeResponse(), function() {
			assert.ok(true);
		});
	});

});
