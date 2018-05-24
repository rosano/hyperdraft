/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var apiController = require('./controller');

var WKCAPIFakeRequest = function(inputData = {}) {
	return {
		headers: Object.assign({}, inputData),
	};
};

var WKCAPIFakeResponse = function() {
	return {
		json: function(e) {
			return e;
		},
	};
};

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

	var fakeNext = function(inputData) {
		return typeof inputData === 'undefined' ? 'RETURNED_UNDEFINED' : inputData;
	};

	it('returns next(WKCAPIClientError) without header', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCAPIFakeRequest(), WKCAPIFakeResponse(), fakeNext), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) without token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCAPIFakeRequest({
			'x-client-key': null,
		}), WKCAPIFakeResponse(), fakeNext), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with blank token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCAPIFakeRequest({
			'x-client-key': '',
		}), WKCAPIFakeResponse(), fakeNext), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with whitespace token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCAPIFakeRequest({
			'x-client-key': ' ',
		}), WKCAPIFakeResponse(), fakeNext), new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with wrong token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCAPIFakeRequest({
			'x-client-key': 'password',
		}), WKCAPIFakeResponse(), fakeNext), new Error('WKCAPIClientErrorAuthenticationTokenNotValid'));
	});

	it('returns next(undefined) with correct token', function() {
		assert.strictEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCAPIFakeRequest({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), WKCAPIFakeResponse(), fakeNext), 'RETURNED_UNDEFINED');
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

	var fakeResponse = function() {
		var res = Object.assign(WKCAPIFakeResponse(), {
			status: function(inputData) {
				res.statusCode = inputData;
				return;
			},
		});

		return res;
	};

	it('returns WKCAPISystemError for WKCAPISystemError', function() {
		var res = fakeResponse();
		assert.deepEqual(apiController.WKCAPIErrorHandler(new Error('WKCAPISystemErrorAlpha'), {}, res), {
			WKCAPISystemError: 'WKCAPISystemErrorAlpha',
		});
		assert.strictEqual(res.statusCode, 500);
	});

	it('returns WKCAPIClientError for WKCAPIClientError', function() {
		var res = fakeResponse();
		assert.deepEqual(apiController.WKCAPIErrorHandler(new Error('WKCAPIClientErrorAlpha'), {}, res), {
			WKCAPIClientError: 'WKCAPIClientErrorAlpha',
		});
		assert.strictEqual(res.statusCode, 500);
	});

	it('sets statusCode to 401 WKCAPIClientErrorAuthentication*', function() {
		var res = fakeResponse();
		apiController.WKCAPIErrorHandler(new Error('WKCAPIClientErrorAuthenticationAlfa'), {}, res);
		assert.strictEqual(res.statusCode, 401);
	});

	it('returns next(error) for Error', function() {
		var item = new Error('alpha');
		assert.deepEqual(apiController.WKCAPIErrorHandler(item, {}, fakeResponse(), function(inputData) {
			return inputData;
		}), item);
	});

});

describe('WKCActionAPIRoot', function testWKCActionAPIRoot() {

	it('returns confirmation authenticated', function() {
		assert.deepEqual(apiController.WKCActionAPIRoot(WKCAPIFakeRequest({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), WKCAPIFakeResponse()), {
			WKCAPIResponse: 'Successfully authenticated',
		});
	});

});

describe('WKCActionAPIToken', function testWKCActionAPIToken() {

	it('returns access token', function() {
		assert.deepEqual(apiController.WKCActionAPIToken(WKCAPIFakeRequest(), WKCAPIFakeResponse()), {
			WKCAPIToken: process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		});
	});

});
