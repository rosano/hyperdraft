const { rejects, deepEqual } = require('assert');

const mainModule = require('./metal.js').default;

const kTesting = {
	StubSettingObjectValid() {
		return {
			KVCSettingKey: 'alfa',
			KVCSettingValue: 'bravo',
		};
	},
};

describe('KVCSettingsMetalWrite', function test_KVCSettingsMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCSettingsMetalWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCSettingsMetalWrite(KVCTestingStorageClient, Object.assign(kTesting.StubSettingObjectValid(), {
			KVCSettingKey: null,
		}))).KVCErrors, {
			KVCSettingKey: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns KVCSetting', async function() {
		let item = await mainModule.KVCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid());

		deepEqual(item, Object.assign(kTesting.StubSettingObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('KVCSettingsMetalRead', function test_KVCSettingsMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCSettingsMetalRead(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.KVCSettingsMetalRead(KVCTestingStorageClient, 'alfa'), null);
	});

	it('returns KVCSetting', async function() {
		let item = await mainModule.KVCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid());

		deepEqual(await mainModule.KVCSettingsMetalRead(KVCTestingStorageClient, item.KVCSettingKey), item);
	});

});

describe('KVCSettingsMetalList', function test_KVCSettingsMetalList() {

	it('returns empty array if none', async function() {
		deepEqual(await mainModule.KVCSettingsMetalList(KVCTestingStorageClient), {});
	});

	it('returns existing KVCSettings', async function() {
		let item = await mainModule.KVCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid());
		deepEqual(Object.values(await mainModule.KVCSettingsMetalList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.KVCSettingsMetalList(KVCTestingStorageClient)), [item.KVCSettingKey]);
	});

});

describe('KVCSettingsMetalDelete', function test_KVCSettingsMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCSettingsMetalDelete(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.KVCSettingsMetalDelete(KVCTestingStorageClient, (await mainModule.KVCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid())).KVCSettingKey), {
			statusCode: 200,
		});
	});

	it('deletes KVCSetting', async function() {
		await mainModule.KVCSettingsMetalDelete(KVCTestingStorageClient, (await mainModule.KVCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid())).KVCSettingKey);
		deepEqual(await mainModule.KVCSettingsMetalList(KVCTestingStorageClient), {});
	});

});
