const { rejects, deepEqual } = require('assert');

const mainModule = require('./metal.js').default;

const kTesting = {
	StubVersionObjectValid() {
		return {
			KVCVersionID: 'alfa',
			KVCVersionNoteID: 'bravo',
			KVCVersionBody: 'charlie',
			KVCVersionDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('KVCVersionMetalWrite', function test_KVCVersionMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCVersionMetalWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCVersionMetalWrite(KVCTestingStorageClient, Object.assign(kTesting.StubVersionObjectValid(), {
			KVCVersionID: null,
		}))).KVCErrors, {
			KVCVersionID: [
				'KVCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.KVCVersionMetalWrite(KVCTestingStorageClient, kTesting.StubVersionObjectValid());

		deepEqual(item, Object.assign(kTesting.StubVersionObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('KVCVersionMetalList', function test_KVCVersionMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.KVCVersionMetalList(KVCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.KVCVersionMetalWrite(KVCTestingStorageClient, kTesting.StubVersionObjectValid());
		deepEqual(Object.values(await mainModule.KVCVersionMetalList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.KVCVersionMetalList(KVCTestingStorageClient)), [item.KVCVersionID]);
	});

});

describe('KVCVersionMetalDelete', function test_KVCVersionMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCVersionMetalDelete(KVCTestingStorageClient, 1), /KVCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.KVCVersionMetalDelete(KVCTestingStorageClient, (await mainModule.KVCVersionMetalWrite(KVCTestingStorageClient, kTesting.StubVersionObjectValid())).KVCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes KVCVersion', async function() {
		await mainModule.KVCVersionMetalDelete(KVCTestingStorageClient, (await mainModule.KVCVersionMetalWrite(KVCTestingStorageClient, kTesting.StubVersionObjectValid())).KVCVersionID);
		deepEqual(await mainModule.KVCVersionMetalList(KVCTestingStorageClient), {});
	});

});
