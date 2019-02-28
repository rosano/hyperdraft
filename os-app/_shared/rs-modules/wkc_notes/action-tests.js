const assert = require('assert');

const mainModule = require('./action.js');
const WKCVersionsAction = require('../wkc_versions/action.js');

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

describe('WKCNotesActionCreate', function testWKCNotesActionCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesActionCreate(WKCTestingStorageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		}))).WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject());

		assert.deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteCreationDate: item.WKCNoteCreationDate,
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCNoteID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID;
		}));
		assert.deepEqual([...(new Set(items))], items);
	});

	it('sets WKCNoteCreationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteCreationDate < 100, true);
	});

	it('sets WKCNoteModificationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteModificationDate < 100, true);
	});

});

describe('WKCNotesActionUpdate', function testWKCNotesActionUpdate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesActionUpdate(WKCTestingStorageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesActionUpdate(WKCTestingStorageClient, Object.assign(await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCNote', async function() {
		let itemCreated = await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject());

		let item = await mainModule.WKCNotesActionUpdate(WKCTestingStorageClient, itemCreated);

		assert.deepEqual(item, Object.assign(itemCreated, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
		}));
	});

	it('sets WKCNoteModificationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionUpdate(WKCTestingStorageClient, await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNoteModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mainModule.WKCNotesActionUpdate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
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
		await assert.rejects(mainModule.WKCNotesActionQuery(WKCTestingStorageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns array', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionQuery(WKCTestingStorageClient, {}), []);
	});

	it('includes all WKCNotes if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNoteBody: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCNotesActionQuery(WKCTestingStorageClient, {}), items.reverse());
	});

	it('filters by WKCNoteID', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNoteID: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCNotesActionQuery(WKCTestingStorageClient, {
			WKCNoteID: items.slice(-1).pop().WKCNoteID,
		}), items.slice(-1));
	});

});

describe('WKCNotesActionDelete', function testWKCNotesActionDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesActionDelete(WKCTestingStorageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionDelete(WKCTestingStorageClient, (await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes WKCNote', async function() {
		await mainModule.WKCNotesActionDelete(WKCTestingStorageClient, (await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID);
		assert.deepEqual(await mainModule.WKCNotesActionQuery(WKCTestingStorageClient, {}), []);
	});

	it('deletes corresponding versionObjects', async function() {
		await mainModule.WKCNotesActionDelete(WKCTestingStorageClient, (await WKCVersionsAction.WKCVersionsActionCreate(WKCTestingStorageClient, {
			WKCVersionBody: 'charlie',
			WKCVersionNoteID: (await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID,
			WKCVersionDate: new Date(),
		})).WKCVersionNoteID);
		assert.deepEqual(await WKCVersionsAction.WKCVersionsActionQuery(WKCTestingStorageClient, {}), []);
	});

});

describe('WKCNotesActionPublish', function testWKCNotesActionPublish() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesActionPublish(WKCTestingStorageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, Object.assign(await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCNote', async function() {
		let itemCreated = await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject());

		let item = await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, itemCreated);

		assert.deepEqual(item, Object.assign(itemCreated, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			WKCNotePublishStatusIsPublished: item.WKCNotePublishStatusIsPublished,
			WKCNotePublicID: item.WKCNotePublicID,
		}));
	});

	it('sets WKCNotePublishStatusIsPublished to true', async function() {
		assert.strictEqual((await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublishStatusIsPublished, true);
	});

	it('sets WKCNotePublicID to 1 if none published', async function() {
		assert.strictEqual((await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublicID, '1');
	});

	it('sets WKCNotePublicID to 2 if one published', async function() {
		await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()));
		assert.strictEqual((await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublicID, '2');
	});

	it('sets WKCNotePublicID to 2 if one published and deleted', async function() {
		mainModule.WKCNotesActionDelete(WKCTestingStorageClient, await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())));
		assert.strictEqual((await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublicID, '2');
	});

	it('sets WKCNotePublicID to 3 if two published and deleted', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function () {
					return await mainModule.WKCNotesActionDelete(WKCTestingStorageClient, (await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, (await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
						WKCNoteBody: e,
					}))))).WKCNoteID);
				});

				return coll;
			}, Promise.resolve());
		};

		await serialPromises();

		assert.deepEqual((await mainModule.WKCNotesActionPublish(WKCTestingStorageClient, (await mainModule.WKCNotesActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())))).WKCNotePublicID, '3');
	});

});
