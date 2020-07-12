const { rejects, deepEqual } = require('assert');

const mainModule = require('./metal.js').default;
const KVCNoteStorage = require('./storage.js').default;
const OLSKRemoteStoragePackage = require('OLSKRemoteStorage');
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

describe('KVCNoteMetalWrite', function test_KVCNoteMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, Object.assign(StubNoteObjectValid(), {
			KVCNoteID: null,
		}))).KVCErrors, {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, StubNoteObjectValid());

		deepEqual(item, Object.assign(StubNoteObjectValid(), {
			'@context': item['@context'],
		}));
	});

	context('relations', function () {

		const item = Object.assign(StubNoteObjectValid(), {
			$alfa: 'bravo',
		});
		let outputData, storage;

		before(async function () {
			outputData = await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, item);
		});
		
		before(async function () {
			storage = Object.values(await mainModule.KVCNoteMetalList(KVCTestingStorageClient));
		});
		
		it('excludes from storage', function () {
			deepEqual(storage, [Object.assign(StubNoteObjectValid(), {
				'@context': item['@context'],
			})]);
		});
		
		it('includes in outputData', function () {
			deepEqual(outputData, item);
		});

		it('updates inputData', function () {
			deepEqual(outputData === item, true);
		});
		
	});

});

describe('KVCNoteMetalList', function test_KVCNoteMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.KVCNoteMetalList(KVCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, StubNoteObjectValid());
		deepEqual(Object.values(await mainModule.KVCNoteMetalList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.KVCNoteMetalList(KVCTestingStorageClient)), [item.KVCNoteID]);
	});

});

describe('KVCNoteMetalDelete', function test_KVCNoteMetalDelete() {

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteMetalDelete(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.KVCNoteMetalDelete(KVCTestingStorageClient, await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, StubNoteObjectValid())), {
			statusCode: 200,
		});
	});

	it('deletes KVCNote', async function() {
		await mainModule.KVCNoteMetalDelete(KVCTestingStorageClient, await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, StubNoteObjectValid()));
		deepEqual(await mainModule.KVCNoteMetalList(KVCTestingStorageClient), {});
	});

	it('deletes file from public folder', async function() {
		const item = await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		}));

		await KVCNoteStorage.KVCNoteStoragePublicWrite(KVCTestingStorageClient, KVCNoteStorage.KVCNoteStoragePublicObjectPath(item), item.KVCNoteBody);

		await mainModule.KVCNoteMetalDelete(KVCTestingStorageClient, await mainModule.KVCNoteMetalWrite(KVCTestingStorageClient, item));


		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

});

describe('KVCNoteMetalMigrateV1', function test_KVCNoteMetalMigrateV1() {

	it('rejects if not function', async function() {
		await rejects(mainModule.KVCNoteMetalDelete(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('resolves array', async function() {
		deepEqual(await mainModule.KVCNoteMetalMigrateV1(KVCTestingStorageClient, function () {}), []);
	});

	context('V1', function () {

		const item = {
			KVCNoteID: 'alfa',
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
		const outputData = [];

		beforeEach(async function () {
			await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePrivateClient().storeObject(KVCNoteStorage.KVCNoteStorageCollectionType(), KVCNoteStorage.KVCNoteStorageObjectPathV1(item), OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(item));

			OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(item);
		});

		beforeEach(async function () {
			deepEqual(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePrivateClient().getObject(KVCNoteStorage.KVCNoteStorageObjectPathV1(item))), item);
		});

		beforeEach(async function () {
			await mainModule.KVCNoteMetalMigrateV1(KVCTestingStorageClient, function (inputData) {
				outputData.push(inputData);
			});
		});

		it('creates destination object', async function () {
			deepEqual(Object.values(await mainModule.KVCNoteMetalList(KVCTestingStorageClient)), [item]);
		});

		it('deletes source object', async function () {
			deepEqual(await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePrivateClient().getObject(KVCNoteStorage.KVCNoteStorageObjectPathV1(item)), null);
		});

		it('passes destination object to callback', function() {
			deepEqual(outputData, [item]);
		});

		afterEach(function () {
			outputData.pop();
		});
	
	});

});
