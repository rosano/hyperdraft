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
