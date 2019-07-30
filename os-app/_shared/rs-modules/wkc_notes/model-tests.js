import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubNoteObjectValid: function() {
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
		throws(function() {
			mainModule.WKCNotesModelErrorsFor(null);
		}, /WKCErrorInputInvalid/);
	});

	it('returns object if WKCNoteID not string', function() {
		deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: null,
		})), {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteID not filled', function() {
		deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: ' ',
		})), {
			WKCNoteID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCNoteBody not string', function() {
		deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteBody: null,
		})), {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteCreationDate not date', function() {
		deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteCreationDate: new Date('alfa'),
		})), {
			WKCNoteCreationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns object if WKCNoteModificationDate not date', function() {
		deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteModificationDate: new Date('alfa'),
		})), {
			WKCNoteModificationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKCNotesModelErrorsFor(kTesting.StubNoteObjectValid()), null);
	});

	context('WKCNotePublishStatusIsPublished', function() {

		it('returns object if WKCNotePublishStatusIsPublished not boolean', function() {
			deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
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
		deepEqual(mainModule.WKCNotesModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKCNoteCreationDate as string', function() {
		deepEqual(mainModule.WKCNotesModelPreJSONSchemaValidate({
			WKCNoteCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCNoteCreationDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with WKCNoteModificationDate as string', function() {
		deepEqual(mainModule.WKCNotesModelPreJSONSchemaValidate({
			WKCNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCNoteModificationDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKCNotesModelPostJSONParse', function testWKCNotesModelPostJSONParse() {

	it('returns input', function() {
		deepEqual(mainModule.WKCNotesModelPostJSONParse(null), null);
	});

	it('returns input', function() {
		deepEqual(mainModule.WKCNotesModelPostJSONParse({}), {});
	});

	it('returns input with WKCNoteCreationDate as date', function() {
		deepEqual(mainModule.WKCNotesModelPostJSONParse({
			WKCNoteCreationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCNoteCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with WKCNoteModificationDate as date', function() {
		deepEqual(mainModule.WKCNotesModelPostJSONParse({
			WKCNoteModificationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
