/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var metalLibrary = require('./metal');

const kTesting = {
	kTestingValidSnapshot: function() {
		return {
			WKCSnapshotSubscriptionID: 'alfa',
			WKCSnapshotBody: 'bravo',
		};
	},
};

describe('WKCSnapshotsMetalCreate', function tesSnapshotsMetalCreate() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCSnapshotsMetalCreate(WKCTestingMongoClient, '', function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCSnapshotsMetalCreate(WKCTestingMongoClient, {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns WKCErrors if not valid WKCSnapshot', function(done) {
		metalLibrary.WKCSnapshotsMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSnapshot(), {
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
		metalLibrary.WKCSnapshotsMetalCreate(WKCTestingMongoClient, kTesting.kTestingValidSnapshot(), function(err, responseJSON) {
			assert.deepEqual(responseJSON, Object.assign(kTesting.kTestingValidSnapshot(), {
				WKCSnapshotID: responseJSON.WKCSnapshotID,
				WKCSnapshotID2: responseJSON.WKCSnapshotID2,
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
