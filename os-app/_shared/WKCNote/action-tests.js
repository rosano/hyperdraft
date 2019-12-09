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
		await rejects(mainModule.WKCNoteActionCreate(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		}))).WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject());

		deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteCreationDate: item.WKCNoteCreationDate,
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCNoteID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets WKCNoteCreationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteCreationDate < 100, true);
	});

	it('sets WKCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteModificationDate < 100, true);
	});

});

describe('WKCNoteActionRead', function testWKCNoteActionRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNoteActionRead(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKCNoteActionRead(WKCTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject());

		deepEqual(item, await mainModule.WKCNoteActionRead(WKCTestingStorageClient, item.WKCNoteID));
	});

});

describe('WKCNoteActionUpdate', function testWKCNoteActionUpdate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionUpdate(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteActionUpdate(WKCTestingStorageClient, Object.assign(await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let itemCreated = await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject());

		let item = await mainModule.WKCNoteActionUpdate(WKCTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
		}));
	});

	it('sets WKCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCNoteActionUpdate(WKCTestingStorageClient, await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNoteModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mainModule.WKCNoteActionUpdate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
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
		await rejects(mainModule.WKCNoteActionDelete(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.WKCNoteActionDelete(WKCTestingStorageClient, (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes WKCNote', async function() {
		let itemID;
		await mainModule.WKCNoteActionDelete(WKCTestingStorageClient, itemID = (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID);
		deepEqual(await mainModule.WKCNoteActionRead(WKCTestingStorageClient, itemID), null);
	});

	it('deletes corresponding versionObjects', async function() {
		await mainModule.WKCNoteActionDelete(WKCTestingStorageClient, (await WKCVersionsAction.WKCVersionActionCreate(WKCTestingStorageClient, {
			WKCVersionBody: 'charlie',
			WKCVersionNoteID: (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())).WKCNoteID,
			WKCVersionDate: new Date(),
		})).WKCVersionNoteID);
		deepEqual(await WKCVersionsAction.WKCVersionActionQuery(WKCTestingStorageClient, {}), []);
	});

});

describe('WKCNoteActionQuery', function testWKCNoteActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionQuery(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.WKCNoteActionQuery(WKCTestingStorageClient, {}), []);
	});

	it('includes all WKCNotes if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNoteBody: e,
			}));
		}));

		deepEqual(await mainModule.WKCNoteActionQuery(WKCTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNoteID: e,
			}));
		}));

		deepEqual(await mainModule.WKCNoteActionQuery(WKCTestingStorageClient, {
			WKCNoteID: items.slice(-1).pop().WKCNoteID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		let items = await kTesting.uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				WKCNotePublishStatusIsPublished: !!index,
			}));
		}));

		deepEqual(await mainModule.WKCNoteActionQuery(WKCTestingStorageClient, {
			WKCNotePublishStatusIsPublished: false,
		}), items.slice(0, 1));
	});

});

describe('WKCNoteActionPublish', function testWKCNoteActionPublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionPublish(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, Object.assign(await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let itemCreated = await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject());

		let item = await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			WKCNotePublishStatusIsPublished: item.WKCNotePublishStatusIsPublished,
			WKCNotePublicID: item.WKCNotePublicID,
		}));
	});

	it('sets WKCNotePublishStatusIsPublished to true', async function() {
		deepEqual((await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublishStatusIsPublished, true);
	});

	it('sets WKCNotePublicID to 1 if none published', async function() {
		deepEqual((await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublicID, '1');
	});

	it('sets WKCNotePublicID to 2 if one published and deleted', async function() {
		mainModule.WKCNoteActionDelete(WKCTestingStorageClient, await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())));
		deepEqual((await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()))).WKCNotePublicID, '2');
	});

	it('sets WKCNotePublicID to 3 if two published and deleted', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function () {
					return await mainModule.WKCNoteActionDelete(WKCTestingStorageClient, (await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
						WKCNoteBody: e,
					}))))).WKCNoteID);
				});

				return coll;
			}, Promise.resolve());
		};

		await serialPromises();

		deepEqual((await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())))).WKCNotePublicID, '3');
	});

});

describe('WKCNoteActionRetract', function testWKCNoteActionRetract() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteActionPublish(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteActionRetract(WKCTestingStorageClient, Object.assign(await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject()));

		deepEqual(await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, item), Object.assign(item, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			WKCNotePublishStatusIsPublished: item.WKCNotePublishStatusIsPublished,
		}));
	});

	it('sets WKCNotePublishStatusIsPublished to false', async function() {
		deepEqual((await mainModule.WKCNoteActionRetract(WKCTestingStorageClient, await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())))).WKCNotePublishStatusIsPublished, false);
	});	

});

describe('WKCNoteActionGetPublicLinks', function testWKCNoteActionGetPublicLinks() {

	it('returns hash', async function() {
		deepEqual(await mainModule.WKCNoteActionGetPublicLinks(WKCTestingStorageClient), {});
	});

	it('excludes if WKCNotePublishStatusIsPublished false', async function() {
		await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(await mainModule.WKCNoteActionGetPublicLinks(WKCTestingStorageClient), {});
	});

	it('includes if WKCNotePublishStatusIsPublished true', async function() {
		let item = await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, kTesting.StubNoteObject())));

		deepEqual(await mainModule.WKCNoteActionGetPublicLinks(WKCTestingStorageClient), [[item.WKCNoteBody, item.WKCNotePublicID]].reduce(function (coll, e) {
			coll[e[0]] = e[1];

			return coll;
		}, {}));
	});

	it('selects last updated note if duplicate title', async function() {
		await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: `heading\nalfa`,
		}))));
		kTesting.uSleep(1);
		await mainModule.WKCNoteActionPublish(WKCTestingStorageClient, (await mainModule.WKCNoteActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: `heading\nbravo`,
		}))));

		deepEqual(await mainModule.WKCNoteActionGetPublicLinks(WKCTestingStorageClient), {
			heading: '2',
		});
	});

});

