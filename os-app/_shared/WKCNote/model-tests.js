import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubNoteObjectValid: function() {
		return {
			WKCNoteID: 'alfa',
			WKCNoteBody: '',
			WKCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKCNoteModelErrorsFor', function testWKCNoteModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.WKCNoteModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKCNoteID not string', function() {
		deepEqual(mainModule.WKCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: null,
		})), {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteID not filled', function() {
		deepEqual(mainModule.WKCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: ' ',
		})), {
			WKCNoteID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCNoteBody not string', function() {
		deepEqual(mainModule.WKCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteBody: null,
		})), {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteCreationDate not date', function() {
		deepEqual(mainModule.WKCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteCreationDate: new Date('alfa'),
		})), {
			WKCNoteCreationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns object if WKCNoteModificationDate not date', function() {
		deepEqual(mainModule.WKCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteModificationDate: new Date('alfa'),
		})), {
			WKCNoteModificationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKCNoteModelErrorsFor(kTesting.StubNoteObjectValid()), null);
	});

	context('WKCNotePublishStatusIsPublished', function() {

		it('returns object if WKCNotePublishStatusIsPublished not boolean', function() {
			deepEqual(mainModule.WKCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				WKCNotePublishStatusIsPublished: 'true',
			})), {
				WKCNotePublishStatusIsPublished: [
					'WKCErrorNotBoolean',
				],
			});
		});

	});

});

describe('WKCNoteModelPreJSONSchemaValidate', function testWKCNoteModelPreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mainModule.WKCNoteModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKCNoteCreationDate as string', function() {
		deepEqual(mainModule.WKCNoteModelPreJSONSchemaValidate({
			WKCNoteCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCNoteCreationDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with WKCNoteModificationDate as string', function() {
		deepEqual(mainModule.WKCNoteModelPreJSONSchemaValidate({
			WKCNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCNoteModificationDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKCNoteModelPostJSONParse', function testWKCNoteModelPostJSONParse() {

	it('returns input null', function() {
		deepEqual(mainModule.WKCNoteModelPostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mainModule.WKCNoteModelPostJSONParse({}), {});
	});

	it('returns input with WKCNoteCreationDate as date', function() {
		deepEqual(mainModule.WKCNoteModelPostJSONParse({
			WKCNoteCreationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCNoteCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with WKCNoteModificationDate as date', function() {
		deepEqual(mainModule.WKCNoteModelPostJSONParse({
			WKCNoteModificationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
