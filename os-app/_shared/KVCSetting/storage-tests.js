const { rejects, throws, deepEqual } = require('assert');

const mod = require('./storage.js').default;

describe('KVCSettingStorageCollectionName', function test_KVCSettingStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mod.KVCSettingStorageCollectionName(), 'kvc_settings');
	});

});

describe('KVCSettingStorageCollectionPath', function test_KVCSettingStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mod.KVCSettingStorageCollectionPath(), mod.KVCSettingStorageCollectionName() + '/');
	});

});

describe('KVCSettingStorageObjectPath', function test_KVCSettingStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.KVCSettingStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubSettingObjectValid();
		deepEqual(mod.KVCSettingStorageObjectPath(item), mod.KVCSettingStorageCollectionPath() + item.KVCSettingKey);
	});

});

describe('KVCSettingStorageWrite', function test_KVCSettingStorageWrite() {

	it('rejects if not object', async function() {
		await rejects(mod.KVCSettingStorageWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mod.KVCSettingStorageWrite(KVCTestingStorageClient, Object.assign(StubSettingObjectValid(), {
			KVCSettingKey: null,
		}))).KVCErrors, {
			KVCSettingKey: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns input', async function () {
		const item = StubSettingObjectValid();

		deepEqual(await mod.KVCSettingStorageWrite(KVCTestingStorageClient, item) === item, true);
	});

	it('leaves input unmodified', async function () {
		deepEqual(await mod.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid()), StubSettingObjectValid());
	});

});

describe('KVCSettingStorageRead', function test_KVCSettingStorageRead() {

	it('throws if not string', function () {
		throws(function () {
			mod.KVCSettingStorageRead(KVCTestingStorageClient, 1);
		}, /KVCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mod.KVCSettingStorageRead(KVCTestingStorageClient, 'alfa'), null);
	});

	it('returns KVCSetting', async function() {
		let item = await mod.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid());

		deepEqual(await mod.KVCSettingStorageRead(KVCTestingStorageClient, item.KVCSettingKey), item);
	});

});

describe('KVCSettingStorageList', function test_KVCSettingStorageList() {

	it('returns empty array if none', async function() {
		deepEqual(await mod.KVCSettingStorageList(KVCTestingStorageClient), {});
	});

	it('returns existing KVCSettings', async function() {
		let item = await mod.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid());
		deepEqual(Object.values(await mod.KVCSettingStorageList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mod.KVCSettingStorageList(KVCTestingStorageClient)), [item.KVCSettingKey]);
	});

});

describe('KVCSettingStorageDelete', function test_KVCSettingStorageDelete() {

	it('throws if not strong', function () {
		throws(function () {
			mod.KVCSettingStorageDelete(KVCTestingStorageClient, 1);
		}, /KVCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mod.KVCSettingStorageDelete(KVCTestingStorageClient, (await mod.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid())).KVCSettingKey), {
			statusCode: 200,
		});
	});

	it('deletes KVCSetting', async function() {
		await mod.KVCSettingStorageDelete(KVCTestingStorageClient, (await mod.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid())).KVCSettingKey);
		deepEqual(await mod.KVCSettingStorageList(KVCTestingStorageClient), {});
	});

});
