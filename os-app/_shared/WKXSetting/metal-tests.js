import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

const kTesting = {
	StubSettingObjectValid: function() {
		return {
			WKXSettingKey: 'alfa',
			WKXSettingValue: 'bravo',
		};
	},
};

describe('WKXSettingsMetalWrite', function testWKXSettingsMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXSettingsMetalWrite(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKXSettingsMetalWrite(WKXTestingStorageClient, Object.assign(kTesting.StubSettingObjectValid(), {
			WKXSettingKey: null,
		}))).WKCErrors, {
			WKXSettingKey: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKXSetting', async function() {
		let item = await mainModule.WKXSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid());

		deepEqual(item, Object.assign(kTesting.StubSettingObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKXSettingsMetalRead', function testWKXSettingsMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXSettingsMetalRead(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKXSettingsMetalRead(WKXTestingStorageClient, 'alfa'), null);
	});

	it('returns WKXSetting', async function() {
		let item = await mainModule.WKXSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid());

		deepEqual(await mainModule.WKXSettingsMetalRead(WKXTestingStorageClient, item.WKXSettingKey), item);
	});

});

describe('WKXSettingsMetalList', function testWKXSettingsMetalList() {

	it('returns empty array if none', async function() {
		deepEqual(await mainModule.WKXSettingsMetalList(WKXTestingStorageClient), {});
	});

	it('returns existing WKXSettings', async function() {
		let item = await mainModule.WKXSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid());
		deepEqual(Object.values(await mainModule.WKXSettingsMetalList(WKXTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKXSettingsMetalList(WKXTestingStorageClient)), [item.WKXSettingKey]);
	});

});

describe('WKXSettingsMetalDelete', function testWKXSettingsMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXSettingsMetalDelete(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.WKXSettingsMetalDelete(WKXTestingStorageClient, (await mainModule.WKXSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid())).WKXSettingKey), {
			statusCode: 200,
		});
	});

	it('deletes WKXSetting', async function() {
		await mainModule.WKXSettingsMetalDelete(WKXTestingStorageClient, (await mainModule.WKXSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid())).WKXSettingKey);
		deepEqual(await mainModule.WKXSettingsMetalList(WKXTestingStorageClient), {});
	});

});
