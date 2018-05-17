/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
require('dotenv').config();

var apiController = require('./controller');

var WKCAPIFakeResponse = function() {
	return {
		json: function(e) {
			return e;
		},
		text: function(e) {
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
		});
	});

});

describe('WKCAPIMiddlewareAuthenticate', function testWKCAPIMiddlewareAuthenticate() {

	var fakeAuthRequest = function(inputData = {}) {
		return {
			headers: Object.assign({}, inputData),
		};
	};

	it('returns error without header', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest(), WKCAPIFakeResponse()), {
			WKCError: 'API Token Not Set',
		});
	});

	it('returns error without token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': null,
		}), WKCAPIFakeResponse()), {
			WKCError: 'API Token Not Set',
		});
	});

	it('returns error with blank token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': '',
		}), WKCAPIFakeResponse()), {
			WKCError: 'API Token Not Set',
		});
	});

	it('returns error with whitespace token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': ' ',
		}), WKCAPIFakeResponse()), {
			WKCError: 'API Token Not Set',
		});
	});

	it('returns error with wrong token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': 'password',
		}), WKCAPIFakeResponse()), {
			WKCError: 'Invalid access token',
		});
	});

	it('calls next with correct token', function() {
		assert.strictEqual(apiController.WKCAPIMiddlewareAuthenticate(fakeAuthRequest({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), WKCAPIFakeResponse(), function() {
			return 'success';
		}), 'success');
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
		assert.deepEqual(apiController.WKCActionAPIRoot(fakeRequest(), WKCAPIFakeResponse()), 'Successfully authenticated');
	});

});
