const { rejects, throws, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

describe('KVCSettingStorageCollectionName', function test_KVCSettingStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mainModule.KVCSettingStorageCollectionName(), 'kvc_settings');
	});

});

describe('KVCSettingStorageCollectionType', function test_KVCSettingStorageCollectionType() {

	it('returns string', function() {
		deepEqual(mainModule.KVCSettingStorageCollectionType(), 'kvc_setting');
	});

});

describe('KVCSettingStorageCollectionPath', function test_KVCSettingStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCSettingStorageCollectionPath(), mainModule.KVCSettingStorageCollectionName() + '/');
	});

});

describe('KVCSettingStorageObjectPath', function test_KVCSettingStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCSettingStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubSettingObjectValid();
		deepEqual(mainModule.KVCSettingStorageObjectPath(item), mainModule.KVCSettingStorageCollectionPath() + item.KVCSettingKey);
	});

});

describe('KVCSettingStorageWrite', function test_KVCSettingStorageWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCSettingStorageWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCSettingStorageWrite(KVCTestingStorageClient, Object.assign(StubSettingObjectValid(), {
			KVCSettingKey: null,
		}))).KVCErrors, {
			KVCSettingKey: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns input', async function () {
		const item = StubSettingObjectValid();

		deepEqual(await mainModule.KVCSettingStorageWrite(KVCTestingStorageClient, item) === item, true);
	});

	it('leaves input unmodified', async function () {
		deepEqual(await mainModule.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid()), StubSettingObjectValid());
	});

});

describe('KVCSettingStorageRead', function test_KVCSettingStorageRead() {

	it('throws if not string', function () {
		throws(function () {
			mainModule.KVCSettingStorageRead(KVCTestingStorageClient, 1);
		}, /KVCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.KVCSettingStorageRead(KVCTestingStorageClient, 'alfa'), null);
	});

	it('returns KVCSetting', async function() {
		let item = await mainModule.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid());

		deepEqual(await mainModule.KVCSettingStorageRead(KVCTestingStorageClient, item.KVCSettingKey), item);
	});

});

describe('KVCSettingStorageList', function test_KVCSettingStorageList() {

	it('returns empty array if none', async function() {
		deepEqual(await mainModule.KVCSettingStorageList(KVCTestingStorageClient), {});
	});

	it('returns existing KVCSettings', async function() {
		let item = await mainModule.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid());
		deepEqual(Object.values(await mainModule.KVCSettingStorageList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.KVCSettingStorageList(KVCTestingStorageClient)), [item.KVCSettingKey]);
	});

});

describe('KVCSettingStorageDelete', function test_KVCSettingStorageDelete() {

	it('throws if not strong', function () {
		throws(function () {
			mainModule.KVCSettingStorageDelete(KVCTestingStorageClient, 1);
		}, /KVCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.KVCSettingStorageDelete(KVCTestingStorageClient, (await mainModule.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid())).KVCSettingKey), {
			statusCode: 200,
		});
	});

	it('deletes KVCSetting', async function() {
		await mainModule.KVCSettingStorageDelete(KVCTestingStorageClient, (await mainModule.KVCSettingStorageWrite(KVCTestingStorageClient, StubSettingObjectValid())).KVCSettingKey);
		deepEqual(await mainModule.KVCSettingStorageList(KVCTestingStorageClient), {});
	});

});
