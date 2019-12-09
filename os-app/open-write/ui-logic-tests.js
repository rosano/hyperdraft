const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js');

describe('WIKWriteTruncatedTitleFor', function testWIKWriteTruncatedTitleFor() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.WIKWriteTruncatedTitleFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns input', function() {
		deepEqual(mainModule.WIKWriteTruncatedTitleFor('alfa'), 'alfa');
	});

	it('includes if under 60 characters', function() {
		deepEqual(mainModule.WIKWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilo'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilo');
	});

	it('truncates text', function() {
		deepEqual(mainModule.WIKWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
	});

	it('adds ellipsis if second parameter truthy', function() {
		deepEqual(mainModule.WIKWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos', true), 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
	});

});

describe('WKCWriteLogicListSort', function testWKCWriteLogicListSort() {

	it('sorts by WKCNoteModificationDate descending', function() {
		var item1 = {
			WKCNoteModificationDate: new Date(0),
		};
		var item2 = {
			WKCNoteModificationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.WKCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by WKCNoteCreationDate descending if no WKCNoteModificationDate', function() {
		var item1 = {
			WKCNoteCreationDate: new Date(0),
		};
		var item2 = {
			WKCNoteCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.WKCWriteLogicListSort), [item2, item1]);
	});

});
