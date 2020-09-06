const { throws, rejects, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

const OLSKRemoteStoragePackage = require('OLSKRemoteStorage');
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

describe('KVCNoteStorageCollectionName', function test_KVCNoteStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageCollectionName(), 'kvc_notes');
	});

});

describe('KVCNoteStorageCollectionPath', function test_KVCNoteStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageCollectionPath(), mainModule.KVCNoteStorageCollectionName() + '/');
	});

});

describe('KVCNoteStorageFolderPath', function test_KVCNoteStorageFolderPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCNoteStorageFolderPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubNoteObjectValid();
		deepEqual(mainModule.KVCNoteStorageFolderPath(item), mainModule.KVCNoteStorageCollectionPath() + item.KVCNoteCreationDate.toJSON().split('T').shift() + '/' + item.KVCNoteID + '/');
	});

});

describe('KVCNoteStorageObjectPath', function test_KVCNoteStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCNoteStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageObjectPath(StubNoteObjectValid()), mainModule.KVCNoteStorageFolderPath(StubNoteObjectValid()) + 'main');
	});

});

describe('KVCNoteStorageObjectPathV1', function test_KVCNoteStorageObjectPathV1() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCNoteStorageObjectPathV1({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubNoteObjectValid();
		deepEqual(mainModule.KVCNoteStorageObjectPathV1(item), mainModule.KVCNoteStorageCollectionPath() + item.KVCNoteID);
	});

});

describe('KVCNoteStorageMatchV1', function test_KVCNoteStorageMatchV1() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCNoteStorageMatchV1(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if no KVCNoteStorageCollectionPath', function() {
		const item = mainModule.KVCNoteStorageCollectionPath();
		deepEqual(mainModule.KVCNoteStorageMatchV1(mainModule.KVCNoteStorageObjectPathV1(StubNoteObjectValid()).replace(item, item.slice(0, -2) + '/')), false);
	});

	it('returns false if no KVCNoteStorageObjectPathV1', function() {
		deepEqual(mainModule.KVCNoteStorageMatchV1(mainModule.KVCNoteStorageObjectPathV1(StubNoteObjectValid()) + '/'), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KVCNoteStorageMatchV1(mainModule.KVCNoteStorageObjectPathV1(StubNoteObjectValid())), true);
	});

});

describe('KVCNoteStorageMatch', function test_KVCNoteStorageMatch() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCNoteStorageMatch(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if no KVCNoteStorageCollectionPath', function() {
		const item = mainModule.KVCNoteStorageCollectionPath();
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(StubNoteObjectValid()).replace(item, item.slice(0, -2) + '/')), false);
	});

	it('returns false if no KVCNoteStorageObjectPath', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(StubNoteObjectValid()).slice(0, -1)), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(StubNoteObjectValid())), true);
	});

	it('returns false if old path', function () {
		deepEqual(mainModule.KVCNoteStorageMatch('kvc_notes/01EC08S8BG8WJVM4ZYMGC7EK9W/main'), false);
	});

});

describe('KVCNoteStorageWrite', function test_KVCNoteStorageWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, Object.assign(StubNoteObjectValid(), {
			KVCNoteID: null,
		}))).KVCErrors, {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns input', async function () {
		const item = StubNoteObjectValid();

		deepEqual(await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, item) === item, true);
	});

	it('leaves input unmodified', async function () {
		deepEqual(await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, StubNoteObjectValid()), StubNoteObjectValid());
	});

	context('relations', function () {

		const item = Object.assign(StubNoteObjectValid(), {
			$alfa: 'bravo',
		});
		let outputData, storage;

		before(async function () {
			outputData = await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, item);
		});
		
		before(async function () {
			storage = Object.values(await mainModule.KVCNoteStorageList(KVCTestingStorageClient));
		});
		
		it('excludes from storage', function () {
			deepEqual(storage, [StubNoteObjectValid()]);
		});
		
		it('includes in outputData', function () {
			deepEqual(outputData, item);
		});

		it('updates inputData', function () {
			deepEqual(outputData === item, true);
		});
		
	});

});

describe('KVCNoteStorageList', function test_KVCNoteStorageList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.KVCNoteStorageList(KVCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, StubNoteObjectValid());
		deepEqual(Object.values(await mainModule.KVCNoteStorageList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.KVCNoteStorageList(KVCTestingStorageClient)), [item.KVCNoteID]);
	});

});

