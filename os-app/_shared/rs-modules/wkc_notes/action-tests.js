const assert = require('assert');

const mainModule = require('./action.js');
const storageClient = require('../../WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wkc_notes: null,
});

const kTesting = {
	StubNoteObject: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
};

describe('WKCNotesActionCreate', function testWKCNotesActionCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesActionCreate(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesActionCreate(storageClient, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteBody: null,
		}))).WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject());

		assert.deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteCreationDate: item.WKCNoteCreationDate,
			WKCNoteModificationDate: item.WKCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCNoteID to unique value', async function() {
		let items = []

		Array.from(Array(10)).forEach(async function (e) {
			items.push((await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteID);
		});
		assert.deepEqual((new Set(items)).values(), items);
	});

	it('sets WKCNoteCreationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteCreationDate < 100, true);
	});

	it('sets WKCNoteModificationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject())).WKCNoteModificationDate < 100, true);
	});

});

describe('WKCNotesActionUpdate', function testWKCNotesActionUpdate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesActionUpdate(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesActionUpdate(storageClient, Object.assign(await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject()), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCNote', async function() {
		let itemCreated = await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject());

		let item = await mainModule.WKCNotesActionUpdate(storageClient, itemCreated);

		assert.deepEqual(item, Object.assign(itemCreated, {
			WKCNoteModificationDate: item.WKCNoteModificationDate,
		}));
	});

	it('sets WKCNoteModificationDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCNotesActionUpdate(storageClient, await mainModule.WKCNotesActionCreate(storageClient, kTesting.StubNoteObject()))).WKCNoteModificationDate < 100, true);
	});

});
