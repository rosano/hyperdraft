/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./metal');

const kTesting = {
	TestValidNote: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
};

describe('WKCNotesMetalCreate', function testWKCNotesMetalCreate() {

	it('rejects if not object', function() {
		assert.rejects(mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, null), /WKCErrorInvalidInput/);
	});

	it('returns inputData with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.TestValidNote(), {
			WKCNoteBody: null,
		}))).WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns object', async function() {
		let item = await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.TestValidNote());
		
		assert.deepEqual(item, Object.assign(kTesting.TestValidNote(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteDateCreated: item.WKCNoteDateCreated,
			WKCNoteDateUpdated: item.WKCNoteDateUpdated,
		}));
		assert.strictEqual(parseInt(item.WKCNoteID) - (new Date()) > -500, true);
	});

});

describe('WKCNotesMetalUpdate', function testWKCNotesMetalUpdate() {

	it('rejects if param2 not string', function() {
		assert.rejects(mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, 1, {}), /WKCErrorInvalidInput/);
	});

	it('rejects if param3 not object', function() {
		assert.rejects(mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, '1', null), /WKCErrorInvalidInput/);
	});

	it('returns null if not found', async function() {
		assert.strictEqual(await mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, 'alfa', kTesting.TestValidNote()), null);
	});

	it('returns inputData with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, (await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.TestValidNote())).WKCNoteID, {
			WKCNoteBody: null,
		})).WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns updated object', async function() {
		let itemCreated = await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.TestValidNote());
		let itemUpdated = await mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, itemCreated.WKCNoteID, {
			WKCNoteBody: 'bravo',
		});

		assert.deepEqual(itemUpdated, Object.assign(itemCreated, {
			WKCNoteBody: 'bravo',
			WKCNoteDateUpdated: itemUpdated.WKCNoteDateUpdated,
		}));
	});

});

