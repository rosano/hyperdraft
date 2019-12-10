const { throws, deepEqual } = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubNoteObjectValid() {
		return {
			KVCNoteID: 'alfa',
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('KVCNoteModelErrorsFor', function testKVCNoteModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.KVCNoteModelErrorsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if KVCNoteID not string', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteID: null,
		})), {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCNoteID not filled', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteID: ' ',
		})), {
			KVCNoteID: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCNoteBody not string', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteBody: null,
		})), {
			KVCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCNoteCreationDate not date', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteCreationDate: new Date('alfa'),
		})), {
			KVCNoteCreationDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns object if KVCNoteModificationDate not date', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteModificationDate: new Date('alfa'),
		})), {
			KVCNoteModificationDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(kTesting.StubNoteObjectValid()), null);
	});

	context('KVCNotePublishStatusIsPublished', function() {

		it('returns object if KVCNotePublishStatusIsPublished not boolean', function() {
			deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				KVCNotePublishStatusIsPublished: 'true',
			})), {
				KVCNotePublishStatusIsPublished: [
					'KVCErrorNotBoolean',
				],
			});
		});

	});

});

describe('KVCNoteModelPreJSONSchemaValidate', function testKVCNoteModelPreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mainModule.KVCNoteModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with KVCNoteCreationDate as string', function() {
		deepEqual(mainModule.KVCNoteModelPreJSONSchemaValidate({
			KVCNoteCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			KVCNoteCreationDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with KVCNoteModificationDate as string', function() {
		deepEqual(mainModule.KVCNoteModelPreJSONSchemaValidate({
			KVCNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			KVCNoteModificationDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('KVCNoteModelPostJSONParse', function testKVCNoteModelPostJSONParse() {

	it('returns input null', function() {
		deepEqual(mainModule.KVCNoteModelPostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mainModule.KVCNoteModelPostJSONParse({}), {});
	});

	it('returns input with KVCNoteCreationDate as date', function() {
		deepEqual(mainModule.KVCNoteModelPostJSONParse({
			KVCNoteCreationDate: '2018-12-09T19:07:01.902Z',
		}), {
			KVCNoteCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with KVCNoteModificationDate as date', function() {
		deepEqual(mainModule.KVCNoteModelPostJSONParse({
			KVCNoteModificationDate: '2018-12-09T19:07:01.902Z',
		}), {
			KVCNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
