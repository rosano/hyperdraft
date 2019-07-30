import { rejects, deepEqual } from 'assert';

import * as mainModule from './action.js';

const kTesting = {
	StubVersionObject: function() {
		return {
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
			WKCVersionDate: new Date(),
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

describe('WKCVersionsActionCreate', function testWKCVersionsActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
			WKCVersionBody: null,
		}))).WKCErrors, {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCVersion', async function() {
		let item = await mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject());

		deepEqual(item, Object.assign(kTesting.StubVersionObject(), {
			WKCVersionID: item.WKCVersionID,
			WKCVersionDate: item.WKCVersionDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCVersionID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject())).WKCVersionID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets WKCVersionDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject())).WKCVersionDate < 100, true);
	});

});

describe('WKCVersionsActionQuery', function testWKCVersionsActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCVersionsActionQuery(WKCTestingMongoClient, null), /WKCErrorInputInvalid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.WKCVersionsActionQuery(WKCTestingStorageClient, {}), []);
	});

	it('includes all WKCVersions if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				WKCVersionBody: e,
			}));
		}));

		deepEqual(await mainModule.WKCVersionsActionQuery(WKCTestingStorageClient, {}), items.reverse());
	});

	it('filters by WKCVersionNoteID', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				WKCVersionNoteID: e,
			}));
		}));

		deepEqual(await mainModule.WKCVersionsActionQuery(WKCTestingStorageClient, {
			WKCVersionNoteID: 'charlie',
		}), items.slice(-1));
	});

});

describe('WKCVersionsActionDelete', function testWKCVersionsActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCVersionsActionDelete(WKCTestingStorageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.WKCVersionsActionDelete(WKCTestingStorageClient, (await mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject())).WKCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes WKCVersion', async function() {
		await mainModule.WKCVersionsActionDelete(WKCTestingStorageClient, (await mainModule.WKCVersionsActionCreate(WKCTestingStorageClient, kTesting.StubVersionObject())).WKCVersionID);
		deepEqual(await mainModule.WKCVersionsActionQuery(WKCTestingStorageClient, {}), []);
	});

});
