const { rejects, throws, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

describe('KVCVersionStorageCollectionName', function test_KVCVersionStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mainModule.KVCVersionStorageCollectionName(), 'kvc_versions');
	});

});

describe('KVCVersionStorageCollectionType', function test_KVCVersionStorageCollectionType() {

	it('returns string', function() {
		deepEqual(mainModule.KVCVersionStorageCollectionType(), 'kvc_version');
	});

});

describe('KVCVersionStorageCollectionPath', function test_KVCVersionStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCVersionStorageCollectionPath(), mainModule.KVCVersionStorageCollectionName() + '/');
	});

});

describe('KVCVersionStorageObjectPath', function test_KVCVersionStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCVersionStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubVersionObjectValid();
		deepEqual(mainModule.KVCVersionStorageObjectPath(item), mainModule.KVCVersionStorageCollectionPath() + item.KVCVersionID);
	});

});

describe('KVCVersionStorageWrite', function test_KVCVersionStorageWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCVersionStorageWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCVersionStorageWrite(KVCTestingStorageClient, Object.assign(StubVersionObjectValid(), {
			KVCVersionID: null,
		}))).KVCErrors, {
			KVCVersionID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns input', async function () {
		const item = StubVersionObjectValid();

		deepEqual(await mainModule.KVCVersionStorageWrite(KVCTestingStorageClient, item) === item, true);
	});

	it('leaves input unmodified', async function () {
		deepEqual(await mainModule.KVCVersionStorageWrite(KVCTestingStorageClient, StubVersionObjectValid()), StubVersionObjectValid());
	});

});

describe('KVCVersionStorageList', function test_KVCVersionStorageList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.KVCVersionStorageList(KVCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.KVCVersionStorageWrite(KVCTestingStorageClient, StubVersionObjectValid());
		deepEqual(Object.values(await mainModule.KVCVersionStorageList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.KVCVersionStorageList(KVCTestingStorageClient)), [item.KVCVersionID]);
	});

});

describe('KVCVersionStorageDelete', function test_KVCVersionStorageDelete() {

	it('throws if not string', function () {
		throws(function () {
			mainModule.KVCVersionStorageDelete(KVCTestingStorageClient, 1)
		}, /KVCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.KVCVersionStorageDelete(KVCTestingStorageClient, (await mainModule.KVCVersionStorageWrite(KVCTestingStorageClient, StubVersionObjectValid())).KVCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes KVCVersion', async function() {
		await mainModule.KVCVersionStorageDelete(KVCTestingStorageClient, (await mainModule.KVCVersionStorageWrite(KVCTestingStorageClient, StubVersionObjectValid())).KVCVersionID);
		deepEqual(await mainModule.KVCVersionStorageList(KVCTestingStorageClient), {});
	});

});
