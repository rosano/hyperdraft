/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubValidVersion: function() {
		return {
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
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

	it('returns object if WKCVersionNoteID not string', function() {
		var item = Object.assign(kTesting.StubValidVersion(), {
			WKCVersionNoteID: null,
		});

		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(item), {
			WKCVersionNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionNoteID not unempty', function() {
		var item = Object.assign(kTesting.StubValidVersion(), {
			WKCVersionNoteID: '',
		});

		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(item), {
			WKCVersionNoteID: [
				'WKCErrorNotUnempty',
			],
		});
	});

	it('returns object if WKCVersionBody not string', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubValidVersion(), {
			WKCVersionBody: null,
		})), {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionDate not date', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.StubValidVersion(), {
			WKCVersionDate: new Date('alfa'),
		})), {
			WKCVersionDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(kTesting.StubValidVersion()), null);
	});

});

describe('WKCVersionsModelPrepare', function testWKCVersionsModelPrepare() {

	it('returns input', function() {
		assert.deepEqual(mainModule.WKCVersionsModelPrepare({}), {});
	});

	it('parses WKCVersionDate as date', function() {
		assert.deepEqual(mainModule.WKCVersionsModelPrepare({
			WKCVersionDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCVersionDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});

describe('WKCVersionsHiddenPropertyNames', function testWKCVersionsHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCVersionsHiddenPropertyNames(), [
			'_id',
		]);
	});

});
