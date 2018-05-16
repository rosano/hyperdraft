/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
require('dotenv').config();

var apiController = require('./controller');

var WKCFakeAuthRequest = function(inputData = {}) {
	return {
		headers: Object.assign({}, inputData),
	};
};

var WKCAPIFakeResponse = function() {
	return {
		json: function(e) {
			return e;
		},
		text: function(e) {
			return e;
		}
	};
};

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(apiController.OLSKControllerRoutes(), {
			WKCRouteAPIRoot: {
				OLSKRoutePath: '/api/',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: apiController.WKCActionAPIRoot,
				OLSKRouteMiddlewares: ['WKCSharedMiddlewareAPIAuthenticate'],
			},
			WKCRouteAPINotesAdd: {
				OLSKRoutePath: '/api/notes',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: apiController.index,
				OLSKRouteMiddlewares: ['WKCSharedMiddlewareAPIAuthenticate'],
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

	it('returns error without header', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCFakeAuthRequest(), WKCAPIFakeResponse()), {
			WKCError: 'API Token Not Set',
		});
	});

	it('returns error without token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCFakeAuthRequest({
			'x-client-key': null,
		}), WKCAPIFakeResponse()), {
			WKCError: 'API Token Not Set',
		});
	});

	it('returns error with blank token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCFakeAuthRequest({
			'x-client-key': '',
		}), WKCAPIFakeResponse()), {
			WKCError: 'API Token Not Set',
		});
	});

	it('returns error with whitespace token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCFakeAuthRequest({
			'x-client-key': ' ',
		}), WKCAPIFakeResponse()), {
			WKCError: 'API Token Not Set',
		});
	});

	it('returns error with wrong token', function() {
		assert.deepEqual(apiController.WKCAPIMiddlewareAuthenticate(WKCFakeAuthRequest({
			'x-client-key': 'password',
		}), WKCAPIFakeResponse()), {
			WKCError: 'Invalid access token',
		});
	});

	it('calls next with correct token', function() {
		apiController.WKCAPIMiddlewareAuthenticate(WKCFakeAuthRequest({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), WKCAPIFakeResponse(), function() {
			assert.ok(true);
		});
	});

});

describe('WKCActionAPIRoot', function testWKCActionAPIRoot() {

	it('returns confirmation authenticated', function() {
		assert.deepEqual(apiController.WKCActionAPIRoot(WKCFakeAuthRequest({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), WKCAPIFakeResponse()), 'Successfully authenticated');
	});

});
