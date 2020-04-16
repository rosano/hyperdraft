/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var controllerModule = require('./controller.js');

describe('KVCSharedMiddlewareEnsureDatabase', function test_KVCSharedMiddlewareEnsureDatabase() {

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

	it('returns next(KVCErrorConnectionNotAttempted) if not attempted', function() {
		assert.deepEqual(controllerModule.KVCSharedMiddlewareEnsureDatabase(fakeRequest({
			OLSKConnectionAttempted: false,
		}), fakeResponse, fakeNext), new Error('KVCErrorConnectionNotAttempted'));
	});

	it('returns next(KVCErrorConnectionFailed) if error', function() {
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
