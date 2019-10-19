import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubDocumentObjectValid: function() {
		return {
			WKXVersionID: 'alfa',
			WKXVersionDocumentID: 'bravo',
			WKXVersionBody: '',
			WKXVersionDate: new Date(),
		};
	},
};

describe('WKXVersionModelErrorsFor', function testWKXVersionModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.WKXVersionModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKXVersionID not string', function() {
		deepEqual(mainModule.WKXVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXVersionID: null,
		})), {
			WKXVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKXVersionID not filled', function() {
		deepEqual(mainModule.WKXVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXVersionID: ' ',
		})), {
			WKXVersionID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKXVersionDocumentID not string', function() {
		deepEqual(mainModule.WKXVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXVersionDocumentID: null,
		})), {
			WKXVersionDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKXVersionDocumentID not filled', function() {
		deepEqual(mainModule.WKXVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXVersionDocumentID: ' ',
		})), {
			WKXVersionDocumentID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKXVersionBody not string', function() {
		deepEqual(mainModule.WKXVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXVersionBody: null,
		})), {
			WKXVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKXVersionDate not date', function() {
		deepEqual(mainModule.WKXVersionModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXVersionDate: new Date('alfa'),
		})), {
			WKXVersionDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKXVersionModelErrorsFor(kTesting.StubDocumentObjectValid()), null);
	});

});

describe('WKXVersionModelPreJSONSchemaValidate', function testWKXVersionModelPreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mainModule.WKXVersionModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKXVersionDate as string', function() {
		deepEqual(mainModule.WKXVersionModelPreJSONSchemaValidate({
			WKXVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKXVersionDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKXVersionModelPostJSONParse', function testWKXVersionModelPostJSONParse() {

	it('returns input null', function() {
		deepEqual(mainModule.WKXVersionModelPostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mainModule.WKXVersionModelPostJSONParse({}), {});
	});

	it('returns input with WKXVersionDate as date', function() {
		deepEqual(mainModule.WKXVersionModelPostJSONParse({
			WKXVersionDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKXVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
