const assert = require('assert');

const mainModule = require('./action.js');
const storageClient = require('../../WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wkc_versions: null,
});

const kTesting = {
	StubVersionObject: function() {
		return {
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
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

beforeEach(async function() {
	await Promise.all(Object.keys(await storageClient.wkc_versions.listObjects()).map(storageClient.wkc_versions.deleteObject));
});

describe('WKCVersionsActionCreate', function testWKCVersionsActionCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCVersionsActionCreate(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCVersionsActionCreate(storageClient, Object.assign(kTesting.StubVersionObject(), {
			WKCVersionBody: null,
		}))).WKCErrors, {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCVersion', async function() {
		let item = await mainModule.WKCVersionsActionCreate(storageClient, kTesting.StubVersionObject());

		assert.deepEqual(item, Object.assign(kTesting.StubVersionObject(), {
			WKCVersionID: item.WKCVersionID,
			WKCVersionDate: item.WKCVersionDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCVersionID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKCVersionsActionCreate(storageClient, kTesting.StubVersionObject())).WKCVersionID;
		}));
		assert.deepEqual([...(new Set(items))], items);
	});

	it('sets WKCVersionDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCVersionsActionCreate(storageClient, kTesting.StubVersionObject())).WKCVersionDate < 100, true);
	});

});

describe('WKCVersionsActionQuery', function testWKCVersionsActionQuery() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCVersionsActionQuery(WKCTestingMongoClient, null), /WKCErrorInputInvalid/);
	});

	it('returns array', async function() {
		assert.deepEqual(await mainModule.WKCVersionsActionQuery(storageClient, {}), []);
	});

	it('includes all WKCVersions if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCVersionsActionCreate(storageClient, Object.assign(kTesting.StubVersionObject(), {
				WKCVersionBody: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCVersionsActionQuery(storageClient, {}), items.reverse());
	});

	it('filters by WKCVersionNoteID', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCVersionsActionCreate(storageClient, Object.assign(kTesting.StubVersionObject(), {
				WKCVersionNoteID: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCVersionsActionQuery(storageClient, {
			WKCVersionNoteID: 'charlie',
		}), items.slice(-1));
	});

});
