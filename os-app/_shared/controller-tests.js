/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var sharedController = require('./controller');

describe('OLSKControllerSharedConnections', function testOLSKControllerSharedConnections() {

	it('returns middleware functions', function() {
		assert.deepEqual(sharedController.OLSKControllerSharedConnections(), {
			WKCSharedConnectionMongo: sharedController.WKCSharedConnectionInitializerMongo,
		});
	});

});
