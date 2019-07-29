/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./ui-logic.js');

const kTest = {
	uStubLineTokensFor: function (inputData) {
		let defaultType = inputData.trim()[0] === '#' ? 'header header-1' : 'variable-2';
		
		return inputData.split(' ').map(function (e1, index1) {
			return e1.split('').map(function (e2, index2) {
				return {
					string: e2,
					type: e1.match(/(http|\[\[)/) ? `${ defaultType } link` : defaultType,
				};
			});
		}).reduce(function (coll, e) {
			return coll.concat(coll.length ? [{
				string: ' ',
				type: defaultType,
			}] : []).concat(e);
		}, []).map(function (e, index) {
			return Object.assign(e, {
				start: index,
				end: index + 1,
			});
		});
	},
};

describe('WKCWriteLogicListSort', function testWKCWriteLogicListSort() {

	it('sorts by WKCNoteModificationDate descending', function() {
		var item1 = {
			WKCNoteModificationDate: new Date(0),
		};
		var item2 = {
			WKCNoteModificationDate: new Date(1),
		};

		assert.deepEqual([item1, item2].sort(mainModule.WKCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by WKCNoteCreationDate descending if no WKCNoteModificationDate', function() {
		var item1 = {
			WKCNoteCreationDate: new Date(0),
		};
		var item2 = {
			WKCNoteCreationDate: new Date(1),
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

	it('converts header', function() {
		assert.deepEqual(mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('# alfa')), [{
			start: 0,
			end: 6,
			string: '# alfa',
			type: 'header header-1',
		}]);
	});

	it('converts multiple header objects', function() {
		assert.deepEqual(mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('# alfa [[bravo]]')), [{
			start: 0,
			end: 7,
			string: '# alfa ',
			type: 'header header-1',
		}, {
			start: 7,
			end: 16,
			string: '[[bravo]]',
			type: 'header header-1 link',
		}]);
	});

});

describe('WKCWriteHeaderTokensFrom', function testWKCWriteHeaderTokensFrom() {

	it('throws error if not array', function() {
		assert.throws(function() {
			mainModule.WKCWriteHeaderTokensFrom(null);
		}, /WKCErrorInputInvalid/);
	});

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCWriteHeaderTokensFrom([]), []);
	});

	it('excludes if not header', function() {
		assert.deepEqual(mainModule.WKCWriteHeaderTokensFrom([
			mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('alfa')),
			mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('[[bravo]]')),
			]), []);
	});

	it('includes if header', function() {
		assert.deepEqual(mainModule.WKCWriteHeaderTokensFrom([
			mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('# alfa')),
			]), mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('# alfa')).map(function (e) {
				return Object.assign(e, {
					line: 0,
				});
			}));
	});

	it('excludes if not verbal', function() {
		assert.deepEqual(mainModule.WKCWriteHeaderTokensFrom([
			mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('alfa')),
			mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('====')),
		].map(function (e) {
			return e.map(function (e) {
				return Object.assign(e, {
					type: 'header header-1',
				})
			});
		})), [{
			start: 0,
			end: 4,
			string: 'alfa',
			type: 'header header-1',
			line: 0,
		}]);
	});

	it('merges multiple header objects', function() {
		assert.deepEqual(mainModule.WKCWriteHeaderTokensFrom([
			mainModule.WKCWriteLineObjectsFor(kTest.uStubLineTokensFor('# PA PARC https://www.supermarchepa.com/pages/weekly-flyer')),
			]), [{
			start: 0,
			end: 58,
			string: '# PA PARC https://www.supermarchepa.com/pages/weekly-flyer',
			type: 'header header-1',
			line: 0,
		}]);
	});

});
