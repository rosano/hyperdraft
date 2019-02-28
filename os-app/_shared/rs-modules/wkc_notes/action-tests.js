const assert = require('assert');

const mainModule = require('./action.js');
const WKCVersionsAction = require('../wkc_versions/action.js');
const storageClient = require('../../WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wkc_notes: null,
	wkc_versions: null,
});

const kTesting = {
	StubNoteObject: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
	uSerial: function (inputData) {
		return inputData.reduce(async function (coll, e) {
			return e.then(Array.prototype.concat.bind(await coll));
		}, Promise.resolve([]));
	},
	uSleep: function (inputData) {
		let endTime = new Date().getTime();
		while (new Date().getTime() < endTime + inputData) {}
	},
};

beforeEach(async function() {
	await Promise.all(Object.keys(await storageClient.wkc_notes.listObjects()).map(storageClient.wkc_notes.deleteObject));
	// await Promise.all(Object.keys(await storageClient.wkc_versions.listObjects()).map(storageClient.wkc_versions.deleteObject));
});
describe('WKCNotesActionCreate', function testWKCNotesActionCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesActionCreate(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesActionCreate(storageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		}))).WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject());

		assert.deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteCreationDate: item.WKCNoteCreationDate,
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCNoteID to unique value', async function() {
		let items = []

		Array.from(Array(10)).forEach(async function (e) {
			items.push((await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteID);
		});
		assert.deepEqual((new Set(items)).values(), items);
	});

	it('sets WKCNoteCreationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteCreationDate < 100, true);
	});

	it('sets WKCNoteModificationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteModificationDate < 100, true);
	});

});

describe('WKCNotesActionUpdate', function testWKCNotesActionUpdate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesActionUpdate(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesActionUpdate(storageClient, Object.assign(await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject()), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCNote', async function() {
		let itemCreated = await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject());

		let item = await mainModule.WKCNotesActionUpdate(storageClient, itemCreated);

		assert.deepEqual(item, Object.assign(itemCreated, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
		}));
	});

	it('sets WKCNoteModificationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionUpdate(storageClient, await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject()))).WKCNoteModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mainModule.WKCNotesActionUpdate(storageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: 'alfa',
			WKCNoteCreationDate: new Date(),
		}));
		assert.deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteCreationDate: item.WKCNoteCreationDate,
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

});

describe('WKCNotesActionQuery', function testWKCNotesActionQuery() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesActionQuery(WKCTestingMongoClient, null), /WKCErrorInputInvalid/);
	});

	it('returns array', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionQuery(storageClient, {}), []);
	});

	it('includes all WKCNotes if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCNotesActionCreate(storageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNoteBody: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCNotesActionQuery(storageClient, {}), items.reverse());
	});

	it('filters by WKCNoteID', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCNotesActionCreate(storageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNoteID: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCNotesActionQuery(storageClient, {
			WKCNoteID: items.slice(-1).pop().WKCNoteID,
		}), items.slice(-1));
	});

});

describe('WKCNotesActionDelete', function testWKCNotesActionDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesActionDelete(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionDelete(storageClient, (await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes WKCNote', async function() {
		await mainModule.WKCNotesActionDelete(storageClient, (await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteID);
		assert.deepEqual(await mainModule.WKCNotesActionQuery(storageClient, {}), []);
	});

	it('deletes corresponding versionObjects', async function() {
		await mainModule.WKCNotesActionDelete(storageClient, (await WKCVersionsAction.WKCVersionsActionCreate(storageClient, {
			WKCVersionBody: 'charlie',
			WKCVersionNoteID: (await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteID,
			WKCVersionDate: new Date(),
		})).WKCVersionNoteID);
		assert.deepEqual(await WKCVersionsAction.WKCVersionsActionQuery(storageClient, {}), []);
	});

});