describe('KVCNoteStorageDelete', function test_KVCNoteStorageDelete() {

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteStorageDelete(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.KVCNoteStorageDelete(KVCTestingStorageClient, await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, StubNoteObjectValid())), {
			statusCode: 200,
		});
	});

	it('deletes KVCNote', async function() {
		await mainModule.KVCNoteStorageDelete(KVCTestingStorageClient, await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, StubNoteObjectValid()));
		deepEqual(await mainModule.KVCNoteStorageList(KVCTestingStorageClient), {});
	});

	it('deletes file from public folder', async function() {
		const item = await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		}));

		await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item), item.KVCNoteBody);

		await mainModule.KVCNoteStorageDelete(KVCTestingStorageClient, await mainModule.KVCNoteStorageWrite(KVCTestingStorageClient, item));


		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(mainModule.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

});

describe('KVCNoteStorageMigrateV1', function test_KVCNoteStorageMigrateV1() {

	it('rejects if not function', async function() {
		await rejects(mainModule.KVCNoteStorageDelete(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('resolves array', async function() {
		deepEqual(await mainModule.KVCNoteStorageMigrateV1(KVCTestingStorageClient, function () {}), []);
	});

	context('V1', function () {

		const item = {
			KVCNoteID: 'alfa',
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
		const outputData = [];

		beforeEach(function () {
			return OLSKRemoteStorage.OLSKRemoteStorageWriteObject(KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePrivateClient(), mainModule.KVCNoteStorageObjectPathV1(item), item);
		});

		beforeEach(async function () {
			deepEqual(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePrivateClient().getObject(mainModule.KVCNoteStorageObjectPathV1(item))), item);
		});

		beforeEach(async function () {
			await mainModule.KVCNoteStorageMigrateV1(KVCTestingStorageClient, function (inputData) {
				outputData.push(inputData);
			});
		});

		it('creates destination object', async function () {
			deepEqual(Object.values(await mainModule.KVCNoteStorageList(KVCTestingStorageClient)), [item]);
		});

		it('deletes source object', async function () {
			deepEqual(await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePrivateClient().getObject(mainModule.KVCNoteStorageObjectPathV1(item)), null);
		});

		it('passes destination object to callback', function() {
			deepEqual(outputData, [item]);
		});

		afterEach(function () {
			outputData.pop();
		});
	
	});

});

describe('KVCNoteStoragePublicObjectPath', function test_KVCNoteStoragePublicObjectPath() {

	it('throws if not valid', function() {
		throws(function() {
			mainModule.KVCNoteStoragePublicObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if no KVCNotePublicID', function() {
		throws(function() {
			mainModule.KVCNoteStoragePublicObjectPath(StubNoteObjectValid());
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		});

		deepEqual(mainModule.KVCNoteStoragePublicObjectPath(item), item.KVCNotePublicID);
	});

});

describe('KVCNoteStoragePublicRootPagePath', function test_KVCNoteStoragePublicRootPagePath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStoragePublicRootPagePath(), 'index.html');
	});

});

describe('KVCNoteStoragePublicWrite', function test_KVCNoteStoragePublicWrite() {

	it('rejects if not object path', async function() {
		await rejects(mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, '', 'bravo'), /KVCErrorInputNotValid/);
	});

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, 'alfa', null), /KVCErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, 'alfa', 'bravo'), undefined);
	});

	it('writes file to public folder', async function() {
		await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, 'alfa', 'bravo');

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile('alfa')).data, 'bravo');
	});

});

describe('KVCNoteStoragePublicDelete', function test_KVCNoteStoragePublicDelete() {

	it('rejects if not object path', async function() {
		await rejects(mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, ''), /KVCErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(await mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, 'alfa'), {
			statusCode: 200,
		});
	});

	it('deletes file from public folder', async function() {
		const item = Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		});
		await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item), item.KVCNoteBody);

		await mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item));

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(mainModule.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

});

describe('KVCNoteStoragePublicURL', function test_KVCNoteStoragePublicURL() {

	const item = Object.assign(StubNoteObjectValid(), {
		KVCNotePublicID: 'charlie',
	});

	it('throws if not object path', function() {
		throws(function() {
			mainModule.KVCNoteStoragePublicURL(KVCTestingStorageClient, '');
		}, /KVCErrorInputNotValid/);
	});

	it('returns undefined', function() {
		deepEqual(mainModule.KVCNoteStoragePublicURL(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item)), undefined);
	});

	it.skip('returns url if connected', async function() {
		await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, item, mainModule.KVCNoteStoragePublicObjectPath(item));

		deepEqual(mainModule.KVCNoteStoragePublicURL(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item)), mainModule.KVCNoteStoragePublicObjectPath(item));
	});

});
