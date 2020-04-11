const { rejects, deepEqual } = require('assert');

const mainModule = require('./action.js').default;

describe('KVCSettingsActionProperty', function testKVCSettingsActionProperty() {

	it('rejects if param1 not string', async function() {
		await rejects(mainModule.KVCSettingsActionProperty(KVCTestingStorageClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		deepEqual(await mainModule.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');

			deepEqual(await mainModule.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			deepEqual(await mainModule.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo'), true);
		});
		
	});

});

describe('KVCSettingsActionDelete', function testKVCSettingsActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCSettingsActionDelete(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		await mainModule.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');
		deepEqual(await mainModule.KVCSettingsActionDelete(KVCTestingStorageClient, 'alfa'), {
			statusCode: 200,
		});
	});

	it('deletes KVCSetting', async function() {
		await mainModule.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');
		await mainModule.KVCSettingsActionDelete(KVCTestingStorageClient, 'alfa');
		deepEqual(await mainModule.KVCSettingsActionQuery(KVCTestingStorageClient, {}), []);
	});

});
