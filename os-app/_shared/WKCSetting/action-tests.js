const { rejects, deepEqual } = require('assert');

const mainModule = require('./action.js');

describe('WKCSettingsActionProperty', function testWKCSettingsActionProperty() {

	it('rejects if param1 not string', async function() {
		await rejects(mainModule.WKCSettingsActionProperty(KVCTestingStorageClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		deepEqual(await mainModule.WKCSettingsActionProperty(KVCTestingStorageClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.WKCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');

			deepEqual(await mainModule.WKCSettingsActionProperty(KVCTestingStorageClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			deepEqual(await mainModule.WKCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo'), true);
		});
		
	});

});

describe('WKCSettingsActionDelete', function testWKCSettingsActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCSettingsActionDelete(KVCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		await mainModule.WKCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');
		deepEqual(await mainModule.WKCSettingsActionDelete(KVCTestingStorageClient, 'alfa'), {
			statusCode: 200,
		});
	});

	it('deletes WKCSetting', async function() {
		await mainModule.WKCSettingsActionProperty(KVCTestingStorageClient, 'alfa', 'bravo');
		await mainModule.WKCSettingsActionDelete(KVCTestingStorageClient, 'alfa');
		deepEqual(await mainModule.WKCSettingsActionQuery(KVCTestingStorageClient, {}), []);
	});

});
