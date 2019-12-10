/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./metal.js');

describe('WKCSettingsMetalProperty', function testWKCSettingsMetalProperty() {

	it('rejects if param1 not string', async function() {
		await assert.rejects(mainModule.WKCSettingsMetalProperty(KVCTestingMongoClient, null));
	});

	it('returns undefined if param1 not found', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalProperty(KVCTestingMongoClient, 'alfa'), undefined);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.WKCSettingsMetalProperty(KVCTestingMongoClient, 'alfa', 'bravo');

			assert.deepEqual(await mainModule.WKCSettingsMetalProperty(KVCTestingMongoClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			assert.deepEqual(await mainModule.WKCSettingsMetalProperty(KVCTestingMongoClient, 'alfa', 'bravo'), true);
		});
		
	});

});
