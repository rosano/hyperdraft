/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./ui-logic.js');

const kTest = {
	uStubLineTokensFor: function (inputData) {
		return inputData.split(' ').map(function (e1, index1) {
			return e1.split('').map(function (e2, index2) {
				return {
					string: e2,
					type: e1.match(/(http|\[\[)/) ? 'variable-2 link' : 'variable-2',
				};
			});
		}).reduce(function (coll, e) {
			return coll.concat([{
				string: ' ',
				type: 'variable-2',
			}]).concat(e);
		}, []).slice(1).map(function (e, index) {
			return Object.assign(e, {
				start: index,
				end: index + 1,
			});
		});
	},
};

describe('WKCWriteLogicListSort', function testWKCWriteLogicListSort() {

	it('sorts by WKCNoteDateUpdated descending', function() {
		var item1 = {
			WKCNoteDateUpdated: new Date(0),
		};
		var item2 = {
			WKCNoteDateUpdated: new Date(1),
		};

		assert.deepEqual([item1, item2].sort(mainModule.WKCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by WKCNoteDateCreated descending if no WKCNoteDateUpdated', function() {
		var item1 = {
			WKCNoteDateCreated: new Date(0),
		};
		var item2 = {
			WKCNoteDateCreated: new Date(1),
		};

		assert.deepEqual([item1, item2].sort(mainModule.WKCWriteLogicListSort), [item2, item1]);
	});

});

describe('WKCWriteLineObjectsFor', function testWKCWriteLineObjectsFor() {

	it('throws error if not array', function() {
		assert.throws(function() {
			mainModule.WKCWriteLineObjectsFor(null);
		}, /WKCErrorInputInvalid/);
	});

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCWriteLineObjectsFor([]), []);
	});

	it('converts non-link single', function() {
		assert.deepEqual(mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('alfa')), [{
			start: 0,
			end: 4,
			string: 'alfa',
			type: 'variable-2',
		}]);
	});

	it('converts non-link multiple', function() {
		assert.deepEqual(mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('alfa bravo')), [{
			start: 0,
			end: 10,
			string: 'alfa bravo',
			type: 'variable-2',
		}]);
	});

	it('converts link single', function() {
		assert.deepEqual(mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('[[alfa]]')), [{
			start: 0,
			end: 8,
			string: '[[alfa]]',
			type: 'variable-2 link',
		}]);
	});

	it('converts link multiple', function() {
		assert.deepEqual(mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('[[alfa]] [[bravo]]')), [{
			start: 0,
			end: 8,
			string: '[[alfa]]',
			type: 'variable-2 link',
		}, {
			start: 8,
			end: 9,
			string: ' ',
			type: 'variable-2',
		}, {
			start: 9,
			end: 18,
			string: '[[bravo]]',
			type: 'variable-2 link',
		}]);
	});

});
