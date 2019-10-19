import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubDocumentObjectValid: function() {
		return {
			WKCVersionID: 'alfa',
			WKCVersionDocumentID: 'bravo',
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
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCVersionID: null,
		})), {
			WKCVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionID not filled', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCVersionID: ' ',
		})), {
			WKCVersionID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCVersionDocumentID not string', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCVersionDocumentID: null,
		})), {
			WKCVersionDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionDocumentID not filled', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCVersionDocumentID: ' ',
		})), {
			WKCVersionDocumentID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCVersionBody not string', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCVersionBody: null,
		})), {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionDate not date', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCVersionDate: new Date('alfa'),
		})), {
			WKCVersionDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKCVersionModelErrorsFor(kTesting.StubDocumentObjectValid()), null);
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
