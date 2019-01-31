/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./model');

const kTesting = {
	StubValidNote: function() {
		return {
			WKCNoteBody: 'bravo',
		};
	},
};

describe('WKCNotesModelErrorsFor', function testWKCNotesModelErrorsFor() {

	it('throws error if not object', function() {
		assert.throws(function() {
			mainModule.WKCNotesModelErrorsFor(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns object if WKCNoteBody not string', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubValidNote(), {
			WKCNoteBody: null,
		})), {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(kTesting.StubValidNote()), null);
	});

});

describe('WKCModelInputDataIsNotesObject', function testWKCModelInputDataIsNotesObject() {

	it('returns false if not object', function() {
		assert.strictEqual(mainModule.WKCModelInputDataIsNotesObject(null), false);
	});

	it('returns false with WKCErrors if WKCNoteBody not string', function() {
		var item = {
			WKCNoteBody: null,
		};
		assert.strictEqual(mainModule.WKCModelInputDataIsNotesObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns true', function() {
		assert.deepEqual(mainModule.WKCModelInputDataIsNotesObject({
			WKCNoteBody: 'alpha',
		}), true);
	});

});

describe('WKCModelInputDataIsNotePublishStatusObject', function testWKCModelInputDataIsNotePublishStatusObject() {

	it('returns false if not object', function() {
		assert.strictEqual(mainModule.WKCModelInputDataIsNotePublishStatusObject(null), false);
	});

	it('returns false with WKCErrors if WKCNotePublishStatusIsPublished not boolean', function() {
		var item = {
			WKCNotePublishStatusIsPublished: null,
		};
		assert.strictEqual(mainModule.WKCModelInputDataIsNotePublishStatusObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCNotePublishStatusIsPublished: [
				'WKCErrorNotBoolean',
			],
		});
	});

	it('returns true', function() {
		assert.deepEqual(mainModule.WKCModelInputDataIsNotePublishStatusObject({
			WKCNotePublishStatusIsPublished: false,
		}), true);
		assert.deepEqual(mainModule.WKCModelInputDataIsNotePublishStatusObject({
			WKCNotePublishStatusIsPublished: true,
		}), true);
	});

});

describe('WKCNotesModelHiddenPropertyNames', function testWKCNotesModelHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCNotesModelHiddenPropertyNames(), [
			'_id',
		]);
	});

});

describe('WKCModelNotesHiddenPropertyNames', function testWKCModelNotesHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCModelNotesHiddenPropertyNames(), [
			'_id',
		]);
	});

});

describe('WKCModelNotesPublicPropertyNames', function testWKCModelNotesHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCModelNotesPublicPropertyNames(), [
			'WKCNotePublicID',
			'WKCNoteDateCreated',
			'WKCNoteDateUpdated',
			'WKCNoteBody',
		]);
	});

});
