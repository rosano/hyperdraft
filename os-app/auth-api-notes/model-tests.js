/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var notesLibrary = require('./model');

describe('WKCModelInputDataIsNotesObject', function testWKCModelInputDataIsNotesObject() {

	it('returns false if not object', function() {
		assert.strictEqual(notesLibrary.WKCModelInputDataIsNotesObject(null), false);
	});

	it('returns false with WKCErrors if WKCNoteBody not string', function() {
		var item = {
			WKCNoteBody: null,
		};
		assert.strictEqual(notesLibrary.WKCModelInputDataIsNotesObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns true if valid noteObject', function() {
		assert.deepEqual(notesLibrary.WKCModelInputDataIsNotesObject({
			WKCNoteBody: 'alpha',
		}), true);
	});

});
