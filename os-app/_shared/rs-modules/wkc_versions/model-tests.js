import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubVersionObjectValid: function() {
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
		throws(function() {
			mainModule.WKCVersionsModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKCVersionID not string', function() {
		deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			WKCVersionID: null,
		})), {
			WKCVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionID not filled', function() {
		deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			WKCVersionID: ' ',
		})), {
			WKCVersionID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCVersionBody not string', function() {
		deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			WKCVersionBody: null,
		})), {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionDate not date', function() {
		deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			WKCVersionDate: new Date('alfa'),
		})), {
			WKCVersionDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKCVersionsModelErrorsFor(kTesting.StubVersionObjectValid()), null);
	});

});

describe('WKCVersionsModelPreJSONSchemaValidate', function testWKCVersionsModelPreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mainModule.WKCVersionsModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKCVersionDate as string', function() {
		deepEqual(mainModule.WKCVersionsModelPreJSONSchemaValidate({
			WKCVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCVersionDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKCVersionsModelPostJSONParse', function testWKCVersionsModelPostJSONParse() {

	it('returns input', function() {
		deepEqual(mainModule.WKCVersionsModelPostJSONParse(null), null);
	});

	it('returns input', function() {
		deepEqual(mainModule.WKCVersionsModelPostJSONParse({}), {});
	});

	it('returns input with WKCVersionDate as date', function() {
		deepEqual(mainModule.WKCVersionsModelPostJSONParse({
			WKCVersionDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
