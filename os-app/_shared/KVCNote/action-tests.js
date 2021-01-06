const { throws, rejects, deepEqual } = require('assert');

const mod = require('./action.js').default;
const KVCNoteStorage = require('./storage.js').default;
const KVCTemplate = require('../KVCTemplate/main.js');

const kTesting = {
	StubNoteObject() {
		return {
			KVCNoteBody: 'bravo',
		};
	},

	uPublish (param1 = kTesting.StubNoteObject(), param2 = '', param3 = {}) {
		return mod.KVCNoteActionPublish(KVCTestingStorageClient, param1, param2, param3);
	},
};

describe('KVCNoteActionCreate', function test_KVCNoteActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mod.KVCNoteActionCreate(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mod.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: null,
		}))).KVCErrors, {
			KVCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns inputData', async function() {
		const item = kTesting.StubNoteObject();
		deepEqual(item === await mod.KVCNoteActionCreate(KVCTestingStorageClient, item), true);
	});

	it('sets KVCNoteID to unique value', async function() {
		const items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets KVCNoteCreationDate to now', async function() {
		deepEqual(new Date() - (await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteCreationDate < 100, true);
	});

	it('sets KVCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteModificationDate < 100, true);
	});

});

describe('KVCNoteActionUpdate', function test_KVCNoteActionUpdate() {

	it('rejects if not valid', async function() {
		await rejects(mod.KVCNoteActionUpdate(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('returns inputData', async function() {
		const item = await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(item === await mod.KVCNoteActionUpdate(KVCTestingStorageClient, item), true);
	});

	it('sets KVCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mod.KVCNoteActionUpdate(KVCTestingStorageClient, await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNoteModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		const item = await mod.KVCNoteActionUpdate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteID: 'alfa',
			KVCNoteCreationDate: new Date(),
			KVCNoteModificationDate: new Date(),
		}));
		deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteID: item.KVCNoteID,
			KVCNoteCreationDate: item.KVCNoteCreationDate,
			KVCNoteModificationDate: item.KVCNoteModificationDate,
		}));
	});

});

describe('KVCNoteActionDelete', function test_KVCNoteActionDelete() {

	it('rejects if not valid', async function() {
		await rejects(mod.KVCNoteActionDelete(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mod.KVCNoteActionDelete(KVCTestingStorageClient, await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), {
			statusCode: 200,
		});
	});

	it('deletes KVCNote', async function() {
		await mod.KVCNoteActionDelete(KVCTestingStorageClient, await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		deepEqual(await mod.KVCNoteActionQuery(KVCTestingStorageClient, {}), []);
	});

});

describe('KVCNoteActionQuery', function test_KVCNoteActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mod.KVCNoteActionQuery(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mod.KVCNoteActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('includes all KVCNotes if no query', async function() {
		const items = await uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			uSleep(1);
			return await mod.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteBody: e,
			}));
		}));

		deepEqual(await mod.KVCNoteActionQuery(KVCTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		const items = await uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mod.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteID: e,
			}));
		}));

		deepEqual(await mod.KVCNoteActionQuery(KVCTestingStorageClient, {
			KVCNoteID: items.slice(-1).pop().KVCNoteID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		const items = await uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mod.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteIsPublic: !!index,
			}));
		}));

		deepEqual(await mod.KVCNoteActionQuery(KVCTestingStorageClient, {
			KVCNoteIsPublic: false,
		}), items.slice(0, 1));
	});

});

describe('KVCNoteActionPublishPath', function test_KVCNoteActionPublishPath() {

	const item = Object.assign(StubNoteObjectValid(), {
		KVCNotePublicID: 'charlie',
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			mod.KVCNoteActionPublishPath({}, false);
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not boolean', function() {
		throws(function() {
			mod.KVCNoteActionPublishPath(item, 'true');
		}, /KVCErrorInputNotValid/);
	});

	it('returns KVCNoteStoragePublicObjectPath', function() {
		deepEqual(mod.KVCNoteActionPublishPath(item, false), KVCNoteStorage.KVCNoteStoragePublicObjectPath(item));
	});

	it('returns KVCNoteStoragePublicRootPagePath if param2 true', function() {
		deepEqual(mod.KVCNoteActionPublishPath(item, true), KVCNoteStorage.KVCNoteStoragePublicRootPagePath());
	});

});

describe('KVCNoteActionPublicPath', function test_KVCNoteActionPublicPath() {

	const item = Object.assign(StubNoteObjectValid(), {
		KVCNotePublicID: 'charlie',
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			mod.KVCNoteActionPublicPath({}, false);
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not boolean', function() {
		throws(function() {
			mod.KVCNoteActionPublicPath(item, 'true');
		}, /KVCErrorInputNotValid/);
	});

	it('returns KVCNoteStoragePublicObjectPath', function() {
		deepEqual(mod.KVCNoteActionPublicPath(item, false), KVCNoteStorage.KVCNoteStoragePublicObjectPath(item));
	});

	it('returns / if param2 true', function() {
		deepEqual(mod.KVCNoteActionPublicPath(item, true), '/');
	});

});

