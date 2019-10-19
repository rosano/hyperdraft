import { rejects, deepEqual } from 'assert';

import * as mainModule from './action.js';

describe('WKXSettingsActionProperty', function testWKXSettingsActionProperty() {

	it('rejects if param1 not string', async function() {
		await rejects(mainModule.WKXSettingsActionProperty(WKXTestingStorageClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		deepEqual(await mainModule.WKXSettingsActionProperty(WKXTestingStorageClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.WKXSettingsActionProperty(WKXTestingStorageClient, 'alfa', 'bravo');

			deepEqual(await mainModule.WKXSettingsActionProperty(WKXTestingStorageClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			deepEqual(await mainModule.WKXSettingsActionProperty(WKXTestingStorageClient, 'alfa', 'bravo'), true);
		});
		
	});

});

describe('WKXSettingsActionDelete', function testWKXSettingsActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXSettingsActionDelete(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		await mainModule.WKXSettingsActionProperty(WKXTestingStorageClient, 'alfa', 'bravo');
		deepEqual(await mainModule.WKXSettingsActionDelete(WKXTestingStorageClient, 'alfa'), {
			statusCode: 200,
		});
	});

	it('deletes WKXSetting', async function() {
		await mainModule.WKXSettingsActionProperty(WKXTestingStorageClient, 'alfa', 'bravo');
		await mainModule.WKXSettingsActionDelete(WKXTestingStorageClient, 'alfa');
		deepEqual(await mainModule.WKXSettingsActionQuery(WKXTestingStorageClient, {}), []);
	});

});
