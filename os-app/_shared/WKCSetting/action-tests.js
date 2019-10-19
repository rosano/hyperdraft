import { rejects, deepEqual } from 'assert';

import * as mainModule from './action.js';

describe('WKCSettingsActionProperty', function testWKCSettingsActionProperty() {

	it('rejects if param1 not string', async function() {
		await rejects(mainModule.WKCSettingsActionProperty(WKXTestingStorageClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		deepEqual(await mainModule.WKCSettingsActionProperty(WKXTestingStorageClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.WKCSettingsActionProperty(WKXTestingStorageClient, 'alfa', 'bravo');

			deepEqual(await mainModule.WKCSettingsActionProperty(WKXTestingStorageClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			deepEqual(await mainModule.WKCSettingsActionProperty(WKXTestingStorageClient, 'alfa', 'bravo'), true);
		});
		
	});

});

describe('WKCSettingsActionDelete', function testWKCSettingsActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCSettingsActionDelete(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		await mainModule.WKCSettingsActionProperty(WKXTestingStorageClient, 'alfa', 'bravo');
		deepEqual(await mainModule.WKCSettingsActionDelete(WKXTestingStorageClient, 'alfa'), {
			statusCode: 200,
		});
	});

	it('deletes WKCSetting', async function() {
		await mainModule.WKCSettingsActionProperty(WKXTestingStorageClient, 'alfa', 'bravo');
		await mainModule.WKCSettingsActionDelete(WKXTestingStorageClient, 'alfa');
		deepEqual(await mainModule.WKCSettingsActionQuery(WKXTestingStorageClient, {}), []);
	});

});
