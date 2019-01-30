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
			WKCVersionDateCreated: new Date(),
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

	it('returns object if WKCVersionDateCreated not date', function() {
		assert.deepEqual(mainModule.WKCVersionsModelErrorsFor(Object.assign(kTesting.kTestingValidVersion(), {
			WKCVersionDateCreated: new Date('alfa'),
		})), {
			WKCVersionDateCreated: [
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
