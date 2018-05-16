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
