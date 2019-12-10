const { rejects, deepEqual } = require('assert');

const mainModule = require('./metal.js');

const kTesting = {
	StubSettingObjectValid() {
		return {
			WKCSettingKey: 'alfa',
			WKCSettingValue: 'bravo',
		};
	},
};

describe('WKCSettingsMetalWrite', function testWKCSettingsMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCSettingsMetalWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCSettingsMetalWrite(KVCTestingStorageClient, Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingKey: null,
		}))).KVCErrors, {
			WKCSettingKey: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns WKCSetting', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid());

		deepEqual(item, Object.assign(kTesting.StubSettingObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCSettingsMetalRead', function testWKCSettingsMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCSettingsMetalRead(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKCSettingsMetalRead(KVCTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCSetting', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid());

		deepEqual(await mainModule.WKCSettingsMetalRead(KVCTestingStorageClient, item.WKCSettingKey), item);
	});

});

describe('WKCSettingsMetalList', function testWKCSettingsMetalList() {

	it('returns empty array if none', async function() {
		deepEqual(await mainModule.WKCSettingsMetalList(KVCTestingStorageClient), {});
	});

	it('returns existing WKCSettings', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid());
		deepEqual(Object.values(await mainModule.WKCSettingsMetalList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCSettingsMetalList(KVCTestingStorageClient)), [item.WKCSettingKey]);
	});

});

describe('WKCSettingsMetalDelete', function testWKCSettingsMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCSettingsMetalDelete(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.WKCSettingsMetalDelete(KVCTestingStorageClient, (await mainModule.WKCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid())).WKCSettingKey), {
			statusCode: 200,
		});
	});

	it('deletes WKCSetting', async function() {
		await mainModule.WKCSettingsMetalDelete(KVCTestingStorageClient, (await mainModule.WKCSettingsMetalWrite(KVCTestingStorageClient, kTesting.StubSettingObjectValid())).WKCSettingKey);
		deepEqual(await mainModule.WKCSettingsMetalList(KVCTestingStorageClient), {});
	});

});
