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

	it('returns true', function() {
		assert.deepEqual(notesLibrary.WKCModelInputDataIsNotesObject({
			WKCNoteBody: 'alpha',
		}), true);
	});

});

describe('WKCModelInputDataIsNotePublishStatusObject', function testWKCModelInputDataIsNotePublishStatusObject() {

	it('returns false if not object', function() {
		assert.strictEqual(notesLibrary.WKCModelInputDataIsNotePublishStatusObject(null), false);
	});

	it('returns false with WKCErrors if WKCNotePublishStatusIsPublished not boolean', function() {
		var item = {
			WKCNotePublishStatusIsPublished: null,
		};
		assert.strictEqual(notesLibrary.WKCModelInputDataIsNotePublishStatusObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCNotePublishStatusIsPublished: [
				'WKCErrorNotBoolean',
			],
		});
	});

	it('returns true', function() {
		assert.deepEqual(notesLibrary.WKCModelInputDataIsNotePublishStatusObject({
			WKCNotePublishStatusIsPublished: false,
		}), true);
		assert.deepEqual(notesLibrary.WKCModelInputDataIsNotePublishStatusObject({
			WKCNotePublishStatusIsPublished: true,
		}), true);
	});

});

describe('WKCModelNotesUnusedPropertyNames', function testWKCModelNotesUnusedPropertyNames() {

	it('returns unused property names', function() {
		assert.deepEqual(notesLibrary.WKCModelNotesUnusedPropertyNames(), [
			'_id',
		]);
	});

});