describe('KVCNoteActionPermalinkMap', function test_KVCNoteActionPermalinkMap() {

	it('returns object', async function() {
		deepEqual(await mod.KVCNoteActionPermalinkMap(KVCTestingStorageClient, '', true), {});
	});

	it('excludes if KVCNoteIsPublic false', async function() {
		await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(await mod.KVCNoteActionPermalinkMap(KVCTestingStorageClient, '', true), {});
	});

	it('includes if KVCNoteIsPublic true', async function() {
		const item = await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		deepEqual(await mod.KVCNoteActionPermalinkMap(KVCTestingStorageClient, '', true), {
			bravo: item.KVCNotePublicID,
		});
	});

	it('selects last updated note if duplicate title', async function() {
		await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: 'alfa\nbravo',
		})));

		uSleep(1);
		
		const item = await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: 'alfa\ncharlie',
		})));

		deepEqual(await mod.KVCNoteActionPermalinkMap(KVCTestingStorageClient, '', true), {
			alfa: item.KVCNotePublicID,
		});
	});

	it('links to KVCNoteActionPublicPath if not root', async function() {
		const item = await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		deepEqual(await mod.KVCNoteActionPermalinkMap(KVCTestingStorageClient, '', true), {
			bravo: mod.KVCNoteActionPublicPath(item, false),
		});
	});

	it('links to KVCNoteActionPublicPath if root', async function() {
		const item = await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		deepEqual(await mod.KVCNoteActionPermalinkMap(KVCTestingStorageClient, item.KVCNoteID, true), {
			bravo: mod.KVCNoteActionPublicPath(item, true),
		});
	});

});

describe('KVCNoteActionPublish', function test_KVCNoteActionPublish() {

	it('rejects if param1 not valid', async function() {
		await rejects(mod.KVCNoteActionPublish(KVCTestingStorageClient, {}, '', {}), /KVCErrorInputNotValid/);
	});

	it('rejects if param2 not string', async function() {
		await rejects(mod.KVCNoteActionPublish(KVCTestingStorageClient, StubNoteObjectValid(), null, {}), /KVCErrorInputNotValid/);
	});

	it('rejects if options not object', async function() {
		await rejects(mod.KVCNoteActionPublish(KVCTestingStorageClient, StubNoteObjectValid(), '', null), /KVCErrorInputNotValid/);
	});

	it('returns param1', async function() {
		const item = await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(item === await kTesting.uPublish(item), true);
	});

	it('sets KVCNoteIsPublic to true', async function() {
		deepEqual((await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNoteIsPublic, true);
	});

	it('sets KVCNotePublishDate to now', async function() {
		deepEqual(new Date() - (await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublishDate < 100, true);
	});

	it('kees existing KVCNotePublishDate', async function() {
		const item = await mod.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), false);
		const date = item.KVCNotePublishDate;

		deepEqual((await kTesting.uPublish(item)).KVCNotePublishDate, date);
	});

	it('sets KVCNotePublicID to string', async function() {
		deepEqual(typeof (await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID, 'string');
	});

	it('sets KVCNotePublicID to lowercase', async function() {
		const item = (await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID;
		deepEqual(item, item.toLowerCase());
	});

	it('sets KVCNotePublicID to unique value', async function() {
		const items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('keeps existing KVCNotePublicID', async function() {
		const item = await mod.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), false);
		const id = item.KVCNotePublicID;

		deepEqual((await kTesting.uPublish(item)).KVCNotePublicID, id);
	});

	it('writes to public folder', async function() {
		const item = await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), 'alfa');

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'alfa');
	});

	it('writes to two paths if KVCOptionIsRoot true', async function() {
		const item = await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), 'bravo', {
			KVCOptionIsRoot: true,
		});

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'bravo');
		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicRootPagePath())).data, 'bravo');
	});

});

describe('KVCNoteActionRetract', function test_KVCNoteActionRetract() {

	it('rejects if param1 not valid', async function() {
		await rejects(mod.KVCNoteActionRetract(KVCTestingStorageClient, {}, false), /KVCErrorInputNotValid/);
	});

	it('rejects if param2 not boolean', async function() {
		const item = await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));

		await rejects(mod.KVCNoteActionRetract(KVCTestingStorageClient, item, 'true'), /KVCErrorInputNotValid/);
	});

	it('returns KVCNote', async function() {
		const item = await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));

		deepEqual(item === await mod.KVCNoteActionRetract(KVCTestingStorageClient, item, false), true);
	});

	it('sets KVCNoteIsPublic to false', async function() {
		deepEqual((await mod.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), false)).KVCNoteIsPublic, false);
	});

	it('deletes file from public folder', async function() {
		const item = await mod.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), false);

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

	it('deletes from two paths if param2 true', async function() {
		const item = await mod.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mod.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), 'alfa', {}, {
			KVCOptionIsRoot: true,
		}), true);

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, undefined);
		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicRootPagePath())).data, undefined);
	});

});
