const assert = require('assert');

const mainModule = require('./metal.js');
const storageClient = require('../../WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wkc_versions: null,
});

const kTesting = {
	StubVersionObjectValid: function() {
		return {
			WKCVersionID: 'alfa',
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
			WKCVersionDate: new Date('2019-01-30T18:10:00.000Z'),
		};
	},
};

beforeEach(async function() {
	await Promise.all(Object.keys(await storageClient.wkc_versions.listObjects()).map(storageClient.wkc_versions.deleteObject));
});

describe('WKCVersionsMetalWrite', function testWKCVersionsMetalWrite() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalWrite(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCVersionsMetalWrite(storageClient, Object.assign(kTesting.StubVersionObjectValid(), {
			WKCVersionID: null,
		}))).WKCErrors, {
			WKCVersionID: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCVersion', async function() {
		let item = await mainModule.WKCVersionsMetalWrite(storageClient, kTesting.StubVersionObjectValid());

		assert.deepEqual(item, Object.assign(kTesting.StubVersionObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCVersionsMetalRead', function testWKCVersionsMetalRead() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalRead(storageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns null if not found', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalRead(storageClient, 'alfa'), null);
	});

	it('returns WKCVersion', async function() {
		let item = await mainModule.WKCVersionsMetalWrite(storageClient, kTesting.StubVersionObjectValid());

		assert.deepEqual(await mainModule.WKCVersionsMetalRead(storageClient, item.WKCVersionID), item);
	});

});

describe('WKCVersionsMetalList', function testWKCVersionsMetalList() {

	it('returns empty array if none', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalList(storageClient), {});
	});

	it('returns existing WKCVersions', async function() {
		let item = await mainModule.WKCVersionsMetalWrite(storageClient, kTesting.StubVersionObjectValid());
			assert.deepEqual(Object.values(await mainModule.WKCVersionsMetalList(storageClient)), [item]);
			assert.deepEqual(Object.keys(await mainModule.WKCVersionsMetalList(storageClient)), [item.WKCVersionID]);
	});

});

describe('WKCVersionsMetalDelete', function testWKCVersionsMetalDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalDelete(storageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalDelete(storageClient, (await mainModule.WKCVersionsMetalWrite(storageClient, kTesting.StubVersionObjectValid())).WKCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes WKCVersion', async function() {
		await mainModule.WKCVersionsMetalDelete(storageClient, (await mainModule.WKCVersionsMetalWrite(storageClient, kTesting.StubVersionObjectValid())).WKCVersionID)
		assert.deepEqual(await mainModule.WKCVersionsMetalList(storageClient), {});
	});

});
