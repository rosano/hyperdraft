/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var modelLibrary = require('./model');

const kTesting = {
	kTestingValidSnapshot: function() {
		return {
			WKCSnapshotSubscriptionID: 'alfa',
			WKCSnapshotBody: 'bravo',
		};
	},
};

describe('WKCSnapshotsModelErrorsFor', function testnapshotsModelErrorsFor() {

	it('throws error if not object', function() {
		assert.throws(function() {
			modelLibrary.WKCSnapshotsModelErrorsFor(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns false with WKCErrors if WKCSnapshotSubscriptionID not string', function() {
		var item = Object.assign(kTesting.kTestingValidSnapshot(), {
			WKCSnapshotSubscriptionID: null,
		});

		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(item), {
			WKCSnapshotSubscriptionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns false with WKCErrors if WKCSnapshotSubscriptionID not unempty', function() {
		var item = Object.assign(kTesting.kTestingValidSnapshot(), {
			WKCSnapshotSubscriptionID: '',
		});

		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(item), {
			WKCSnapshotSubscriptionID: [
				'WKCErrorNotUnempty',
			],
		});
	});

	it('returns errors if WKCSnapshotBody not string', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(Object.assign(kTesting.kTestingValidSnapshot(), {
			WKCSnapshotBody: null,
		})), {
			WKCSnapshotBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(kTesting.kTestingValidSnapshot()), null);
	});

});

describe('WKCSnapshotHiddenPropertyNames', function testnapshotHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotHiddenPropertyNames(), [
			'_id',
		]);
	});

});
