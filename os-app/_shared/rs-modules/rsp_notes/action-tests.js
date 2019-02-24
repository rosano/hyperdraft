const assert = require('assert');

const mainModule = require('./action.js');
const storageClient = require('../RSStorageClient/storage.js').RSStorageClientForChangeDelegateMap({
	rsp_notes: null,
});

const kTesting = {
	StubNoteObject: function() {
		return {
			RSNoteBody: 'alfa',
		};
	},
};

describe('RSNotesActionCreate', function testRSNotesActionCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.RSNotesActionCreate(storageClient, null), /RSErrorInputInvalid/);
	});

	it('returns object with RSErrors if not valid', async function() {
		assert.deepEqual((await mainModule.RSNotesActionCreate(storageClient, Object.assign(kTesting.StubNoteObject(), {
			RSNoteBody: null,
		}))).RSErrors, {
			RSNoteBody: [
				'RSErrorNotString',
			],
		})
	});

	it('returns RSNote', async function() {
		let item = await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject());

		assert.deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			RSNoteID: item.RSNoteID,
			RSNoteCreationDate: item.RSNoteCreationDate,
			RSNoteModificationDate: item.RSNoteModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets RSNoteID to unique value', async function() {
		let items = []

		Array.from(Array(10)).forEach(async function (e) {
			items.push((await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject())).RSNoteID);
		});
		assert.deepEqual((new Set(items)).values(), items);
	});

	it('sets RSNoteCreationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject())).RSNoteCreationDate < 100, true);
	});

	it('sets RSNoteModificationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject())).RSNoteModificationDate < 100, true);
	});

});

describe('RSNotesActionUpdate', function testRSNotesActionUpdate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.RSNotesActionUpdate(storageClient, null), /RSErrorInputInvalid/);
	});

	it('returns object with RSErrors if not valid', async function() {
		assert.deepEqual((await mainModule.RSNotesActionUpdate(storageClient, Object.assign(await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject()), {
			RSNoteID: null,
		}))).RSErrors, {
			RSNoteID: [
				'RSErrorNotString',
			],
		})
	});

	it('returns RSNote', async function() {
		let itemCreated = await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject());

		let item = await mainModule.RSNotesActionUpdate(storageClient, itemCreated);

		assert.deepEqual(item, Object.assign(itemCreated, {
			RSNoteModificationDate: item.RSNoteModificationDate,
		}));
	});

	it('sets RSNoteModificationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.RSNotesActionUpdate(storageClient, await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject()))).RSNoteModificationDate < 100, true);
	});

});
