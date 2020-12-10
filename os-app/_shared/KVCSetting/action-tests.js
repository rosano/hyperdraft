const { rejects, deepEqual } = require('assert');

const mod = require('./action.js').default;

describe('KVCSettingsActionProperty', function test_KVCSettingsActionProperty() {

	it('rejects if param1 not string', async function() {
		await rejects(mod.KVCSettingsActionProperty(KVCTestingStorageClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		deepEqual(await mod.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mod.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');

			deepEqual(await mod.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa'), await mod.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa'));
		});

		it('returns object and sets value', async function() {
			deepEqual(await mod.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo'), await mod.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa'));
		});
		
	});

});

describe('KVCSettingsActionDelete', function test_KVCSettingsActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mod.KVCSettingsActionDelete(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		await mod.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');
		deepEqual(await mod.KVCSettingsActionDelete(KVCTestingStorageClient, 'alfa'), {
			statusCode: 200,
		});
	});

	it('deletes KVCSetting', async function() {
		await mod.KVCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');
		await mod.KVCSettingsActionDelete(KVCTestingStorageClient, 'alfa');
		deepEqual(await mod.KVCSettingsActionQuery(KVCTestingStorageClient, {}), []);
	});

});
