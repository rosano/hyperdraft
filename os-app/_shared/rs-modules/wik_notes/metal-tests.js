const assert = require('assert');

const mainModule = require('./metal.js');
const storageClient = require('../../RSStorageClient/storage.js').RSStorageClientForChangeDelegateMap({
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

describe('RSNotesMetalWrite', function testRSNotesMetalWrite() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.RSNotesMetalWrite(storageClient, null), /RSErrorInputInvalid/);
	});

	it('returns object with RSErrors if not valid', async function() {
		assert.deepEqual((await mainModule.RSNotesMetalWrite(storageClient, Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: null,
		}))).RSErrors, {
			WKCNoteID: [
				'RSErrorNotString',
			],
		})
	});

	it('returns RSNote', async function() {
		let item = await mainModule.RSNotesMetalWrite(storageClient, kTesting.StubNoteObjectValid());

		assert.deepEqual(item, Object.assign(kTesting.StubNoteObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('RSNotesMetalRead', function testRSNotesMetalRead() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.RSNotesMetalRead(storageClient, 1), /RSErrorInputInvalid/);
	});

	it('returns null if not found', async function() {
		assert.deepEqual(await mainModule.RSNotesMetalRead(storageClient, 'alfa'), null);
	});

	it('returns RSNote', async function() {
		let item = await mainModule.RSNotesMetalWrite(storageClient, kTesting.StubNoteObjectValid());

		assert.deepEqual(await mainModule.RSNotesMetalRead(storageClient, item.WKCNoteID), item);
	});

});

describe('RSNotesMetalList', function testRSNotesMetalList() {

	it('returns empty array if none', async function() {
		assert.deepEqual(await mainModule.RSNotesMetalList(storageClient), {});
	});

	it('returns existing RSNotes', async function() {
		let item = await mainModule.RSNotesMetalWrite(storageClient, kTesting.StubNoteObjectValid());
			assert.deepEqual(Object.values(await mainModule.RSNotesMetalList(storageClient)), [item]);
			assert.deepEqual(Object.keys(await mainModule.RSNotesMetalList(storageClient)), [item.WKCNoteID]);
	});

});

describe('RSNotesMetalDelete', function testRSNotesMetalDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.RSNotesMetalDelete(storageClient, 1), /RSErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		assert.deepEqual(await mainModule.RSNotesMetalDelete(storageClient, (await mainModule.RSNotesMetalWrite(storageClient, kTesting.StubNoteObjectValid())).WKCNoteID), {
			statusCode: 200,
		});
	});

});
