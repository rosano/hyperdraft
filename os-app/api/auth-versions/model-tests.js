/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./model');

const kTesting = {
	kTestingValidVersion: function() {
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
		}, /WKCErrorInvalidInput/);
	});

	it('returns object if WKCVersionNoteID not string', function() {
		var item = Object.assign(kTesting.kTestingValidVersion(), {
			WKCVersionNoteID: null,
		});

		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(item), {
			WKCVersionNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionNoteID not unempty', function() {
		var item = Object.assign(kTesting.kTestingValidVersion(), {
			WKCVersionNoteID: '',
		});

		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(item), {
			WKCVersionNoteID: [
				'WKCErrorNotUnempty',
			],
		});
	});

	it('returns object if WKCVersionBody not string', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.kTestingValidVersion(), {
			WKCVersionBody: null,
		})), {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCVersionDate not date', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.kTestingValidVersion(), {
			WKCVersionDate: new Date('alfa'),
		})), {
			WKCVersionDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(kTesting.kTestingValidVersion()), null);
	});

});

describe('WKCVersionsHiddenPropertyNames', function testWKCVersionsHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCVersionsHiddenPropertyNames(), [
			'_id',
		]);
	});

});
