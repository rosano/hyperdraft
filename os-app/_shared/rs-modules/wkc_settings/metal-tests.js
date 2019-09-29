const assert = require('assert');

const mainModule = require('./metal.js');

const kTesting = {
	StubSettingObjectValid: function() {
		return {
			WKCSettingKey: 'alfa',
			WKCSettingValue: 'bravo',
		};
	},
};

describe('WKCSettingsMetalWrite', function testWKCSettingsMetalWrite() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCSettingsMetalWrite(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCSettingsMetalWrite(WKCTestingStorageClient, Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingKey: null,
		}))).WKCErrors, {
			WKCSettingKey: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCSetting', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(WKCTestingStorageClient, kTesting.StubSettingObjectValid());

		assert.deepEqual(item, Object.assign(kTesting.StubSettingObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCSettingsMetalRead', function testWKCSettingsMetalRead() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCSettingsMetalRead(WKCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalRead(WKCTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCSetting', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(WKCTestingStorageClient, kTesting.StubSettingObjectValid());

		assert.deepEqual(await mainModule.WKCSettingsMetalRead(WKCTestingStorageClient, item.WKCSettingKey), item);
	});

});

describe('WKCSettingsMetalList', function testWKCSettingsMetalList() {

	it('returns empty array if none', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalList(WKCTestingStorageClient), {});
	});

	it('returns existing WKCSettings', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(WKCTestingStorageClient, kTesting.StubSettingObjectValid());
		assert.deepEqual(Object.values(await mainModule.WKCSettingsMetalList(WKCTestingStorageClient)), [item]);
		assert.deepEqual(Object.keys(await mainModule.WKCSettingsMetalList(WKCTestingStorageClient)), [item.WKCSettingKey]);
	});

});

describe('WKCSettingsMetalDelete', function testWKCSettingsMetalDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCSettingsMetalDelete(WKCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalDelete(WKCTestingStorageClient, (await mainModule.WKCSettingsMetalWrite(WKCTestingStorageClient, kTesting.StubSettingObjectValid())).WKCSettingKey), {
			statusCode: 200,
		});
	});

	it('deletes WKCSetting', async function() {
		await mainModule.WKCSettingsMetalDelete(WKCTestingStorageClient, (await mainModule.WKCSettingsMetalWrite(WKCTestingStorageClient, kTesting.StubSettingObjectValid())).WKCSettingKey);
		assert.deepEqual(await mainModule.WKCSettingsMetalList(WKCTestingStorageClient), {});
	});

});
