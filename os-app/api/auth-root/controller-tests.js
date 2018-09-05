/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

var apiController = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(apiController.OLSKControllerRoutes(), {
			WKCRouteAPIRoot: {
				OLSKRoutePath: '/api/',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: apiController.WKCActionAPIRoot,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIToken: {
				OLSKRoutePath: '/api/token',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: apiController.WKCActionAPIToken,
			},
		});
	});

});

describe('OLSKControllerSharedMiddlewares', function testOLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(apiController.OLSKControllerSharedMiddlewares(), {
			WKCSharedMiddlewareAPIAuthenticate: apiController.WKCAPIMiddlewareAuthenticate,
		});
	});

});

describe('WKCAPIMiddlewareAuthenticate', function testWKCAPIMiddlewareAuthenticate() {

	it('returns next(WKCAPIClientError) without header', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForHeaders(), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) without token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForHeaders({
			'x-client-key': null,
		}), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with blank token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForHeaders({
			'x-client-key': '',
		}), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with whitespace token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForHeaders({
			'x-client-key': ' ',
		}), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with wrong token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForHeaders({
			'x-client-key': 'password',
		}), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorAuthenticationTokenNotValid'));
	});

	it('returns next(undefined)', function() {
		assert.strictEqual(apiController.WKCAPIMiddlewareAuthenticate(testingLibrary.OLSKTestingFakeRequestForHeaders({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), 'RETURNED_UNDEFINED');
	});

});

describe('OLSKControllerSharedErrorHandlers', function testOLSKControllerSharedErrorHandlers() {

	it('returns middleware functions', function() {
		assert.deepEqual(apiController.OLSKControllerSharedErrorHandlers(), [
			apiController.WKCAPIErrorHandler,
		]);
	});

});

describe('WKCAPIErrorHandler', function testWKCAPIErrorHandler() {

	it('returns WKCAPISystemError for WKCAPISystemError', function() {
		var res = testingLibrary.OLSKTestingFakeResponseForStatus();
		assert.deepEqual(apiController.WKCAPIErrorHandler(new Error('WKCAPISystemErrorAlpha'), {}, res), {
			WKCAPISystemError: 'WKCAPISystemErrorAlpha',
		});
		assert.strictEqual(res.statusCode, 500);
	});

	it('returns WKCAPIClientError for WKCAPIClientError', function() {
		var res = testingLibrary.OLSKTestingFakeResponseForStatus();
		assert.deepEqual(apiController.WKCAPIErrorHandler(new Error('WKCAPIClientErrorAlpha'), {}, res), {
			WKCAPIClientError: 'WKCAPIClientErrorAlpha',
		});
		assert.strictEqual(res.statusCode, 500);
	});

	it('sets statusCode to 401 WKCAPIClientErrorAuthentication*', function() {
		var res = testingLibrary.OLSKTestingFakeResponseForStatus();
		apiController.WKCAPIErrorHandler(new Error('WKCAPIClientErrorAuthenticationAlfa'), {}, res);
		assert.strictEqual(res.statusCode, 401);
	});

	it('returns next(error) for Error', function() {
		var item = new Error('alpha');
		assert.deepEqual(apiController.WKCAPIErrorHandler(item, {}, testingLibrary.OLSKTestingFakeResponseForStatus(), function(inputData) {
			return inputData;
		}), item);
	});

});

describe('WKCActionAPIRoot', function testWKCActionAPIRoot() {

	it('returns confirmation authenticated', function() {
		assert.deepEqual(apiController.WKCActionAPIRoot(testingLibrary.OLSKTestingFakeRequestForHeaders({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), testingLibrary.OLSKTestingFakeResponseForJSON()), {
			WKCAPIResponse: 'Successfully authenticated',
		});
	});

});

describe('WKCActionAPIToken', function testWKCActionAPIToken() {

	it('returns access token', function() {
		assert.deepEqual(apiController.WKCActionAPIToken(testingLibrary.OLSKTestingFakeRequestForHeaders(), testingLibrary.OLSKTestingFakeResponseForJSON()), {
			WKCAPIToken: process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		});
	});

});
