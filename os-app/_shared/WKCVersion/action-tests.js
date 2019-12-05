const { rejects, deepEqual } = require('assert');

const mainModule = require('./action.js');
import * as WKCVersionsAction from '../WKCVersion/action.js';

const kTesting = {
	StubVersionObject() {
		return {
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
			WKCVersionDate: new Date(),
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

describe('WKCVersionActionCreate', function testWKCVersionActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCVersionActionCreate(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCVersionActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
			WKCVersionBody: null,
		}))).WKCErrors, {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCVersion', async function() {
		let item = await mainModule.WKCVersionActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject());

		deepEqual(item, Object.assign(kTesting.StubVersionObject(), {
			WKCVersionID: item.WKCVersionID,
			WKCVersionDate: item.WKCVersionDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCVersionID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKCVersionActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject())).WKCVersionID;
		}));
		deepEqual([...(new Set(items))], items);
	});

});

describe('WKCVersionActionQuery', function testWKCVersionActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCVersionActionQuery(WKCTestingMongoClient, null), /WKCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.WKCVersionActionQuery(WKCTestingStorageClient, {}), []);
	});

	it('includes all WKCVersions if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCVersionActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				WKCVersionBody: e,
			}));
		}));

		deepEqual(await mainModule.WKCVersionActionQuery(WKCTestingStorageClient, {}), items.reverse());
	});

	it('filters by WKCVersionNoteID', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCVersionActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				WKCVersionNoteID: e,
			}));
		}));

		deepEqual(await mainModule.WKCVersionActionQuery(WKCTestingStorageClient, {
			WKCVersionNoteID: 'charlie',
		}), items.slice(-1));
	});

});

describe('WKCVersionActionDelete', function testWKCVersionActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCVersionActionDelete(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.WKCVersionActionDelete(WKCTestingStorageClient, (await mainModule.WKCVersionActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject())).WKCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes WKCVersion', async function() {
		let itemID;
		await mainModule.WKCVersionActionDelete(WKCTestingStorageClient, itemID = (await mainModule.WKCVersionActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject())).WKCVersionID);
		deepEqual(await mainModule.WKCVersionActionQuery(WKCTestingStorageClient, {
			WKCVersionNoteID: itemID,
		}), []);
	});

});
