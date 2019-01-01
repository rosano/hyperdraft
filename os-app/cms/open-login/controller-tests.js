/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var testingLibrary = require('OLSKTesting');

var controllerModule = require('./controller');
var sharedController = require('../../_shared/controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCRouteLogin: {
				OLSKRoutePath: '/login',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCLoginAction,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareEnsureDatabase',
				],
			},
			WKCLoginSubmitRoute: {
				OLSKRoutePath: '/login',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: controllerModule.WKCLoginSubmitAction,
				OLSKRouteLanguages: ['en'],
			},
			WKCLoginDestroyRoute: {
				OLSKRoutePath: '/logout',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCLoginDestroyAction,
				OLSKRouteLanguages: ['en'],
			},
		});
	});

});

describe('OLSKControllerSharedMiddlewares', function testOLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(controllerModule.OLSKControllerSharedMiddlewares(), {
			WKCSharedMiddlewareAuthenticate: [
				sharedController.WKCSharedMiddlewareEnsureDatabase,
				controllerModule.WKCLoginMiddlewareAuthenticate,
			],
		});
	});

});

describe('WKCLoginMiddlewareAuthenticate', function testWKCLoginMiddlewareAuthenticate() {

	it('redirects to login without session data', function() {
		assert.deepEqual(controllerModule.WKCLoginMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForSession(), testingLibrary.OLSKTestingFakeResponseForRedirect()), controllerModule.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	});

	it('redirects to login without token', function() {
		assert.deepEqual(controllerModule.WKCLoginMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: null,
		}), testingLibrary.OLSKTestingFakeResponseForRedirect()), controllerModule.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	});

	it('redirects to login with blank token', function() {
		assert.deepEqual(controllerModule.WKCLoginMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: '',
		}), testingLibrary.OLSKTestingFakeResponseForRedirect()), controllerModule.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	});

	it('redirects to login with whitespace token', function() {
		assert.deepEqual(controllerModule.WKCLoginMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: ' ',
		}), testingLibrary.OLSKTestingFakeResponseForRedirect()), controllerModule.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	});

	it('returns next(undefined) with any token', function() {
		assert.deepEqual(controllerModule.WKCLoginMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: 'alpha',
		}), testingLibrary.OLSKTestingFakeResponseForRedirect(), testingLibrary.OLSKTestingFakeNext()), 'RETURNED_UNDEFINED');
	});

	it('passes original url to login page', function() {
		assert.deepEqual(controllerModule.WKCLoginMiddlewareAuthenticate(Object.assign(testingLibrary.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: ' ',
		}), {
			originalUrl: '/alfa'
		}), testingLibrary.OLSKTestingFakeResponseForRedirect()), controllerModule.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath + '?returnPath=%2Falfa');
	});

});
