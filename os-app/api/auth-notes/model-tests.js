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

describe('WKCModelNoteDetectedTitleFor', function testWKCModelNoteDetectedTitleFor() {

	it('returns empty string if empty', function() {
		assert.deepEqual(notesLibrary.WKCModelNoteDetectedTitleFor(), '');
		assert.deepEqual(notesLibrary.WKCModelNoteDetectedTitleFor(null), '');
		assert.deepEqual(notesLibrary.WKCModelNoteDetectedTitleFor(''), '');
	});

	it('returns first line if single', function() {
		assert.deepEqual(notesLibrary.WKCModelNoteDetectedTitleFor('alpha'), 'alpha');
	});

	it('returns first line if multiple', function() {
		assert.deepEqual(notesLibrary.WKCModelNoteDetectedTitleFor("alpha\n"), 'alpha');
		assert.deepEqual(notesLibrary.WKCModelNoteDetectedTitleFor("alpha\nbravo"), 'alpha');
	});

});

describe('WKCModelNotesHiddenPropertyNames', function testWKCModelNotesHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(notesLibrary.WKCModelNotesHiddenPropertyNames(), [
			'_id',
		]);
	});

});

describe('WKCModelNotesPublicPropertyNames', function testWKCModelNotesHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(notesLibrary.WKCModelNotesPublicPropertyNames(), [
			'WKCNotePublicID',
			'WKCNoteDateCreated',
			'WKCNoteDateUpdated',
			'WKCNoteBody',
		]);
	});

});
