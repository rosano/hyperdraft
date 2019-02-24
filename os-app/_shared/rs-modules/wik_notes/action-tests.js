const assert = require('assert');

const mainModule = require('./action.js');
const storageClient = require('../../WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wik_notes: null,
});

const kTesting = {
	StubNoteObject: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
};

describe('RSNotesActionCreate', function testRSNotesActionCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.RSNotesActionCreate(storageClient, null), /RSErrorInputInvalid/);
	});

	it('returns object with RSErrors if not valid', async function() {
		assert.deepEqual((await mainModule.RSNotesActionCreate(storageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		}))).RSErrors, {
			WKCNoteBody: [
				'RSErrorNotString',
			],
		})
	});

	it('returns RSNote', async function() {
		let item = await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject());

		assert.deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteDateCreated: item.WKCNoteDateCreated,
			RSNoteModificationDate: item.RSNoteModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCNoteID to unique value', async function() {
		let items = []

		Array.from(Array(10)).forEach(async function (e) {
			items.push((await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteID);
		});
		assert.deepEqual((new Set(items)).values(), items);
	});

	it('sets WKCNoteDateCreated to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.RSNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteDateCreated < 100, true);
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
			WKCNoteID: null,
		}))).RSErrors, {
			WKCNoteID: [
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
