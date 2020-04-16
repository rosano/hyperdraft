/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const OLSKTesting = require('OLSKTesting');

var controllerModule = require('./controller.js');

describe('OLSKControllerRoutes', function test_OLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCRouteAPIRoot: {
				OLSKRoutePath: '/api/',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionAPIRoot,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAuthenticate',
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIToken: {
				OLSKRoutePath: '/api/token',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionAPIToken,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAuthenticate',
				],
			},
		});
	});

});

describe('OLSKControllerSharedMiddlewares', function test_OLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(controllerModule.OLSKControllerSharedMiddlewares(), {
			KVCSharedMiddlewareAPIAuthenticate: controllerModule.WKCAPIMiddlewareAuthenticate,
		});
	});

});

describe.skip('WKCAPIMiddlewareAuthenticate', function test_WKCAPIMiddlewareAuthenticate() {

	it('returns next(WKCAPIClientError) without header', function() {
		assert.deepEqual(controllerModule.WKCAPIMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForHeaders(), OLSKTesting.OLSKTestingFakeResponseForJSON(), OLSKTesting.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) without token', function() {
		assert.deepEqual(controllerModule.WKCAPIMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForHeaders({
			'x-client-key': null,
		}), OLSKTesting.OLSKTestingFakeResponseForJSON(), OLSKTesting.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with blank token', function() {
		assert.deepEqual(controllerModule.WKCAPIMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForHeaders({
			'x-client-key': '',
		}), OLSKTesting.OLSKTestingFakeResponseForJSON(), OLSKTesting.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with whitespace token', function() {
		assert.deepEqual(controllerModule.WKCAPIMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForHeaders({
			'x-client-key': ' ',
		}), OLSKTesting.OLSKTestingFakeResponseForJSON(), OLSKTesting.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with wrong token', function() {
		assert.deepEqual(controllerModule.WKCAPIMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForHeaders({
			'x-client-key': 'password',
		}), OLSKTesting.OLSKTestingFakeResponseForJSON(), OLSKTesting.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotValid'));
	});

	it('returns next(undefined)', function() {
		assert.strictEqual(controllerModule.WKCAPIMiddlewareAuthenticate(OLSKTesting.OLSKTestingFakeRequestForHeaders({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), OLSKTesting.OLSKTestingFakeResponseForJSON(), OLSKTesting.OLSKTestingFakeNext()), 'RETURNED_UNDEFINED');
	});

});

describe('OLSKControllerSharedErrorHandlers', function test_OLSKControllerSharedErrorHandlers() {

	it('returns middleware functions', function() {
		assert.deepEqual(controllerModule.OLSKControllerSharedErrorHandlers(), [
			controllerModule.WKCAPIErrorHandler,
		]);
	});

});

describe.skip('WKCAPIErrorHandler', function test_WKCAPIErrorHandler() {

	it('returns WKCAPISystemError for WKCAPISystemError', function() {
		var res = OLSKTesting.OLSKTestingFakeResponseForStatus();
		assert.deepEqual(controllerModule.WKCAPIErrorHandler(new Error('WKCAPISystemErrorAlpha'), {}, res), {
			WKCAPISystemError: 'WKCAPISystemErrorAlpha',
		});
		assert.strictEqual(res.statusCode, 500);
	});

	it('returns WKCAPIClientError for WKCAPIClientError', function() {
		var res = OLSKTesting.OLSKTestingFakeResponseForStatus();
		assert.deepEqual(controllerModule.WKCAPIErrorHandler(new Error('WKCAPIClientErrorAlpha'), {}, res), {
			WKCAPIClientError: 'WKCAPIClientErrorAlpha',
		});
		assert.strictEqual(res.statusCode, 500);
	});

	it('sets statusCode to 401 WKCAPIClientErrorAuthentication*', function() {
		var res = OLSKTesting.OLSKTestingFakeResponseForStatus();
		controllerModule.WKCAPIErrorHandler(new Error('WKCAPIClientErrorAuthenticationAlfa'), {}, res);
		assert.strictEqual(res.statusCode, 401);
	});

	it('returns next(error) for Error', function() {
		var item = new Error('alpha');
		assert.deepEqual(controllerModule.WKCAPIErrorHandler(item, {}, OLSKTesting.OLSKTestingFakeResponseForStatus(), function(inputData) {
			return inputData;
		}), item);
	});

});

describe.skip('WKCActionAPIRoot', function test_WKCActionAPIRoot() {

	it('returns confirmation authenticated', function() {
		assert.deepEqual(controllerModule.WKCActionAPIRoot(OLSKTesting.OLSKTestingFakeRequestForHeaders({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), OLSKTesting.OLSKTestingFakeResponseForJSON()), {
			WKCAPIResponse: 'Successfully authenticated',
		});
	});

});

describe.skip('WKCActionAPIToken', function test_WKCActionAPIToken() {

	it('returns access token', function() {
		assert.deepEqual(controllerModule.WKCActionAPIToken(OLSKTesting.OLSKTestingFakeRequestForHeaders(), OLSKTesting.OLSKTestingFakeResponseForJSON()), {
			WKCAPIToken: process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		});
	});

});
