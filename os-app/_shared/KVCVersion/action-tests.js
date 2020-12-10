const { rejects, deepEqual } = require('assert');

const mod = require('./action.js').default;

const kTesting = {
	StubVersionObject() {
		return {
			KVCVersionNoteID: 'alfa',
			KVCVersionBody: 'bravo',
			KVCVersionDate: new Date(),
		};
	},
};

describe('KVCVersionActionCreate', function test_KVCVersionActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mod.KVCVersionActionCreate(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mod.KVCVersionActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
			KVCVersionBody: null,
		}))).KVCErrors, {
			KVCVersionBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns KVCVersion', async function() {
		let item = await mod.KVCVersionActionCreate(KVCTestingStorageClient, kTesting.StubVersionObject());

		deepEqual(item, Object.assign(kTesting.StubVersionObject(), {
			KVCVersionID: item.KVCVersionID,
			KVCVersionDate: item.KVCVersionDate,
		}));
	});

	it('sets KVCVersionID to unique value', async function() {
		let items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mod.KVCVersionActionCreate(KVCTestingStorageClient, kTesting.StubVersionObject())).KVCVersionID;
		}));
		deepEqual([...(new Set(items))], items);
	});

});

describe('KVCVersionActionQuery', function test_KVCVersionActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mod.KVCVersionActionQuery(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mod.KVCVersionActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('includes all KVCVersions if no query', async function() {
		let items = await uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			uSleep(1);
			return await mod.KVCVersionActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				KVCVersionBody: e,
			}));
		}));

		deepEqual(await mod.KVCVersionActionQuery(KVCTestingStorageClient, {}), items.reverse());
	});

	it('filters by KVCVersionNoteID', async function() {
		let items = await uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mod.KVCVersionActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				KVCVersionNoteID: e,
			}));
		}));

		deepEqual(await mod.KVCVersionActionQuery(KVCTestingStorageClient, {
			KVCVersionNoteID: 'charlie',
		}), items.slice(-1));
	});

});

describe('KVCVersionActionDelete', function test_KVCVersionActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mod.KVCVersionActionDelete(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mod.KVCVersionActionDelete(KVCTestingStorageClient, (await mod.KVCVersionActionCreate(KVCTestingStorageClient, kTesting.StubVersionObject())).KVCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes KVCVersion', async function() {
		let itemID;
		await mod.KVCVersionActionDelete(KVCTestingStorageClient, itemID = (await mod.KVCVersionActionCreate(KVCTestingStorageClient, kTesting.StubVersionObject())).KVCVersionID);
		deepEqual(await mod.KVCVersionActionQuery(KVCTestingStorageClient, {
			KVCVersionNoteID: itemID,
		}), []);
	});

});
