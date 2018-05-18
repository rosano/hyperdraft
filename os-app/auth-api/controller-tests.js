/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var apiController = require('./controller');

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
		});
	});

});

describe('OLSKControllerSharedMiddlewares', function testOLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(apiController.OLSKControllerSharedMiddlewares(), {
			WKCSharedMiddlewareAPIAuthenticate: apiController.WKCAPIMiddlewareAuthenticate,
			WKCSharedMiddlewareAPIErrorHandler: apiController.WKCAPIMiddlewareErrorHandler,
		});
	});

});

describe('WKCAPIMiddlewareAuthenticate', function testWKCAPIMiddlewareAuthenticate() {

	var fakeAuthRequest = function(inputData = {}) {
		return {
			headers: Object.assign({}, inputData),
		};
	};

	var fakeNext = function(inputData) {
		return typeof inputData === 'undefined' ? 'RETURNED_UNDEFINED' : inputData;
	};

	it('returns next(WKCAPIClientError) without header', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest(), WKCAPIFakeResponse(), fakeNext), new apiController.WKCAPIClientError('WKCAPIClientErrorTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) without token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': null,
		}), WKCAPIFakeResponse(), fakeNext), new apiController.WKCAPIClientError('WKCAPIClientErrorTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with blank token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': '',
		}), WKCAPIFakeResponse(), fakeNext), new apiController.WKCAPIClientError('WKCAPIClientErrorTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with whitespace token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': ' ',
		}), WKCAPIFakeResponse(), fakeNext), new apiController.WKCAPIClientError('WKCAPIClientErrorTokenNotSet'));
	});

	it('returns next(WKCAPIClientError) with wrong token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': 'password',
		}), WKCAPIFakeResponse(), fakeNext), new apiController.WKCAPIClientError('WKCAPIClientErrorTokenNotValid'));
	});

	it('returns next(undefined) with correct token', function() {
		assert.strictEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), WKCAPIFakeResponse(), fakeNext), 'RETURNED_UNDEFINED');
	});

});

describe('WKCAPIMiddlewareErrorHandler', function testWKCAPIMiddlewareErrorHandler() {

	var fakeNext = function(inputData) {
		return inputData;
	};

	it('returns WKCAPISystemError for WKCAPISystemError', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareErrorHandler(new apiController.WKCAPISystemError('alpha'), {}, WKCAPIFakeResponse()), {
			WKCAPISystemError: 'alpha',
		});
	});

	it('returns WKCAPIClientError for WKCAPIClientError', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareErrorHandler(new apiController.WKCAPIClientError('alpha'), {}, WKCAPIFakeResponse()), {
			WKCAPIClientError: 'alpha',
		});
	});

	it('returns next(error) for Error', function() {
		var item = new Error('alpha');
		assert.deepEqual(apiController.WKCAPIMiddlewareErrorHandler(item, {}, WKCAPIFakeResponse(), fakeNext), item);
	});

});

describe('WKCActionAPIRoot', function testWKCActionAPIRoot() {

	var fakeRequest = function() {
		return {
			headers: {
				'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
			},
		};
	};

	it('returns confirmation authenticated', function() {
		assert.deepEqual(apiController.WKCActionAPIRoot(fakeRequest(), WKCAPIFakeResponse()), {
			WKCAPIResponse: 'Successfully authenticated',
		});
	});

});
