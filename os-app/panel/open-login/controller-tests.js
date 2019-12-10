/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const OLSKTesting = require('OLSKTesting');

const mainModule = require('./controller.js');
const sharedController = require('../../_shared/common/controller.js');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(mainModule.OLSKControllerRoutes(), {
			WKCLoginRoute: {
				OLSKRoutePath: '/login',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: mainModule.WKCLoginAction,
				OLSKRouteLanguages: ['en'],
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareEnsureDatabase',
				],
			},
			WKCLoginSubmitRoute: {
				OLSKRoutePath: '/login',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: mainModule.WKCLoginSubmitAction,
				OLSKRouteLanguages: ['en'],
			},
			WKCLoginDestroyRoute: {
				OLSKRoutePath: '/logout',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: mainModule.WKCLoginDestroyAction,
				OLSKRouteLanguages: ['en'],
			},
		});
	});

});

describe('OLSKControllerSharedMiddlewares', function testOLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(mainModule.OLSKControllerSharedMiddlewares(), {
			KVCSharedMiddlewareAuthenticate: [
				sharedController.KVCSharedMiddlewareEnsureDatabase,
				mainModule.WKCLoginMiddlewareAuthenticate,
			],
		});
	});

});

describe('WKCLoginMiddlewareAuthenticate', function testWKCLoginMiddlewareAuthenticate() {

	it('redirects to login without session data', function() {
		assert.deepEqual(mainModule.WKCLoginMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForSession(), OLSKTesting.OLSKTestingFakeResponseForRedirect()), mainModule.OLSKControllerRoutes().WKCLoginRoute.OLSKRoutePath);
	});

	it('redirects to login without token', function() {
		assert.deepEqual(mainModule.WKCLoginMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: null,
		}), OLSKTesting.OLSKTestingFakeResponseForRedirect()), mainModule.OLSKControllerRoutes().WKCLoginRoute.OLSKRoutePath);
	});

	it('redirects to login with blank token', function() {
		assert.deepEqual(mainModule.WKCLoginMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: '',
		}), OLSKTesting.OLSKTestingFakeResponseForRedirect()), mainModule.OLSKControllerRoutes().WKCLoginRoute.OLSKRoutePath);
	});

	it('redirects to login with whitespace token', function() {
		assert.deepEqual(mainModule.WKCLoginMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: ' ',
		}), OLSKTesting.OLSKTestingFakeResponseForRedirect()), mainModule.OLSKControllerRoutes().WKCLoginRoute.OLSKRoutePath);
	});

	it('returns next(undefined) with any token', function() {
		assert.deepEqual(mainModule.WKCLoginMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: 'alpha',
		}), OLSKTesting.OLSKTestingFakeResponseForRedirect(), OLSKTesting.OLSKTestingFakeNext()), 'RETURNED_UNDEFINED');
	});

	it('passes original url to login page', function() {
		assert.deepEqual(mainModule.WKCLoginMiddlewareAuthenticate(Object.assign(OLSKTesting.OLSKTestingFakeRequestForSession({
			WKCInsecureSessionToken: ' ',
		}), {
			originalUrl: '/alfa'
		}), OLSKTesting.OLSKTestingFakeResponseForRedirect()), mainModule.OLSKControllerRoutes().WKCLoginRoute.OLSKRoutePath + '?returnPath=%2Falfa');
	});

});
