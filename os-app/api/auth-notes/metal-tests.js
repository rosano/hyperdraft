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
