const { rejects, throws, deepEqual } = require('assert');

const mod = require('./storage.js').default;

describe('KVCVersionStorageCollectionName', function test_KVCVersionStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mod.KVCVersionStorageCollectionName(), 'kvc_versions');
	});

});

describe('KVCVersionStorageCollectionPath', function test_KVCVersionStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mod.KVCVersionStorageCollectionPath(), mod.KVCVersionStorageCollectionName() + '/');
	});

});

describe('KVCVersionStorageObjectPath', function test_KVCVersionStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.KVCVersionStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubVersionObjectValid();
		deepEqual(mod.KVCVersionStorageObjectPath(item), mod.KVCVersionStorageCollectionPath() + item.KVCVersionID);
	});

});

describe('KVCVersionStorageWrite', function test_KVCVersionStorageWrite() {

	it('rejects if not object', async function() {
		await rejects(mod.KVCVersionStorageWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mod.KVCVersionStorageWrite(KVCTestingStorageClient, Object.assign(StubVersionObjectValid(), {
			KVCVersionID: null,
		}))).KVCErrors, {
			KVCVersionID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns input', async function () {
		const item = StubVersionObjectValid();

		deepEqual(await mod.KVCVersionStorageWrite(KVCTestingStorageClient, item) === item, true);
	});

	it('leaves input unmodified', async function () {
		deepEqual(await mod.KVCVersionStorageWrite(KVCTestingStorageClient, StubVersionObjectValid()), StubVersionObjectValid());
	});

});

describe('KVCVersionStorageList', function test_KVCVersionStorageList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mod.KVCVersionStorageList(KVCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mod.KVCVersionStorageWrite(KVCTestingStorageClient, StubVersionObjectValid());
		deepEqual(Object.values(await mod.KVCVersionStorageList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mod.KVCVersionStorageList(KVCTestingStorageClient)), [item.KVCVersionID]);
	});

});

describe('KVCVersionStorageDelete', function test_KVCVersionStorageDelete() {

	it('throws if not string', function () {
		throws(function () {
			mod.KVCVersionStorageDelete(KVCTestingStorageClient, 1)
		}, /KVCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mod.KVCVersionStorageDelete(KVCTestingStorageClient, (await mod.KVCVersionStorageWrite(KVCTestingStorageClient, StubVersionObjectValid())).KVCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes KVCVersion', async function() {
		await mod.KVCVersionStorageDelete(KVCTestingStorageClient, (await mod.KVCVersionStorageWrite(KVCTestingStorageClient, StubVersionObjectValid())).KVCVersionID);
		deepEqual(await mod.KVCVersionStorageList(KVCTestingStorageClient), {});
	});

});
