const assert = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubNoteObject: function() {
		return {
			WKCNoteID: 'alfa',
			WKCNoteBody: 'bravo',
			WKCNoteDateCreated: new Date('2019-02-23T13:56:36Z'),
			RSNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
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

	it('returns object if WKCNoteBody not string', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		})), {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteDateCreated not date', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteDateCreated: new Date('alfa'),
		})), {
			WKCNoteDateCreated: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns object if RSNoteModificationDate not date', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			RSNoteModificationDate: new Date('alfa'),
		})), {
			RSNoteModificationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.WKCNotesModelErrorsFor(kTesting.StubNoteObject()), null);
	});

	context('RSNotePublishStatusIsPublished', function() {

		it('returns object if RSNotePublishStatusIsPublished not boolean', function() {
			assert.deepEqual(mainModule.WKCNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
				RSNotePublishStatusIsPublished: 'true',
			})), {
				RSNotePublishStatusIsPublished: [
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

	it('returns input with WKCNoteDateCreated as string', function() {
		assert.deepEqual(mainModule.WKCNotesModelPreJSONSchemaValidate({
			WKCNoteDateCreated: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCNoteDateCreated: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with RSNoteModificationDate as string', function() {
		assert.deepEqual(mainModule.WKCNotesModelPreJSONSchemaValidate({
			RSNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			RSNoteModificationDate: '2018-12-09T19:07:01.902Z',
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

	it('returns input with WKCNoteDateCreated as date', function() {
		assert.deepEqual(mainModule.WKCNotesModelPostJSONParse({
			WKCNoteDateCreated: '2018-12-09T19:07:01.902Z',
		}), {
			WKCNoteDateCreated: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with RSNoteModificationDate as date', function() {
		assert.deepEqual(mainModule.WKCNotesModelPostJSONParse({
			RSNoteModificationDate: '2018-12-09T19:07:01.902Z',
		}), {
			RSNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});

describe('OLSKTypeJSONSchemaForErrors', function OLSKTypeJSONSchemaForErrors() {

	it('throws error if not object', function() {
		assert.throws(function() {
			mainModule.OLSKTypeJSONSchemaForErrors(null);
		}, /WKCErrorInputInvalid/);
	});

	it('returns object', function() {
		assert.deepEqual(mainModule.OLSKTypeJSONSchemaForErrors({}), {
			type: 'object',
			properties: {},
			required: [],
		});
	});

	context('properties', function() {
		
		it('declares string', function() {
			assert.deepEqual(mainModule.OLSKTypeJSONSchemaForErrors({
				alfa: ['WKCErrorNotString']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
		it('declares boolean', function() {
			assert.deepEqual(mainModule.OLSKTypeJSONSchemaForErrors({
				alfa: ['WKCErrorNotBoolean']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'boolean',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
		it('declares date', function() {
			assert.deepEqual(mainModule.OLSKTypeJSONSchemaForErrors({
				alfa: ['WKCErrorNotDate']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
						format: 'date-time',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
	});

	context('required', function() {
		
		it('declares if required', function() {
			assert.deepEqual(mainModule.OLSKTypeJSONSchemaForErrors({
				alfa: ['WKCErrorNotString']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [
					'alfa',
				],
			});
		});

		it('ignores', function() {
			assert.deepEqual(mainModule.OLSKTypeJSONSchemaForErrors({
				alfa: ['WKCErrorNotString', '__RSOptional']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [],
			});
		});
		
	});

});
