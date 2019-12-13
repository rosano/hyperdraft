const { rejects, deepEqual } = require('assert');

const mainModule = require('./action.js');
const KVCVersionsAction = require('../KVCVersion/action.js');

const kTesting = {
	StubNoteObject() {
		return {
			KVCNoteBody: 'bravo',
		};
	},
	uSerial (inputData) {
		return inputData.reduce(async function (coll, e) {
			return e.then(Array.prototype.concat.bind(await coll));
		}, Promise.resolve([]));
	},
	uSleep (inputData) {
		let endTime = new Date().getTime();
		while (new Date().getTime() < endTime + inputData) {}
	},
};

describe('KVCNoteActionCreate', function testKVCNoteActionCreate() {

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
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
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

describe('KVCNoteActionRead', function testKVCNoteActionRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCNoteActionRead(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.KVCNoteActionRead(KVCTestingStorageClient, 'alfa'), null);
	});

	it('returns KVCNote', async function() {
		let item = await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		deepEqual(item, await mainModule.KVCNoteActionRead(KVCTestingStorageClient, item.KVCNoteID));
	});

});

describe('KVCNoteActionUpdate', function testKVCNoteActionUpdate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, Object.assign(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), {
			KVCNoteID: null,
		}))).KVCErrors, {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
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
		}));
		deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteID: item.KVCNoteID,
			KVCNoteCreationDate: item.KVCNoteCreationDate,
			KVCNoteModificationDate: item.KVCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

});

describe('KVCNoteActionDelete', function testKVCNoteActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCNoteActionDelete(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes KVCNote', async function() {
		let itemID;
		await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, itemID = (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteID);
		deepEqual(await mainModule.KVCNoteActionRead(KVCTestingStorageClient, itemID), null);
	});

	it('deletes corresponding versionObjects', async function() {
		await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, (await KVCVersionsAction.KVCVersionActionCreate(KVCTestingStorageClient, {
			KVCVersionBody: 'charlie',
			KVCVersionNoteID: (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteID,
			KVCVersionDate: new Date(),
		})).KVCVersionNoteID);
		deepEqual(await KVCVersionsAction.KVCVersionActionQuery(KVCTestingStorageClient, {}), []);
	});

});

describe('KVCNoteActionQuery', function testKVCNoteActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteActionQuery(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('includes all KVCNotes if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteBody: e,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteID: e,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {
			KVCNoteID: items.slice(-1).pop().KVCNoteID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		let items = await kTesting.uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNotePublishStatusIsPublished: !!index,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {
			KVCNotePublishStatusIsPublished: false,
		}), items.slice(0, 1));
	});

});

describe('KVCNoteActionPublish', function testKVCNoteActionPublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteActionPublish(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, Object.assign(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), {
			KVCNoteID: null,
		}))).KVCErrors, {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
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

	it('sets KVCNotePublicID to 1 if none published', async function() {
		deepEqual((await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID, '1');
	});

	it('sets KVCNotePublicID to 2 if one published and deleted', async function() {
		mainModule.KVCNoteActionDelete(KVCTestingStorageClient, await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())));
		deepEqual((await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID, '2');
	});

	it('sets KVCNotePublicID to 3 if two published and deleted', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function () {
					return await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, (await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
						KVCNoteBody: e,
					}))))).KVCNoteID);
				});

				return coll;
			}, Promise.resolve());
		};

		await serialPromises();

		deepEqual((await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())))).KVCNotePublicID, '3');
	});

});

describe('KVCNoteActionRetract', function testKVCNoteActionRetract() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteActionPublish(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, Object.assign(await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), {
			KVCNoteID: null,
		}))).KVCErrors, {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
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

});

describe('KVCNoteActionGetPublicLinks', function testKVCNoteActionGetPublicLinks() {

	it('returns hash', async function() {
		deepEqual(await mainModule.KVCNoteActionGetPublicLinks(KVCTestingStorageClient), {});
	});

	it('excludes if KVCNotePublishStatusIsPublished false', async function() {
		await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(await mainModule.KVCNoteActionGetPublicLinks(KVCTestingStorageClient), {});
	});

	it('includes if KVCNotePublishStatusIsPublished true', async function() {
		let item = await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())));

		deepEqual(await mainModule.KVCNoteActionGetPublicLinks(KVCTestingStorageClient), [[item.KVCNoteBody, item.KVCNotePublicID]].reduce(function (coll, e) {
			coll[e[0]] = e[1];

			return coll;
		}, {}));
	});

	it('selects last updated note if duplicate title', async function() {
		await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: `heading\nalfa`,
		}))));
		kTesting.uSleep(1);
		await mainModule.KVCNoteActionPublish(KVCTestingStorageClient, (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: `heading\nbravo`,
		}))));

		deepEqual(await mainModule.KVCNoteActionGetPublicLinks(KVCTestingStorageClient), {
			heading: '2',
		});
	});

});
