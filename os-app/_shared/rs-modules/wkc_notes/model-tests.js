const assert = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubNoteObject: function() {
		return {
			WKCNoteID: 'alfa',
			WKCNoteBody: 'bravo',
			WKCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKCNotesModelErrorsFor', function testWKCNotesModelErrorsFor() {

	it('throws error if not object', function() {
		assert.throws(function() {
			mainModule.WKCNotesModelErrorsFor(null);
		}, /WKCErrorInputInvalid/);
	});

	it('returns object if WKCNoteID not string', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: null,
		})), {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteID not filled', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: ' ',
		})), {
			WKCNoteID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCNoteBody not string', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		})), {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteCreationDate not date', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteCreationDate: new Date('alfa'),
		})), {
			WKCNoteCreationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns object if WKCNoteModificationDate not date', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteModificationDate: new Date('alfa'),
		})), {
			WKCNoteModificationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(kTesting.StubNoteObject()), null);
	});

	context('WKCNotePublishStatusIsPublished', function() {

		it('returns object if WKCNotePublishStatusIsPublished not boolean', function() {
			assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
				WKCNotePublishStatusIsPublished: 'true',
			})), {
				WKCNotePublishStatusIsPublished: [
					'WKCErrorNotBoolean',
				],
			});
		});

	});

});

describe('WKCNotesModelPreJSONSchemaValidate', function testWKCNotesModelPreJSONSchemaValidate() {

	it('returns input', function() {
		assert.deepEqual(mainModule.WKCNotesModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKCNoteCreationDate as string', function() {
		assert.deepEqual(mainModule.WKCNotesModelPreJSONSchemaValidate({
			WKCNoteCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCNoteCreationDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with WKCNoteModificationDate as string', function() {
		assert.deepEqual(mainModule.WKCNotesModelPreJSONSchemaValidate({
			WKCNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCNoteModificationDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKCNotesModelPostJSONParse', function testWKCNotesModelPostJSONParse() {

	it('returns input', function() {
		assert.deepEqual(mainModule.WKCNotesModelPostJSONParse(null), null);
	});

	it('returns input', function() {
		assert.deepEqual(mainModule.WKCNotesModelPostJSONParse({}), {});
	});

	it('returns input with WKCNoteCreationDate as date', function() {
		assert.deepEqual(mainModule.WKCNotesModelPostJSONParse({
			WKCNoteCreationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCNoteCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with WKCNoteModificationDate as date', function() {
		assert.deepEqual(mainModule.WKCNotesModelPostJSONParse({
			WKCNoteModificationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
