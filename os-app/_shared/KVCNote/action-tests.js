const { rejects, deepEqual } = require('assert');

const mainModule = require('./action.js').default;
const KVCNoteStorage = require('./storage.js').default;
const KVCVersionsAction = require('../KVCVersion/action.js').default;

const kTesting = {
	StubNoteObject() {
		return {
			KVCNoteBody: 'bravo',
		};
	},
};

describe('KVCNoteActionCreate', function test_KVCNoteActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteActionCreate(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: null,
		}))).KVCErrors, {
			KVCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns KVCNote', async function() {
		let item = await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteID: item.KVCNoteID,
			KVCNoteCreationDate: item.KVCNoteCreationDate,
			KVCNoteModificationDate: item.KVCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets KVCNoteID to unique value', async function() {
		let items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets KVCNoteCreationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteCreationDate < 100, true);
	});

	it('sets KVCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteModificationDate < 100, true);
	});

});

describe('KVCNoteActionUpdate', function test_KVCNoteActionUpdate() {

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('returns KVCNote', async function() {
		let itemCreated = await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		let item = await mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			KVCNoteModificationDate: item.KVCNoteModificationDate,
		}));
	});

	it('sets KVCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNoteModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteID: 'alfa',
			KVCNoteCreationDate: new Date(),
			KVCNoteModificationDate: new Date(),
		}));
		deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteID: item.KVCNoteID,
			KVCNoteCreationDate: item.KVCNoteCreationDate,
			KVCNoteModificationDate: item.KVCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

});

describe('KVCNoteActionDelete', function test_KVCNoteActionDelete() {

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteActionDelete(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), {
			statusCode: 200,
		});
	});

	it('deletes KVCNote', async function() {
		await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('deletes corresponding versionObjects', async function() {
		const item = await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		await KVCVersionsAction.KVCVersionActionCreate(KVCTestingStorageClient, {
			KVCVersionBody: 'charlie',
			KVCVersionNoteID: item.KVCNoteID,
			KVCVersionDate: new Date(),
		});

		await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, item);
		deepEqual(await KVCVersionsAction.KVCVersionActionQuery(KVCTestingStorageClient, {}), []);
	});

});

describe('KVCNoteActionQuery', function test_KVCNoteActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteActionQuery(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('includes all KVCNotes if no query', async function() {
		let items = await uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			uSleep(1);
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteBody: e,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		let items = await uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteID: e,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {
			KVCNoteID: items.slice(-1).pop().KVCNoteID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		let items = await uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNotePublishStatusIsPublished: !!index,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {
			KVCNotePublishStatusIsPublished: false,
		}), items.slice(0, 1));
	});

});

describe('KVCNoteActionPublish', function test_KVCNoteActionPublish() {

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteActionPublish(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('returns KVCNote', async function() {
		let itemCreated = await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		let item = await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			KVCNoteModificationDate: item.KVCNoteModificationDate,
			KVCNotePublishStatusIsPublished: item.KVCNotePublishStatusIsPublished,
			KVCNotePublicID: item.KVCNotePublicID,
		}));
	});

	it('sets KVCNotePublishStatusIsPublished to true', async function() {
		deepEqual((await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublishStatusIsPublished, true);
	});

	it('sets KVCNotePublicID to lowercase', async function() {
		const item = (await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID;
		deepEqual(item, item.toLowerCase());
	});

	it('sets KVCNotePublicID to unique value', async function() {
		let items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('keeps existing KVCNotePublicID', async function() {
		const item = await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		const id = item.KVCNotePublicID;

		deepEqual((await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, item)).KVCNotePublicID, id);
	});

	it('keeps existing KVCNotePublicID', async function() {
		const item = await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		const id = item.KVCNotePublicID;

		deepEqual((await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, item)).KVCNotePublicID, id);
	});

	it('writes file to public folder', async function() {
		const item = await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'bravo');
	});

});

describe('KVCNoteActionRetract', function test_KVCNoteActionRetract() {

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteActionPublish(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('returns KVCNote', async function() {
		let item = await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));

		deepEqual(await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, item), Object.assign(item, {
			KVCNoteModificationDate: item.KVCNoteModificationDate,
			KVCNotePublishStatusIsPublished: item.KVCNotePublishStatusIsPublished,
		}));
	});

	it('sets KVCNotePublishStatusIsPublished to false', async function() {
		deepEqual((await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())))).KVCNotePublishStatusIsPublished, false);
	});

	it('deletes file from public folder', async function() {
		const item = await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())));

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

});

describe('KVCNoteActionPublicTitlePathMap', function test_KVCNoteActionPublicTitlePathMap() {

	it('returns object', async function() {
		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient), {});
	});

	it('excludes if KVCNotePublishStatusIsPublished false', async function() {
		await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient), {});
	});

	it('includes if KVCNotePublishStatusIsPublished true', async function() {
		const item = await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())));
		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient), [[item.KVCNoteBody, item.KVCNotePublicID]].reduce(function (coll, e) {
			coll[e[0]] = e[1];

			return coll;
		}, {}));
	});

	it('selects last updated note if duplicate title', async function() {
		await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: 'heading\nalfa',
		}))));
		
		const item = await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: `heading\nbravo`,
		}))));

		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient), {
			heading: item.KVCNotePublicID,
		});
	});

});

