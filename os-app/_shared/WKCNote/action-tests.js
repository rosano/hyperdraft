const { rejects, deepEqual } = require('assert');

const mainModule = require('./action.js');
const WKCVersionsAction = require('../WKCVersion/action.js');

const kTesting = {
	StubNoteObject() {
		return {
			WKCNoteBody: 'bravo',
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

describe('WKCNoteActionCreate', function testWKCNoteActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionCreate(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		}))).KVCErrors, {
			WKCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteCreationDate: item.WKCNoteCreationDate,
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCNoteID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets WKCNoteCreationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteCreationDate < 100, true);
	});

	it('sets WKCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteModificationDate < 100, true);
	});

});

describe('WKCNoteActionRead', function testWKCNoteActionRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNoteActionRead(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKCNoteActionRead(KVCTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		deepEqual(item, await mainModule.WKCNoteActionRead(KVCTestingStorageClient, item.WKCNoteID));
	});

});

describe('WKCNoteActionUpdate', function testWKCNoteActionUpdate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionUpdate(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteActionUpdate(KVCTestingStorageClient, Object.assign(await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), {
			WKCNoteID: null,
		}))).KVCErrors, {
			WKCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let itemCreated = await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		let item = await mainModule.WKCNoteActionUpdate(KVCTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
		}));
	});

	it('sets WKCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCNoteActionUpdate(KVCTestingStorageClient, await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).WKCNoteModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mainModule.WKCNoteActionUpdate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: 'alfa',
			WKCNoteCreationDate: new Date(),
		}));
		deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteCreationDate: item.WKCNoteCreationDate,
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

});

describe('WKCNoteActionDelete', function testWKCNoteActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNoteActionDelete(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.WKCNoteActionDelete(KVCTestingStorageClient, (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes WKCNote', async function() {
		let itemID;
		await mainModule.WKCNoteActionDelete(KVCTestingStorageClient, itemID = (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID);
		deepEqual(await mainModule.WKCNoteActionRead(KVCTestingStorageClient, itemID), null);
	});

	it('deletes corresponding versionObjects', async function() {
		await mainModule.WKCNoteActionDelete(KVCTestingStorageClient, (await WKCVersionsAction.WKCVersionActionCreate(KVCTestingStorageClient, {
			WKCVersionBody: 'charlie',
			WKCVersionNoteID: (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID,
			WKCVersionDate: new Date(),
		})).WKCVersionNoteID);
		deepEqual(await WKCVersionsAction.WKCVersionActionQuery(KVCTestingStorageClient, {}), []);
	});

});

describe('WKCNoteActionQuery', function testWKCNoteActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionQuery(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.WKCNoteActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('includes all WKCNotes if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNoteBody: e,
			}));
		}));

		deepEqual(await mainModule.WKCNoteActionQuery(KVCTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNoteID: e,
			}));
		}));

		deepEqual(await mainModule.WKCNoteActionQuery(KVCTestingStorageClient, {
			WKCNoteID: items.slice(-1).pop().WKCNoteID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		let items = await kTesting.uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNotePublishStatusIsPublished: !!index,
			}));
		}));

		deepEqual(await mainModule.WKCNoteActionQuery(KVCTestingStorageClient, {
			WKCNotePublishStatusIsPublished: false,
		}), items.slice(0, 1));
	});

});

describe('WKCNoteActionPublish', function testWKCNoteActionPublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionPublish(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, Object.assign(await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), {
			WKCNoteID: null,
		}))).KVCErrors, {
			WKCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let itemCreated = await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		let item = await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			WKCNotePublishStatusIsPublished: item.WKCNotePublishStatusIsPublished,
			WKCNotePublicID: item.WKCNotePublicID,
		}));
	});

	it('sets WKCNotePublishStatusIsPublished to true', async function() {
		deepEqual((await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublishStatusIsPublished, true);
	});

	it('sets WKCNotePublicID to 1 if none published', async function() {
		deepEqual((await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublicID, '1');
	});

	it('sets WKCNotePublicID to 2 if one published and deleted', async function() {
		mainModule.WKCNoteActionDelete(KVCTestingStorageClient, await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())));
		deepEqual((await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublicID, '2');
	});

	it('sets WKCNotePublicID to 3 if two published and deleted', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function () {
					return await mainModule.WKCNoteActionDelete(KVCTestingStorageClient, (await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
						WKCNoteBody: e,
					}))))).WKCNoteID);
				});

				return coll;
			}, Promise.resolve());
		};

		await serialPromises();

		deepEqual((await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())))).WKCNotePublicID, '3');
	});

});

describe('WKCNoteActionRetract', function testWKCNoteActionRetract() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionPublish(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteActionRetract(KVCTestingStorageClient, Object.assign(await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), {
			WKCNoteID: null,
		}))).KVCErrors, {
			WKCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));

		deepEqual(await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, item), Object.assign(item, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			WKCNotePublishStatusIsPublished: item.WKCNotePublishStatusIsPublished,
		}));
	});

	it('sets WKCNotePublishStatusIsPublished to false', async function() {
		deepEqual((await mainModule.WKCNoteActionRetract(KVCTestingStorageClient, await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())))).WKCNotePublishStatusIsPublished, false);
	});	

});

describe('WKCNoteActionGetPublicLinks', function testWKCNoteActionGetPublicLinks() {

	it('returns hash', async function() {
		deepEqual(await mainModule.WKCNoteActionGetPublicLinks(KVCTestingStorageClient), {});
	});

	it('excludes if WKCNotePublishStatusIsPublished false', async function() {
		await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(await mainModule.WKCNoteActionGetPublicLinks(KVCTestingStorageClient), {});
	});

	it('includes if WKCNotePublishStatusIsPublished true', async function() {
		let item = await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())));

		deepEqual(await mainModule.WKCNoteActionGetPublicLinks(KVCTestingStorageClient), [[item.WKCNoteBody, item.WKCNotePublicID]].reduce(function (coll, e) {
			coll[e[0]] = e[1];

			return coll;
		}, {}));
	});

	it('selects last updated note if duplicate title', async function() {
		await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: `heading\nalfa`,
		}))));
		kTesting.uSleep(1);
		await mainModule.WKCNoteActionPublish(KVCTestingStorageClient, (await mainModule.WKCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: `heading\nbravo`,
		}))));

		deepEqual(await mainModule.WKCNoteActionGetPublicLinks(KVCTestingStorageClient), {
			heading: '2',
		});
	});

});

