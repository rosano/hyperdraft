/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var scriptModule = require('./script');

describe('WKCNotesAppTest', function testWKCNotesAppTest() {

	it('returns connection functions', function() {
		assert.strictEqual(scriptModule.WKCNotesAppTest(), 'hello');
	});

});
