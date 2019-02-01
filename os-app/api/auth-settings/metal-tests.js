/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./metal.js');
var notesMetalLibrary = require('../auth-notes/metal.js');
var notesActionLibrary = require('../auth-notes/action.js');

const kTesting = {
	StubValidNote: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
};

describe.only('WKCSettingsMetalProperty', function testWKCSettingsMetalProperty() {

	it('rejects if param1 not string', function() {
		assert.rejects(mainModule.WKCSettingsMetalProperty(WKCTestingMongoClient, null));
	});

	it('returns null if param1 not found', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalProperty(WKCTestingMongoClient, 'alfa'), null);
	});

	context('param2', function () {

		it('returns value if undefined', async function() {
			await mainModule.WKCSettingsMetalProperty(WKCTestingMongoClient, 'alfa', 'bravo');

			assert.deepEqual(await mainModule.WKCSettingsMetalProperty(WKCTestingMongoClient, 'alfa'), 'bravo');
		});

		it('returns true and sets value', async function() {
			assert.deepEqual(await mainModule.WKCSettingsMetalProperty(WKCTestingMongoClient, 'alfa', 'bravo'), true);
		});
		
	});

});

describe.only('WKCSettingsMetalNotesLastPublicID', function testWKCSettingsMetalNotesLastPublicID() {

	it('returns 0 if no published items', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalNotesLastPublicID(WKCTestingMongoClient), 0);
	});

	it('returns 1 if published one', async function() {
		await notesActionLibrary.WKCNotesActionPublish(WKCTestingMongoClient, (await notesMetalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote())).WKCNoteID);

		assert.deepEqual(await mainModule.WKCSettingsMetalNotesLastPublicID(WKCTestingMongoClient), 1);
	});

});
