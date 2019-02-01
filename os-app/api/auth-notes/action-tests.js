/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var metalLibrary = require('./metal.js');
var mainModule = require('./action.js');

const kTesting = {
	StubValidNote: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
};

describe.only('WKCNotesActionPublish', function testWKCNotesActionPublish() {

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, 'alfa'), new Error('WKCErrorNotFound'))
	});

	it('returns WKCNote with updates', async function() {
		let itemCreated = await metalLibrary.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		let itemUpdated = await mainModule.WKCNotesActionPublish(WKCTestingMongoClient, itemCreated.WKCNoteID);

		assert.deepEqual(itemUpdated, Object.assign(itemCreated, {
			WKCNoteDateUpdated: itemUpdated.WKCNoteDateUpdated,
			WKCNotePublishStatusIsPublished: true,
		}));
	});

});
