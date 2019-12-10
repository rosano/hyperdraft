/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var controllerModule = require('./controller.js');

describe('OLSKControllerSharedConnections', function testOLSKControllerSharedConnections() {

	it('returns connection functions', function() {
		assert.deepEqual(controllerModule.OLSKControllerSharedConnections(), {
			KVCSharedConnectionMongo: {
				OLSKConnectionInitializer: controllerModule.KVCSharedConnectionInitializerMongo,
				OLSKConnectionCleanup: controllerModule.KVCSharedConnectionCleanupMongo,
			},
		});
	});

});

describe('KVCSharedMiddlewareEnsureDatabase', function testKVCSharedMiddlewareEnsureDatabase() {

	var fakeRequest = function(inputData = {}) {
		return {
			OLSKSharedConnectionFor() {
				return Object.assign({}, inputData);
			},
		};
	};

	var fakeResponse = function() {};

	var fakeNext = function(inputData) {
		return typeof inputData === 'undefined' ? 'RETURNED_UNDEFINED' : inputData;
	};

	it('returns next(WKCErrorConnectionNotAttempted) if not attempted', function() {
		assert.deepEqual(controllerModule.KVCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: false,
		}), fakeResponse, fakeNext), new Error('WKCErrorConnectionNotAttempted'));
	});

	it('returns next(WKCErrorConnectionFailed) if error', function() {
		var error = new Error('MongoErrorConnectionFailed');
		assert.deepEqual(controllerModule.KVCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: true,
			OLSKConnectionError: error,
		}), fakeResponse, fakeNext), error);
	});

	it('returns next(undefined) if no error', function() {
		assert.strictEqual(controllerModule.KVCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: true,
			OLSKConnectionError: null,
		}), fakeResponse, fakeNext), 'RETURNED_UNDEFINED');
	});

});
