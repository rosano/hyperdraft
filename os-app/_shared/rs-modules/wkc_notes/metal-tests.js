import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

const kTesting = {
	StubNoteObjectValid: function() {
		return {
			WKCNoteID: 'alfa',
			WKCNoteBody: 'bravo',
			WKCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKCNotesMetalWrite', function testWKCNotesMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNotesMetalWrite(WKCTestingStorageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNotesMetalWrite(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNotesMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(item, Object.assign(kTesting.StubNoteObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCNotesMetalRead', function testWKCNotesMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNotesMetalRead(WKCTestingStorageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKCNotesMetalRead(WKCTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNotesMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(await mainModule.WKCNotesMetalRead(WKCTestingStorageClient, item.WKCNoteID), item);
	});

});

describe('WKCNotesMetalList', function testWKCNotesMetalList() {

	it('returns empty array if none', async function() {
		deepEqual(await mainModule.WKCNotesMetalList(WKCTestingStorageClient), {});
	});

	it('returns existing WKCNotes', async function() {
		let item = await mainModule.WKCNotesMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());
		deepEqual(Object.values(await mainModule.WKCNotesMetalList(WKCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCNotesMetalList(WKCTestingStorageClient)), [item.WKCNoteID]);
	});

});

describe('WKCNotesMetalDelete', function testWKCNotesMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNotesMetalDelete(WKCTestingStorageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.WKCNotesMetalDelete(WKCTestingStorageClient, (await mainModule.WKCNotesMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid())).WKCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes WKCNote', async function() {
		await mainModule.WKCNotesMetalDelete(WKCTestingStorageClient, (await mainModule.WKCNotesMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid())).WKCNoteID);
		deepEqual(await mainModule.WKCNotesMetalList(WKCTestingStorageClient), {});
	});

});
