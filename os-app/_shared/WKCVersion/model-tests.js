import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubNoteObjectValid: function() {
		return {
			WKCVersionID: 'alfa',
			WKCVersionNoteID: 'bravo',
			WKCVersionBody: '',
			WKCVersionDate: new Date(),
		};
	},
};

describe('WKCVersionModelErrorsFor', function testWKCVersionModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.WKCVersionModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKCVersionID not string', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCVersionID: null,
		})), {
			WKCVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionID not filled', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCVersionID: ' ',
		})), {
			WKCVersionID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCVersionNoteID not string', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCVersionNoteID: null,
		})), {
			WKCVersionNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionNoteID not filled', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCVersionNoteID: ' ',
		})), {
			WKCVersionNoteID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCVersionBody not string', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCVersionBody: null,
		})), {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionDate not date', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			WKCVersionDate: new Date('alfa'),
		})), {
			WKCVersionDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(kTesting.StubNoteObjectValid()), null);
	});

});

describe('WKCVersionModelPreJSONSchemaValidate', function testWKCVersionModelPreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mainModule.WKCVersionModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKCVersionDate as string', function() {
		deepEqual(mainModule.WKCVersionModelPreJSONSchemaValidate({
			WKCVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCVersionDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKCVersionModelPostJSONParse', function testWKCVersionModelPostJSONParse() {

	it('returns input null', function() {
		deepEqual(mainModule.WKCVersionModelPostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mainModule.WKCVersionModelPostJSONParse({}), {});
	});

	it('returns input with WKCVersionDate as date', function() {
		deepEqual(mainModule.WKCVersionModelPostJSONParse({
			WKCVersionDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
