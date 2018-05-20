/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var sharedController = require('./controller');

describe('OLSKControllerSharedConnections', function testOLSKControllerSharedConnections() {

	it('returns connection functions', function() {
		assert.deepEqual(sharedController.OLSKControllerSharedConnections(), {
			WKCSharedConnectionMongo: {
				OLSKConnectionInitializer: sharedController.WKCSharedConnectionInitializerMongo,
				OLSKConnectionCleanup: sharedController.WKCSharedConnectionCleanupMongo,
			},
		});
	});

});

describe('OLSKControllerSharedMiddlewares', function testOLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(sharedController.OLSKControllerSharedMiddlewares(), {
			WKCSharedMiddlewareEnsureDatabase: sharedController.WKCSharedMiddlewareEnsureDatabase,
		});
	});

});

describe('WKCSharedMiddlewareEnsureDatabase', function testWKCSharedMiddlewareEnsureDatabase() {

	var fakeRequest = function(inputData = {}) {
		return {
			OLSKSharedConnectionFor: function() {
				return Object.assign({}, inputData);
			},
		};
	};

	var fakeResponse = function() {};

	var fakeNext = function(inputData) {
		return typeof inputData === 'undefined' ? 'RETURNED_UNDEFINED' : inputData;
	};

	it('returns next(WKCErrorConnectionNotAttempted) if not attempted', function() {
		assert.deepEqual(sharedController.WKCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: false,
		}), fakeResponse, fakeNext), new Error('WKCErrorConnectionNotAttempted'));
	});

	it('returns next(WKCErrorConnectionFailed) if error', function() {
		var error = new Error('MongoErrorConnectionFailed');
		assert.deepEqual(sharedController.WKCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: true,
			OLSKConnectionError: error,
		}), fakeResponse, fakeNext), error);
	});

	it('returns next(undefined) if no error', function() {
		assert.strictEqual(sharedController.WKCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: true,
			OLSKConnectionError: null,
		}), fakeResponse, fakeNext), 'RETURNED_UNDEFINED');
	});

});
