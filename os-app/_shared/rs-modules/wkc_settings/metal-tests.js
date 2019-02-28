const assert = require('assert');

const mainModule = require('./metal.js');
const storageClient = require('../../WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wkc_settings: null,
});

const kTesting = {
	StubSettingObjectValid: function() {
		return {
			WKCSettingKey: 'alfa',
			WKCSettingValue: 'bravo',
		};
	},
};

beforeEach(async function() {
	await Promise.all(Object.keys(await storageClient.wkc_settings.listObjects()).map(storageClient.wkc_settings.deleteObject));
});

describe('WKCSettingsMetalWrite', function testWKCSettingsMetalWrite() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCSettingsMetalWrite(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCSettingsMetalWrite(storageClient, Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingKey: null,
		}))).WKCErrors, {
			WKCSettingKey: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCSetting', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(storageClient, kTesting.StubSettingObjectValid());

		assert.deepEqual(item, Object.assign(kTesting.StubSettingObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCSettingsMetalRead', function testWKCSettingsMetalRead() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCSettingsMetalRead(storageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns null if not found', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalRead(storageClient, 'alfa'), null);
	});

	it('returns WKCSetting', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(storageClient, kTesting.StubSettingObjectValid());

		assert.deepEqual(await mainModule.WKCSettingsMetalRead(storageClient, item.WKCSettingKey), item);
	});

});

describe('WKCSettingsMetalList', function testWKCSettingsMetalList() {

	it('returns empty array if none', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalList(storageClient), {});
	});

	it('returns existing WKCSettings', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(storageClient, kTesting.StubSettingObjectValid());
		assert.deepEqual(Object.values(await mainModule.WKCSettingsMetalList(storageClient)), [item]);
		assert.deepEqual(Object.keys(await mainModule.WKCSettingsMetalList(storageClient)), [item.WKCSettingKey]);
	});

});

describe('WKCSettingsMetalDelete', function testWKCSettingsMetalDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCSettingsMetalDelete(storageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalDelete(storageClient, (await mainModule.WKCSettingsMetalWrite(storageClient, kTesting.StubSettingObjectValid())).WKCSettingKey), {
			statusCode: 200,
		});
	});

	it('deletes WKCSetting', async function() {
		await mainModule.WKCSettingsMetalDelete(storageClient, (await mainModule.WKCSettingsMetalWrite(storageClient, kTesting.StubSettingObjectValid())).WKCSettingKey);
		assert.deepEqual(await mainModule.WKCSettingsMetalList(storageClient), {});
	});

});

describe.skip('WKCSettingsMetalProperty', function testWKCSettingsMetalProperty() {

	it('rejects if param1 not string', async function() {
		await assert.rejects(mainModule.WKCSettingsMetalProperty(storageClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalProperty(storageClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.WKCSettingsMetalProperty(storageClient, 'alfa', 'bravo');

			assert.deepEqual(await mainModule.WKCSettingsMetalProperty(storageClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			assert.deepEqual(await mainModule.WKCSettingsMetalProperty(storageClient, 'alfa', 'bravo'), true);
		});
		
	});

});