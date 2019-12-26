if (global.KVCTestingMongoSkipped) {
	return;
}

const assert = require('assert');

const mainModule = require('./metal.js');

describe('KVCSettingsMetalProperty', function testKVCSettingsMetalProperty() {

	it('rejects if param1 not string', async function() {
		await assert.rejects(mainModule.KVCSettingsMetalProperty(KVCTestingMongoClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		assert.deepEqual(await mainModule.KVCSettingsMetalProperty(KVCTestingMongoClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.KVCSettingsMetalProperty(KVCTestingMongoClient, 'alfa', 'bravo');

			assert.deepEqual(await mainModule.KVCSettingsMetalProperty(KVCTestingMongoClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			assert.deepEqual(await mainModule.KVCSettingsMetalProperty(KVCTestingMongoClient, 'alfa', 'bravo'), true);
		});
		
	});

});
