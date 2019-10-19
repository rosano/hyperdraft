import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

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
		await rejects(mainModule.WKCSettingsMetalWrite(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCSettingsMetalWrite(WKXTestingStorageClient, Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingKey: null,
		}))).WKCErrors, {
			WKCSettingKey: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCSetting', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid());

		deepEqual(item, Object.assign(kTesting.StubSettingObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCSettingsMetalRead', function testWKCSettingsMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCSettingsMetalRead(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKCSettingsMetalRead(WKXTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCSetting', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid());

		deepEqual(await mainModule.WKCSettingsMetalRead(WKXTestingStorageClient, item.WKCSettingKey), item);
	});

});

describe('WKCSettingsMetalList', function testWKCSettingsMetalList() {

	it('returns empty array if none', async function() {
		deepEqual(await mainModule.WKCSettingsMetalList(WKXTestingStorageClient), {});
	});

	it('returns existing WKCSettings', async function() {
		let item = await mainModule.WKCSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid());
		deepEqual(Object.values(await mainModule.WKCSettingsMetalList(WKXTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCSettingsMetalList(WKXTestingStorageClient)), [item.WKCSettingKey]);
	});

});

describe('WKCSettingsMetalDelete', function testWKCSettingsMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCSettingsMetalDelete(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.WKCSettingsMetalDelete(WKXTestingStorageClient, (await mainModule.WKCSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid())).WKCSettingKey), {
			statusCode: 200,
		});
	});

	it('deletes WKCSetting', async function() {
		await mainModule.WKCSettingsMetalDelete(WKXTestingStorageClient, (await mainModule.WKCSettingsMetalWrite(WKXTestingStorageClient, kTesting.StubSettingObjectValid())).WKCSettingKey);
		deepEqual(await mainModule.WKCSettingsMetalList(WKXTestingStorageClient), {});
	});

});
