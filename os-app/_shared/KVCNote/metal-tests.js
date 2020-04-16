const { rejects, deepEqual } = require('assert');

const mainModule = require('./metal.js').default;

const kTesting = {
	StubNoteObjectValid() {
		return {
			KVCNoteID: 'alfa',
			KVCNoteBody: 'charlie',
			KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('KVCNoteMetalWrite', function test_KVCNoteMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteID: null,
		}))).KVCErrors, {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(item, Object.assign(kTesting.StubNoteObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('KVCNoteMetalRead', function test_KVCNoteMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCNoteMetalRead(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.KVCNoteMetalRead(KVCTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(await mainModule.KVCNoteMetalRead(KVCTestingStorageClient, item.KVCNoteID), item);
	});

});

describe('KVCNoteMetalList', function test_KVCNoteMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.KVCNoteMetalList(KVCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid());
		deepEqual(Object.values(await mainModule.KVCNoteMetalList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.KVCNoteMetalList(KVCTestingStorageClient)), [item.KVCNoteID]);
	});

});

describe('KVCNoteMetalDelete', function test_KVCNoteMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCNoteMetalDelete(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.KVCNoteMetalDelete(KVCTestingStorageClient, (await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid())).KVCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes KVCNote', async function() {
		await mainModule.KVCNoteMetalDelete(KVCTestingStorageClient, (await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, kTesting.StubNoteObjectValid())).KVCNoteID);
		deepEqual(await mainModule.KVCNoteMetalList(KVCTestingStorageClient), {});
	});

});
