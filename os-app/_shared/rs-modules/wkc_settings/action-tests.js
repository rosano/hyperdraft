const assert = require('assert');

const mainModule = require('./action.js');

describe('WKCSettingsActionProperty', function testWKCSettingsActionProperty() {

	it('rejects if param1 not string', async function() {
		await assert.rejects(mainModule.WKCSettingsActionProperty(WKCTestingStorageClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		assert.deepEqual(await mainModule.WKCSettingsActionProperty(WKCTestingStorageClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.WKCSettingsActionProperty(WKCTestingStorageClient, 'alfa', 'bravo');

			assert.deepEqual(await mainModule.WKCSettingsActionProperty(WKCTestingStorageClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			assert.deepEqual(await mainModule.WKCSettingsActionProperty(WKCTestingStorageClient, 'alfa', 'bravo'), true);
		});
		
	});

});

describe('WKCSettingsActionDelete', function testWKCSettingsActionDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCSettingsActionDelete(WKCTestingStorageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		await mainModule.WKCSettingsActionProperty(WKCTestingStorageClient, 'alfa', 'bravo');
		assert.deepEqual(await mainModule.WKCSettingsActionDelete(WKCTestingStorageClient, 'alfa'), {
			statusCode: 200,
		});
	});

	it('deletes WKCSetting', async function() {
		await mainModule.WKCSettingsActionProperty(WKCTestingStorageClient, 'alfa', 'bravo');
		await mainModule.WKCSettingsActionDelete(WKCTestingStorageClient, 'alfa');
		assert.deepEqual(await mainModule.WKCSettingsActionQuery(WKCTestingStorageClient, {}), []);
	});

});
