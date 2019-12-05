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
		await rejects(mainModule.WKCNoteMetalWrite(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCNoteMetalWrite(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObjectValid(), {
			WKCNoteID: null,
		}))).WKCErrors, {
			WKCNoteID: [
				'WKCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCNoteMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(item, Object.assign(kTesting.StubNoteObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCNoteMetalRead', function testWKCNoteMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNoteMetalRead(WKCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.WKCNoteMetalRead(WKCTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCNoteMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(await mainModule.WKCNoteMetalRead(WKCTestingStorageClient, item.WKCNoteID), item);
	});

});

describe('WKCNoteMetalList', function testWKCNoteMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.WKCNoteMetalList(WKCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.WKCNoteMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());
		deepEqual(Object.values(await mainModule.WKCNoteMetalList(WKCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCNoteMetalList(WKCTestingStorageClient)), [item.WKCNoteID]);
	});

});

describe('WKCNoteMetalDelete', function testWKCNoteMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCNoteMetalDelete(WKCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.WKCNoteMetalDelete(WKCTestingStorageClient, (await mainModule.WKCNoteMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid())).WKCNoteID), {
			statusCode: 200,
		});
	});

	it('deletes WKCNote', async function() {
		await mainModule.WKCNoteMetalDelete(WKCTestingStorageClient, (await mainModule.WKCNoteMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid())).WKCNoteID);
		deepEqual(await mainModule.WKCNoteMetalList(WKCTestingStorageClient), {});
	});

});
