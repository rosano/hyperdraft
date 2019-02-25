const assert = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubNoteObject: function() {
		return {
			WKCVersionID: 'alfa',
			WKCVersionNoteID: 'bravo',
			WKCVersionBody: 'charlie',
			WKCVersionDate: new Date(),
		};
	},
};

describe('WKCVersionsModelErrorsFor', function testWKCVersionsModelErrorsFor() {

	it('throws error if not object', function() {
		assert.throws(function() {
			mainModule.WKCVersionsModelErrorsFor(null);
		}, /WKCErrorInputInvalid/);
	});

	it('returns object if WKCVersionID not string', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCVersionID: null,
		})), {
			WKCVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionID not filled', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCVersionID: ' ',
		})), {
			WKCVersionID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCVersionBody not string', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCVersionBody: null,
		})), {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionDate not date', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubNoteObject(), {
			WKCVersionDate: new Date('alfa'),
		})), {
			WKCVersionDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(kTesting.StubNoteObject()), null);
	});

});

describe('WKCVersionsModelPreJSONSchemaValidate', function testWKCVersionsModelPreJSONSchemaValidate() {

	it('returns input', function() {
		assert.deepEqual(mainModule.WKCVersionsModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKCVersionDate as string', function() {
		assert.deepEqual(mainModule.WKCVersionsModelPreJSONSchemaValidate({
			WKCVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCVersionDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKCVersionsModelPostJSONParse', function testWKCVersionsModelPostJSONParse() {

	it('returns input', function() {
		assert.deepEqual(mainModule.WKCVersionsModelPostJSONParse(null), null);
	});

	it('returns input', function() {
		assert.deepEqual(mainModule.WKCVersionsModelPostJSONParse({}), {});
	});

	it('returns input with WKCVersionDate as date', function() {
		assert.deepEqual(mainModule.WKCVersionsModelPostJSONParse({
			WKCVersionDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
