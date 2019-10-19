import { rejects, deepEqual } from 'assert';

import * as mainModule from './action.js';
import * as WKXVersionsAction from '../WKXVersion/action.js';

const kTesting = {
	StubVersionObject: function() {
		return {
			WKXVersionDocumentID: 'alfa',
			WKXVersionBody: 'bravo',
			WKXVersionDate: new Date(),
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

describe('WKXVersionActionCreate', function testWKXVersionActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXVersionActionCreate(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKXVersionActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
			WKXVersionBody: null,
		}))).WKCErrors, {
			WKXVersionBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKXVersion', async function() {
		let item = await mainModule.WKXVersionActionCreate(WKXTestingStorageClient, kTesting.StubVersionObject());

		deepEqual(item, Object.assign(kTesting.StubVersionObject(), {
			WKXVersionID: item.WKXVersionID,
			WKXVersionDate: item.WKXVersionDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKXVersionID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKXVersionActionCreate(WKXTestingStorageClient, kTesting.StubVersionObject())).WKXVersionID;
		}));
		deepEqual([...(new Set(items))], items);
	});

});

describe('WKXVersionActionQuery', function testWKXVersionActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXVersionActionQuery(WKCTestingMongoClient, null), /WKCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.WKXVersionActionQuery(WKXTestingStorageClient, {}), []);
	});

	it('includes all WKXVersions if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKXVersionActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				WKXVersionBody: e,
			}));
		}));

		deepEqual(await mainModule.WKXVersionActionQuery(WKXTestingStorageClient, {}), items.reverse());
	});

	it('filters by WKXVersionDocumentID', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKXVersionActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubVersionObject(), {
				WKXVersionDocumentID: e,
			}));
		}));

		deepEqual(await mainModule.WKXVersionActionQuery(WKXTestingStorageClient, {
			WKXVersionDocumentID: 'charlie',
		}), items.slice(-1));
	});

});

describe('WKXVersionActionDelete', function testWKXVersionActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXVersionActionDelete(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.WKXVersionActionDelete(WKXTestingStorageClient, (await mainModule.WKXVersionActionCreate(WKXTestingStorageClient, kTesting.StubVersionObject())).WKXVersionID), {
			statusCode: 200,
		});
	});

	it('deletes WKXVersion', async function() {
		let itemID;
		await mainModule.WKXVersionActionDelete(WKXTestingStorageClient, itemID = (await mainModule.WKXVersionActionCreate(WKXTestingStorageClient, kTesting.StubVersionObject())).WKXVersionID);
		deepEqual(await mainModule.WKXVersionActionQuery(WKXTestingStorageClient, {
			WKXVersionDocumentID: itemID,
		}), []);
	});

});
