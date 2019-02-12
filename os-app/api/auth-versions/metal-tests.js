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
	uSleep(inputData) {
		let endTime = new Date().getTime();
		while (new Date().getTime() < endTime + inputData) {}
	},
};

describe('WKCVersionsMetalCreate', function testWKCVersionsMetalCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, null), /WKCErrorInputInvalid/);
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
		let item = await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, kTesting.StubValidVersion());
		
		assert.deepEqual(item, Object.assign(kTesting.StubValidVersion(), {
			WKCVersionID: item.WKCVersionID,
		}));
		assert.strictEqual(parseInt(item.WKCVersionID) - (new Date()) > -500, true);
	});

});

describe('WKCVersionsMetalDelete', function testWKCVersionsMetalDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalDelete(WKCTestingMongoClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalDelete(WKCTestingMongoClient, 'alfa'), new Error('WKCErrorNotFound'))
	});

	it('returns true', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalDelete(WKCTestingMongoClient, (await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, kTesting.StubValidVersion())).WKCVersionID), true);
	});

});

describe('WKCVersionsMetalQuery', function testWKCVersionsMetalQuery() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCVersionsMetalQuery(WKCTestingMongoClient, null), /WKCErrorInputInvalid/);
	});

	it('returns array if none', async function() {
		assert.deepEqual(await mainModule.WKCVersionsMetalQuery(WKCTestingMongoClient, {}), []);
	});

	it('returns array', async function() {
		let items = await Promise.all(['alfa', 'bravo'].map(async function (e) {
			kTesting.uSleep(10);
			return await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubValidVersion(), {
				WKCVersionBody: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCVersionsMetalQuery(WKCTestingMongoClient, {}), items.reverse());
	});

	it('filters result by query', async function() {
		let items = await Promise.all(['alfa', 'bravo'].map(async function (e) {
			return await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubValidVersion(), {
				WKCVersionBody: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCVersionsMetalQuery(WKCTestingMongoClient, {
			WKCVersionBody: 'bravo',
		}), [items.pop()]);
	});

});
