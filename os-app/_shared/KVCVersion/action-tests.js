const { rejects, deepEqual } = require('assert');

const mainModule = require('./action.js');
import * as KVCVersionsAction from '../KVCVersion/action.js';

const kTesting = {
	StubVersionObject() {
		return {
			KVCVersionNoteID: 'alfa',
			KVCVersionBody: 'bravo',
			KVCVersionDate: new Date(),
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

describe('KVCVersionActionCreate', function testKVCVersionActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCVersionActionCreate(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCVersionActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
			KVCVersionBody: null,
		}))).KVCErrors, {
			KVCVersionBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns KVCVersion', async function() {
		let item = await mainModule.KVCVersionActionCreate(KVCTestingStorageClient, kTesting.StubVersionObject());

		deepEqual(item, Object.assign(kTesting.StubVersionObject(), {
			KVCVersionID: item.KVCVersionID,
			KVCVersionDate: item.KVCVersionDate,
			'@context': item['@context'],
		}));
	});

	it('sets KVCVersionID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.KVCVersionActionCreate(KVCTestingStorageClient, kTesting.StubVersionObject())).KVCVersionID;
		}));
		deepEqual([...(new Set(items))], items);
	});

});

describe('KVCVersionActionQuery', function testKVCVersionActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCVersionActionQuery(KVCTestingMongoClient, null), /KVCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.KVCVersionActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('includes all KVCVersions if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.KVCVersionActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				KVCVersionBody: e,
			}));
		}));

		deepEqual(await mainModule.KVCVersionActionQuery(KVCTestingStorageClient, {}), items.reverse());
	});

	it('filters by KVCVersionNoteID', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.KVCVersionActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				KVCVersionNoteID: e,
			}));
		}));

		deepEqual(await mainModule.KVCVersionActionQuery(KVCTestingStorageClient, {
			KVCVersionNoteID: 'charlie',
		}), items.slice(-1));
	});

});

describe('KVCVersionActionDelete', function testKVCVersionActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCVersionActionDelete(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.KVCVersionActionDelete(KVCTestingStorageClient, (await mainModule.KVCVersionActionCreate(KVCTestingStorageClient, kTesting.StubVersionObject())).KVCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes KVCVersion', async function() {
		let itemID;
		await mainModule.KVCVersionActionDelete(KVCTestingStorageClient, itemID = (await mainModule.KVCVersionActionCreate(KVCTestingStorageClient, kTesting.StubVersionObject())).KVCVersionID);
		deepEqual(await mainModule.KVCVersionActionQuery(KVCTestingStorageClient, {
			KVCVersionNoteID: itemID,
		}), []);
	});

});
