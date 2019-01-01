/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var logicLibrary = require('./ui-logic');

describe('WKCWriteLogicListSort', function testWKCWriteLogicListSort() {

	it('sorts by WKCNoteDateUpdated descending', function() {
		var item1 = {
			WKCNoteDateUpdated: new Date(0),
		};
		var item2 = {
			WKCNoteDateUpdated: new Date(1),
		};

		assert.deepEqual([item1, item2].sort(logicLibrary.WKCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by WKCNoteDateCreated descending if no WKCNoteDateUpdated', function() {
		var item1 = {
			WKCNoteDateCreated: new Date(0),
		};
		var item2 = {
			WKCNoteDateCreated: new Date(1),
		};

		assert.deepEqual([item1, item2].sort(logicLibrary.WKCWriteLogicListSort), [item2, item1]);
	});

});
