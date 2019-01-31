/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./metal.js');
var notesMetalLibrary = require('../auth-notes/metal.js');

const kTesting = {
	StubValidNote: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
};

describe.only('WKCSettingsMetalNotesLastPublicID', function testWKCSettingsMetalNotesLastPublicID() {

	it('returns 0 if no published items', async function() {
		assert.deepEqual(await mainModule.WKCSettingsMetalNotesLastPublicID(WKCTestingMongoClient), 0);
	});

	it('returns 1 if published one', async function() {
		let item = await notesMetalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());

		assert.deepEqual(await mainModule.WKCSettingsMetalNotesLastPublicID(WKCTestingMongoClient), 1);
	});

});
