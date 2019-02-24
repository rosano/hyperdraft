const assert = require('assert');

const mainModule = require('./metal.js');
const storageClient = require('../../WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wik_notes: null,
});

const kTesting = {
	StubNoteObjectValid: function() {
		return {
			WKCNoteID: 'alfa',
			WKCNoteBody: 'bravo',
			WKCNoteDateCreated: new Date('2019-02-23T13:56:36Z'),
			RSNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

beforeEach(async function() {
	await Promise.all(Object.keys(await storageClient.wik_notes.listObjects()).map(storageClient.wik_notes.deleteObject));
});

describe('WKCNotesMetalWrite', function testWKCNotesMetalWrite() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesMetalWrite(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesMetalWrite(storageClient, Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns RSNote', async function() {
		let item = await mainModule.WKCNotesMetalWrite(storageClient, kTesting.StubNoteObjectValid());

		assert.deepEqual(item, Object.assign(kTesting.StubNoteObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCNotesMetalRead', function testWKCNotesMetalRead() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesMetalRead(storageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns null if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesMetalRead(storageClient, 'alfa'), null);
	});

	it('returns RSNote', async function() {
		let item = await mainModule.WKCNotesMetalWrite(storageClient, kTesting.StubNoteObjectValid());

		assert.deepEqual(await mainModule.WKCNotesMetalRead(storageClient, item.WKCNoteID), item);
	});

});

describe('WKCNotesMetalList', function testWKCNotesMetalList() {

	it('returns empty array if none', async function() {
		assert.deepEqual(await mainModule.WKCNotesMetalList(storageClient), {});
	});

	it('returns existing WKCNotes', async function() {
		let item = await mainModule.WKCNotesMetalWrite(storageClient, kTesting.StubNoteObjectValid());
			assert.deepEqual(Object.values(await mainModule.WKCNotesMetalList(storageClient)), [item]);
			assert.deepEqual(Object.keys(await mainModule.WKCNotesMetalList(storageClient)), [item.WKCNoteID]);
	});

});

describe('WKCNotesMetalDelete', function testWKCNotesMetalDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesMetalDelete(storageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		assert.deepEqual(await mainModule.WKCNotesMetalDelete(storageClient, (await mainModule.WKCNotesMetalWrite(storageClient, kTesting.StubNoteObjectValid())).WKCNoteID), {
			statusCode: 200,
		});
	});

});
