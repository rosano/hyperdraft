/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./action.js');
var metalLibrary = require('./metal.js');
var versionsMetalLibrary = require('../auth-versions/metal.js');

const kTesting = {
	StubNoteObjectValid: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
	StubVersionObjectValid: function() {
		return {
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
			WKCVersionDate: new Date('2019-01-30T18:10:00.000Z'),
		};
	},
};

describe('WKCNotesActionPublish', function testWKCNotesActionPublish() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesActionPublish(WKCTestingMongoClient, null), /WKCErrorInvalidInput/)
	});

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, 'alfa'), new Error('WKCErrorNotFound'))
	});

	it('returns WKCNote with updates if none published', async function() {
		let itemCreated = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubNoteObjectValid());
		let itemUpdated = await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, itemCreated.WKCNoteID);

		assert.deepEqual(itemUpdated, Object.assign(itemCreated, {
			WKCNoteDateUpdated: itemUpdated.WKCNoteDateUpdated,
			WKCNotePublishStatusIsPublished: true,
			WKCNotePublicID: '1',
		}));
	});

	it('increments WKCSettingsLastRepoID if one published', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function (result) {
					return result.concat([
						await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, (await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubNoteObjectValid(), {
							WKCNoteBody: e,
						}))).WKCNoteID)
						]);
				});

				return coll;
			}, Promise.resolve([]));
		};

		assert.deepEqual((await serialPromises()).map(function (e) {
			return e.WKCNotePublicID;
		}).sort(), ['1','2'].sort());
	});

	it('does not reuse WKCSettingsLastRepoID', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function () {
					await metalLibrary.WKCNotesMetalDelete(WKCTestingMongoClient, (await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, (await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubNoteObjectValid(), {
						WKCNoteBody: e,
					}))).WKCNoteID)).WKCNoteID);
				});

				return coll;
			}, Promise.resolve());
		};

		await serialPromises();

		assert.deepEqual((await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, (await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubNoteObjectValid())).WKCNoteID)).WKCNotePublicID, '3');
	});

});

describe('WKCNotesActionPublicRead', function testWKCNotesActionPublicRead() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesActionPublicRead(WKCTestingMongoClient, 1), /WKCErrorInvalidInput/);
	});

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionPublicRead(WKCTestingMongoClient, 'alfa'), new Error('WKCErrorNotFound'))
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, (await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubNoteObjectValid())).WKCNoteID);

		assert.deepEqual(await mainModule.WKCNotesActionPublicRead(WKCTestingMongoClient, item.WKCNotePublicID), item);
	});

	it('returns null if not WKCNotePublishStatusIsPublished', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionUnpublish(WKCTestingMongoClient, (await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, (await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubNoteObjectValid())).WKCNoteID)).WKCNoteID).WKCNotePublicID, null);
	});

});

describe('WKCNotesActionUnpublish', function testWKCNotesActionUnpublish() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesActionUnpublish(WKCTestingMongoClient, null), /WKCErrorInvalidInput/)
	});

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionUnpublish(WKCTestingMongoClient, 'alfa'), new Error('WKCErrorNotFound'))
	});

	it('returns updated WKCNote', async function() {
		let itemCreated = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubNoteObjectValid());
		let itemUpdated = await mainModule.WKCNotesActionUnpublish(WKCTestingMongoClient, (await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, itemCreated.WKCNoteID)).WKCNoteID);

		assert.deepEqual(itemUpdated, Object.assign(itemCreated, {
			WKCNoteDateUpdated: itemUpdated.WKCNoteDateUpdated,
			WKCNotePublishStatusIsPublished: false,
			WKCNotePublicID: '1',
		}));
	});

});

describe('WKCNotesActionVersion', function testWKCNotesActionVersion() {

	it('rejects if not valid', async function() {
		await assert.rejects(mainModule.WKCNotesActionVersion(WKCTestingMongoClient, {}), /WKCErrorInvalidInput/)
	});

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionVersion(WKCTestingMongoClient, kTesting.StubVersionObjectValid()), new Error('WKCErrorNotFound'))
	});

	it('returns WKCNote with updates if none published', async function() {
		let itemCreated = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubNoteObjectValid());
		let versionObject = Object.assign(kTesting.StubVersionObjectValid(), {
			WKCVersionNoteID: itemCreated.WKCNoteID,
		});
		let itemUpdated = await mainModule.WKCNotesActionVersion(WKCTestingMongoClient, versionObject);

		assert.deepEqual(itemUpdated, Object.assign(itemCreated, {
			WKCNoteDateUpdated: itemUpdated.WKCNoteDateUpdated,
			WKCNoteBody: 'bravo',
		}));
		assert.deepEqual(await versionsMetalLibrary.WKCVersionsMetalSearch(WKCTestingMongoClient, {}), [Object.assign(versionObject)]);
	});

});
