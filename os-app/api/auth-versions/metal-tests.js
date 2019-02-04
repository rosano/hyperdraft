/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./metal');

const kTesting = {
	StubValidVersion: function() {
		return {
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
			WKCVersionDate: new Date('2019-01-30T18:10:00.000Z'),
		};
	},
};

describe('WKCVersionsMetalCreate', function testWKCVersionsMetalCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, null), /WKCErrorInvalidInput/);
	});

	it('returns inputData if not valid', async function() {
		assert.deepEqual((await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubValidVersion(), {
			WKCVersionBody: null,
		}))).WKCErrors, {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns object', async function() {
		let responseJSON = await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, kTesting.StubValidVersion());
		
		assert.deepEqual(responseJSON, Object.assign(kTesting.StubValidVersion(), {
			WKCVersionID: responseJSON.WKCVersionID,
		}));
		assert.strictEqual(parseInt(responseJSON.WKCVersionID) - (new Date()) > -500, true);
	});

});

describe('WKCVersionsMetalDelete', function testWKCVersionsMetalDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalDelete(WKCTestingMongoClient, 1), /WKCErrorInvalidInput/);
	});

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalDelete(WKCTestingMongoClient, 'alfa'), new Error('WKCErrorNotFound'))
	});

	it('returns true', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalDelete(WKCTestingMongoClient, (await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, kTesting.StubValidVersion())).WKCVersionID), true);
	});

});

describe('WKCVersionsMetalSearch', function testWKCVersionsMetalSearch() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalSearch(WKCTestingMongoClient, null), /WKCErrorInvalidInput/);
	});

	it('returns array if none', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalSearch(WKCTestingMongoClient, {}), []);
	});

	it('returns array', async function() {
		let items = await Promise.all(['alfa', 'bravo'].map(async function (e) {
			return await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubValidVersion(), {
				WKCVersionBody: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCVersionsMetalSearch(WKCTestingMongoClient, {}), items.reverse());
	});

});
