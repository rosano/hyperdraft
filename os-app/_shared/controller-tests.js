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
			WKCSharedConnectionMongo: sharedController.WKCSharedConnectionInitializerMongo,
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
			OLSKSharedConnectionFor: function () {
				return Object.assign({}, inputData);
			},
		};
	};

	var fakeNext = function() {
		return function(inputData) {
			return inputData;
		};
	};

	it('calls next with WKCErrorConnectionNotAttempted if not attempted', function() {
		assert.deepEqual(sharedController.WKCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: false,
		}), undefined, fakeNext()), new Error('WKCErrorConnectionNotAttempted'));
	});

	it('calls next with WKCErrorConnectionFailed if error', function() {
		var error = new Error('MongoErrorConnectionFailed');
		assert.deepEqual(sharedController.WKCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: true,
			OLSKConnectionError: error,
		}), undefined, fakeNext()), error);
	});

	it('calls next with undefined if no error', function() {
		assert.deepEqual(sharedController.WKCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: true,
			OLSKConnectionError: null,
		}), undefined, fakeNext()), undefined);
	});

});
