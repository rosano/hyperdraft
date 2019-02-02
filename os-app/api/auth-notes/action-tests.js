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
	StubValidNote: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
	StubValidVersion: function() {
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
		let itemCreated = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		let itemUpdated = await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, itemCreated.WKCNoteID);

		assert.deepEqual(itemUpdated, Object.assign(itemCreated, {
			WKCNoteDateUpdated: itemUpdated.WKCNoteDateUpdated,
			WKCNotePublishStatusIsPublished: true,
			WKCNotePublicID: '1',
		}));
	});

	it('returns WKCNote with updates if one published', async function() {
		let itemCreated = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		let itemUpdated = await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, itemCreated.WKCNoteID);

		let itemCreated2 = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		let itemUpdated2 = await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, itemCreated2.WKCNoteID);

		// let items = await Promise.all(['alfa', 'bravo'].map(async function (e) {
		// 	return await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, (await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubValidNote(), {
		// 		WKCNoteBody: e,
		// 	}))).WKCNoteID);
		// }));

		assert.deepEqual([itemUpdated, itemUpdated2].map(function (e) {
			return e.WKCNotePublicID;
		}).sort(), ['1','2'].sort());
	});

	it('returns WKCNote with updates if multiple published and deleted', async function() {
		let itemCreated = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		let itemUpdated = await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, itemCreated.WKCNoteID);
		await metalLibrary.WKCNotesMetalDelete(WKCTestingMongoClient, itemCreated.WKCNoteID)

		let itemCreated2 = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		let itemUpdated2 = await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, itemCreated2.WKCNoteID);

		await metalLibrary.WKCNotesMetalDelete(WKCTestingMongoClient, itemCreated2.WKCNoteID)
		// await Promise.all(['alfa', 'bravo'].map(async function (e) {
		// 	return await metalLibrary.WKCNotesMetalDelete(WKCTestingMongoClient, (await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, (await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubValidNote(), {
		// 		WKCNoteBody: e,
		// 	}))).WKCNoteID)).WKCNoteID);
		// }));

		assert.deepEqual((await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, (await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote())).WKCNoteID)).WKCNotePublicID, '3');
	});

});

describe('WKCNotesActionVersion', function testWKCNotesActionVersion() {

	it('rejects if not valid', async function() {
		await assert.rejects(mainModule.WKCNotesActionVersion(WKCTestingMongoClient, {}), /WKCErrorInvalidInput/)
	});

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionVersion(WKCTestingMongoClient, kTesting.StubValidVersion()), new Error('WKCErrorNotFound'))
	});

	it('returns WKCNote with updates if none published', async function() {
		let itemCreated = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		let versionObject = Object.assign(kTesting.StubValidVersion(), {
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
