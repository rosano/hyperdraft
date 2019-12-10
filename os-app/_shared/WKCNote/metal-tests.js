const { rejects, deepEqual } = require('assert');

const mainModule = require('./metal.js');

const kTesting = {
	StubNoteObjectValid() {
		return {
			WKCNoteID: 'alfa',
			WKCNoteBody: 'charlie',
			WKCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKCNoteMetalWrite', function testWKCNoteMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCNoteMetalWrite(KVCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteMetalWrite(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(item, Object.assign(kTesting.StubNoteObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCNoteMetalRead', function testWKCNoteMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNoteMetalRead(KVCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.WKCNoteMetalRead(KVCTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(await mainModule.WKCNoteMetalRead(KVCTestingStorageClient, item.WKCNoteID), item);
	});

});

describe('WKCNoteMetalList', function testWKCNoteMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.WKCNoteMetalList(KVCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.WKCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid());
		deepEqual(Object.values(await mainModule.WKCNoteMetalList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCNoteMetalList(KVCTestingStorageClient)), [item.WKCNoteID]);
	});

});

describe('WKCNoteMetalDelete', function testWKCNoteMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNoteMetalDelete(KVCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.WKCNoteMetalDelete(KVCTestingStorageClient, (await mainModule.WKCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid())).WKCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes WKCNote', async function() {
		await mainModule.WKCNoteMetalDelete(KVCTestingStorageClient, (await mainModule.WKCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid())).WKCNoteID);
		deepEqual(await mainModule.WKCNoteMetalList(KVCTestingStorageClient), {});
	});

});
