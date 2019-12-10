/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./metal.js');

const kTesting = {
	StubValidSnapshot() {
		return {
			WKCSnapshotSubscriptionID: 'alfa',
			WKCSnapshotBody: 'bravo',
		};
	},
};

describe('WKCSnapshotsMetalCreate', function tesSnapshotsMetalCreate() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			mainModule.WKCSnapshotsMetalCreate(KVCTestingMongoClient, '', function() {});
		}, /WKCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCSnapshotsMetalCreate(KVCTestingMongoClient, {}, null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns WKCErrors if not valid WKCSnapshot', function(done) {
		mainModule.WKCSnapshotsMetalCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSnapshot(), {
			WKCSnapshotBody: null,
		}), function(err, responseJSON) {
			assert.deepEqual(responseJSON.WKCErrors, {
				WKCSnapshotBody: [
					'WKCErrorNotString',
				],
			});

			done();
		});
	});

	it('returns WKCSnapshot', function(done) {
		mainModule.WKCSnapshotsMetalCreate(KVCTestingMongoClient, kTesting.StubValidSnapshot(), function(err, responseJSON) {
			assert.deepEqual(responseJSON, Object.assign(kTesting.StubValidSnapshot(), {
				WKCSnapshotID: responseJSON.WKCSnapshotID,
				WKCSnapshotDateCreated: responseJSON.WKCSnapshotDateCreated,
				WKCSnapshotDateUpdated: responseJSON.WKCSnapshotDateUpdated,
			}));

			assert.strictEqual(parseInt(responseJSON.WKCSnapshotID) - (new Date()) > -500, true);
			assert.strictEqual(responseJSON.WKCSnapshotDateCreated - (new Date()) > -500, true);
			assert.strictEqual(responseJSON.WKCSnapshotDateUpdated - (new Date()) > -500, true);

			done();
		});
	});

});
