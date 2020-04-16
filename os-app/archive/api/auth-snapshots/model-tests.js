/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const modelLibrary = require('./model.js');

const kTesting = {
	StubValidSnapshot() {
		return {
			WKCSnapshotSubscriptionID: 'alfa',
			WKCSnapshotBody: 'bravo',
		};
	},
};

describe('WKCSnapshotsModelErrorsFor', function test_napshotsModelErrorsFor() {

	it('throws error if not object', function() {
		assert.throws(function() {
			modelLibrary.WKCSnapshotsModelErrorsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false with KVCErrors if WKCSnapshotSubscriptionID not string', function() {
		var item = Object.assign(kTesting.StubValidSnapshot(), {
			WKCSnapshotSubscriptionID: null,
		});

		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(item), {
			WKCSnapshotSubscriptionID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns false with KVCErrors if WKCSnapshotSubscriptionID not unempty', function() {
		var item = Object.assign(kTesting.StubValidSnapshot(), {
			WKCSnapshotSubscriptionID: '',
		});

		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(item), {
			WKCSnapshotSubscriptionID: [
				'KVCErrorNotUnempty',
			],
		});
	});

	it('returns errors if WKCSnapshotBody not string', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(Object.assign(kTesting.StubValidSnapshot(), {
			WKCSnapshotBody: null,
		})), {
			WKCSnapshotBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(kTesting.StubValidSnapshot()), null);
	});

});

describe('WKCSnapshotHiddenPropertyNames', function test_napshotHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotHiddenPropertyNames(), [
			'_id',
		]);
	});

});
