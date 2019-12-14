const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js');

describe('KVCWriteTruncatedTitleFor', function testKVCWriteTruncatedTitleFor() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCWriteTruncatedTitleFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns input', function() {
		deepEqual(mainModule.KVCWriteTruncatedTitleFor('alfa'), 'alfa');
	});

	it('includes if under 60 characters', function() {
		deepEqual(mainModule.KVCWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilo'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilo');
	});

	it('truncates text', function() {
		deepEqual(mainModule.KVCWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
	});

	it('adds ellipsis if second parameter truthy', function() {
		deepEqual(mainModule.KVCWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos', true), 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
	});

});

describe('KVCWriteLogicListSort', function testKVCWriteLogicListSort() {

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
