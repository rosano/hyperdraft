/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const modelLibrary = require('./model.js');

const kTesting = {
	StubValidSnapshot: function() {
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
		}, /WKCErrorInputNotValid/);
	});

	it('returns false with WKCErrors if WKCSnapshotSubscriptionID not string', function() {
		var item = Object.assign(kTesting.StubValidSnapshot(), {
			WKCSnapshotSubscriptionID: null,
		});

		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(item), {
			WKCSnapshotSubscriptionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns false with WKCErrors if WKCSnapshotSubscriptionID not unempty', function() {
		var item = Object.assign(kTesting.StubValidSnapshot(), {
			WKCSnapshotSubscriptionID: '',
		});

		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(item), {
			WKCSnapshotSubscriptionID: [
				'WKCErrorNotUnempty',
			],
		});
	});

	it('returns errors if WKCSnapshotBody not string', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(Object.assign(kTesting.StubValidSnapshot(), {
			WKCSnapshotBody: null,
		})), {
			WKCSnapshotBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotsModelErrorsFor(kTesting.StubValidSnapshot()), null);
	});

});

describe('WKCSnapshotHiddenPropertyNames', function testnapshotHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(modelLibrary.WKCSnapshotHiddenPropertyNames(), [
			'_id',
		]);
	});

});
