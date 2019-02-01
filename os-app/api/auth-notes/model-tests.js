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

	it('ignores unpresent fields if WKCOptionValidatePresentOnly true', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor({
			alfa: 'bravo',
		}, {
			WKCOptionValidatePresentOnly: true,
		}), null);
	});

	context('WKCNotePublishStatusIsPublished', function() {

		it('returns object if WKCNotePublishStatusIsPublished not boolean', function() {
			assert.deepEqual(mainModule.WKCNotesModelErrorsFor({
				WKCNotePublishStatusIsPublished: 'true',
			}, {
				WKCOptionValidatePresentOnly: true,
			}), {
				WKCNotePublishStatusIsPublished: [
					'WKCErrorNotBoolean',
				],
			});
		});

	});

});

describe('WKCNotesModelHiddenPropertyNames', function testWKCNotesModelHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCNotesModelHiddenPropertyNames(), [
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
