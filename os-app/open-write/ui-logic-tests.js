const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js');

describe('KVCWriteLogicListSort', function test_KVCWriteLogicListSort() {

	it('sorts by KVCNoteModificationDate descending', function() {
		var item1 = {
			KVCNoteModificationDate: new Date(0),
		};
		var item2 = {
			KVCNoteModificationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.KVCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by KVCNoteCreationDate descending if no KVCNoteModificationDate', function() {
		var item1 = {
			KVCNoteCreationDate: new Date(0),
		};
		var item2 = {
			KVCNoteCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.KVCWriteLogicListSort), [item2, item1]);
	});

});

describe('KVCWriteFilterFunction', function test_KVCWriteFilterFunction() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCWriteFilterFunction(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns function', function() {
		deepEqual(typeof mainModule.KVCWriteFilterFunction('alfa'), 'function');
	});

	context('function', function () {

		it('returns false if no match', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('bravo')({
				KVCNoteBody: 'alfa',
			}), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('alfa')({
				KVCNoteBody: 'alfa',
			}), true);
		});

		it('matches partial', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('alf')({
				KVCNoteBody: 'alfa',
			}), true);
		});

		it('matches case insensitive', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('ALF')({
				KVCNoteBody: 'alfa',
			}), true);
		});

	});

});
