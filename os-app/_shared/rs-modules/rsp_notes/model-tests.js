const assert = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubNoteObject: function() {
		return {
			RSNoteID: 'alfa',
			WKCNoteBody: 'bravo',
			WKCNoteDateCreated: new Date('2019-02-23T13:56:36Z'),
			RSNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('RSNotesModelErrorsFor', function testRSNotesModelErrorsFor() {

	it('throws error if not object', function() {
		assert.throws(function() {
			mainModule.RSNotesModelErrorsFor(null);
		}, /RSErrorInputInvalid/);
	});

	it('returns object if RSNoteID not string', function() {
		assert.deepEqual(mainModule.RSNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			RSNoteID: null,
		})), {
			RSNoteID: [
				'RSErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteBody not string', function() {
		assert.deepEqual(mainModule.RSNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		})), {
			WKCNoteBody: [
				'RSErrorNotString',
			],
		});
	});

	it('returns object if WKCNoteDateCreated not date', function() {
		assert.deepEqual(mainModule.RSNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCNoteDateCreated: new Date('alfa'),
		})), {
			WKCNoteDateCreated: [
				'RSErrorNotDate',
			],
		});
	});

	it('returns object if RSNoteModificationDate not date', function() {
		assert.deepEqual(mainModule.RSNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			RSNoteModificationDate: new Date('alfa'),
		})), {
			RSNoteModificationDate: [
				'RSErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.RSNotesModelErrorsFor(kTesting.StubNoteObject()), null);
	});

	context('RSNotePublishStatusIsPublished', function() {

		it('returns object if RSNotePublishStatusIsPublished not boolean', function() {
			assert.deepEqual(mainModule.RSNotesModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
				RSNotePublishStatusIsPublished: 'true',
			})), {
				RSNotePublishStatusIsPublished: [
					'RSErrorNotBoolean',
				],
			});
		});

	});

});

describe('RSNotesModelPreJSONSchemaValidate', function testRSNotesModelPreJSONSchemaValidate() {

	it('returns input', function() {
		assert.deepEqual(mainModule.RSNotesModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKCNoteDateCreated as string', function() {
		assert.deepEqual(mainModule.RSNotesModelPreJSONSchemaValidate({
			WKCNoteDateCreated: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCNoteDateCreated: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with RSNoteModificationDate as string', function() {
		assert.deepEqual(mainModule.RSNotesModelPreJSONSchemaValidate({
			RSNoteModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			RSNoteModificationDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('RSNotesModelPostJSONParse', function testRSNotesModelPostJSONParse() {

	it('returns input', function() {
		assert.deepEqual(mainModule.RSNotesModelPostJSONParse(null), null);
	});

	it('returns input', function() {
		assert.deepEqual(mainModule.RSNotesModelPostJSONParse({}), {});
	});

	it('returns input with WKCNoteDateCreated as date', function() {
		assert.deepEqual(mainModule.RSNotesModelPostJSONParse({
			WKCNoteDateCreated: '2018-12-09T19:07:01.902Z',
		}), {
			WKCNoteDateCreated: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with RSNoteModificationDate as date', function() {
		assert.deepEqual(mainModule.RSNotesModelPostJSONParse({
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
		}, /RSErrorInputInvalid/);
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
				alfa: ['RSErrorNotString']
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
				alfa: ['RSErrorNotBoolean']
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
				alfa: ['RSErrorNotDate']
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
				alfa: ['RSErrorNotString']
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
				alfa: ['RSErrorNotString', '__RSOptional']
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
