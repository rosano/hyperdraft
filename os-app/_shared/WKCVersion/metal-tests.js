const { rejects, deepEqual } = require('assert');

const mainModule = require('./metal.js');

const kTesting = {
	StubNoteObjectValid() {
		return {
			WKCVersionID: 'alfa',
			WKCVersionNoteID: 'bravo',
			WKCVersionBody: 'charlie',
			WKCVersionDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKCVersionMetalWrite', function testWKCVersionMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCVersionMetalWrite(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCVersionMetalWrite(WKCTestingStorageClient, Object.assign(kTesting.StubNoteObjectValid(), {
			WKCVersionID: null,
		}))).WKCErrors, {
			WKCVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCVersionMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(item, Object.assign(kTesting.StubNoteObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCVersionMetalRead', function testWKCVersionMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCVersionMetalRead(WKCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.WKCVersionMetalRead(WKCTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCVersionMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());

		deepEqual(await mainModule.WKCVersionMetalRead(WKCTestingStorageClient, item.WKCVersionID), item);
	});

});

describe('WKCVersionMetalList', function testWKCVersionMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.WKCVersionMetalList(WKCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.WKCVersionMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid());
		deepEqual(Object.values(await mainModule.WKCVersionMetalList(WKCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCVersionMetalList(WKCTestingStorageClient)), [item.WKCVersionID]);
	});

});

describe('WKCVersionMetalDelete', function testWKCVersionMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCVersionMetalDelete(WKCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.WKCVersionMetalDelete(WKCTestingStorageClient, (await mainModule.WKCVersionMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid())).WKCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes WKCVersion', async function() {
		await mainModule.WKCVersionMetalDelete(WKCTestingStorageClient, (await mainModule.WKCVersionMetalWrite(WKCTestingStorageClient, kTesting.StubNoteObjectValid())).WKCVersionID);
		deepEqual(await mainModule.WKCVersionMetalList(WKCTestingStorageClient), {});
	});

});
