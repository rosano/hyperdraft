const { throws, rejects, deepEqual } = require('assert');

const mod = require('./storage.js').default;

const OLSKRemoteStorage = require('OLSKRemoteStorage');

describe('KVCNoteStorageCollectionName', function test_KVCNoteStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mod.KVCNoteStorageCollectionName(), 'kvc_notes');
	});

});

describe('KVCNoteStorageCollectionPath', function test_KVCNoteStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mod.KVCNoteStorageCollectionPath(), mod.KVCNoteStorageCollectionName() + '/');
	});

});

describe('KVCNoteStorageFolderPath', function test_KVCNoteStorageFolderPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.KVCNoteStorageFolderPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubNoteObjectValid();
		deepEqual(mod.KVCNoteStorageFolderPath(item), mod.KVCNoteStorageCollectionPath() + item.KVCNoteCreationDate.toJSON().split('T').shift() + '/' + item.KVCNoteID + '/');
	});

});

describe('KVCNoteStorageObjectPath', function test_KVCNoteStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.KVCNoteStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mod.KVCNoteStorageObjectPath(StubNoteObjectValid()), mod.KVCNoteStorageFolderPath(StubNoteObjectValid()) + 'main');
	});

});

describe('KVCNoteStorageObjectPathV1', function test_KVCNoteStorageObjectPathV1() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.KVCNoteStorageObjectPathV1({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubNoteObjectValid();
		deepEqual(mod.KVCNoteStorageObjectPathV1(item), mod.KVCNoteStorageCollectionPath() + item.KVCNoteID);
	});

});

describe('KVCNoteStorageMatchV1', function test_KVCNoteStorageMatchV1() {

	it('throws error if not string', function() {
		throws(function() {
			mod.KVCNoteStorageMatchV1(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if no KVCNoteStorageCollectionPath', function() {
		const item = mod.KVCNoteStorageCollectionPath();
		deepEqual(mod.KVCNoteStorageMatchV1(mod.KVCNoteStorageObjectPathV1(StubNoteObjectValid()).replace(item, item.slice(0, -2) + '/')), false);
	});

	it('returns false if no KVCNoteStorageObjectPathV1', function() {
		deepEqual(mod.KVCNoteStorageMatchV1(mod.KVCNoteStorageObjectPathV1(StubNoteObjectValid()) + '/'), false);
	});

	it('returns true', function() {
		deepEqual(mod.KVCNoteStorageMatchV1(mod.KVCNoteStorageObjectPathV1(StubNoteObjectValid())), true);
	});

});

describe('KVCNoteStorageMatch', function test_KVCNoteStorageMatch() {

	it('throws error if not string', function() {
		throws(function() {
			mod.KVCNoteStorageMatch(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if no KVCNoteStorageCollectionPath', function() {
		const item = mod.KVCNoteStorageCollectionPath();
		deepEqual(mod.KVCNoteStorageMatch(mod.KVCNoteStorageObjectPath(StubNoteObjectValid()).replace(item, item.slice(0, -2) + '/')), false);
	});

	it('returns false if no KVCNoteStorageObjectPath', function() {
		deepEqual(mod.KVCNoteStorageMatch(mod.KVCNoteStorageObjectPath(StubNoteObjectValid()).slice(0, -1)), false);
	});

	it('returns true', function() {
		deepEqual(mod.KVCNoteStorageMatch(mod.KVCNoteStorageObjectPath(StubNoteObjectValid())), true);
	});

	it('returns false if old path', function () {
		deepEqual(mod.KVCNoteStorageMatch('kvc_notes/01EC08S8BG8WJVM4ZYMGC7EK9W/main'), false);
	});

});

describe('KVCNoteStorageWrite', function test_KVCNoteStorageWrite() {

	it('rejects if not object', async function() {
		await rejects(mod.KVCNoteStorageWrite(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mod.KVCNoteStorageWrite(KVCTestingStorageClient, Object.assign(StubNoteObjectValid(), {
			KVCNoteID: null,
		}))).KVCErrors, {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns input', async function () {
		const item = StubNoteObjectValid();

		deepEqual(await mod.KVCNoteStorageWrite(KVCTestingStorageClient, item) === item, true);
	});

	it('leaves input unmodified', async function () {
		deepEqual(await mod.KVCNoteStorageWrite(KVCTestingStorageClient, StubNoteObjectValid()), StubNoteObjectValid());
	});

	context('relations', function () {

		const item = Object.assign(StubNoteObjectValid(), {
			$alfa: 'bravo',
		});
		let outputData, storage;

		before(async function () {
			outputData = await mod.KVCNoteStorageWrite(KVCTestingStorageClient, item);
		});
		
		before(async function () {
			storage = Object.values(await mod.KVCNoteStorageList(KVCTestingStorageClient));
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
		deepEqual(await mod.KVCNoteStorageList(KVCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mod.KVCNoteStorageWrite(KVCTestingStorageClient, StubNoteObjectValid());
		deepEqual(Object.values(await mod.KVCNoteStorageList(KVCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mod.KVCNoteStorageList(KVCTestingStorageClient)), [item.KVCNoteID]);
	});

});

describe('KVCNoteStorageDelete', function test_KVCNoteStorageDelete() {

	it('rejects if not valid', async function() {
		await rejects(mod.KVCNoteStorageDelete(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mod.KVCNoteStorageDelete(KVCTestingStorageClient, await mod.KVCNoteStorageWrite(KVCTestingStorageClient, StubNoteObjectValid())), {
			statusCode: 200,
		});
	});

	it('deletes KVCNote', async function() {
		await mod.KVCNoteStorageDelete(KVCTestingStorageClient, await mod.KVCNoteStorageWrite(KVCTestingStorageClient, StubNoteObjectValid()));
		deepEqual(await mod.KVCNoteStorageList(KVCTestingStorageClient), {});
	});

	it('deletes file from public folder', async function() {
		const item = await mod.KVCNoteStorageWrite(KVCTestingStorageClient, Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		}));

		await mod.KVCNoteStoragePublicWrite(KVCTestingStorageClient, mod.KVCNoteStoragePublicObjectPath(item), item.KVCNoteBody);

		await mod.KVCNoteStorageDelete(KVCTestingStorageClient, await mod.KVCNoteStorageWrite(KVCTestingStorageClient, item));

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(mod.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

});

describe('KVCNoteStorageMigrateV1', function test_KVCNoteStorageMigrateV1() {

	it('rejects if not function', async function() {
		await rejects(mod.KVCNoteStorageDelete(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('resolves array', async function() {
		deepEqual(await mod.KVCNoteStorageMigrateV1(KVCTestingStorageClient, function () {}), []);
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
			return OLSKRemoteStorage.OLSKRemoteStorageWriteObject(KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePrivateClient(), mod.KVCNoteStorageObjectPathV1(item), item);
		});

		beforeEach(async function () {
			deepEqual(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePrivateClient().getObject(mod.KVCNoteStorageObjectPathV1(item))), item);
		});

		beforeEach(async function () {
			await mod.KVCNoteStorageMigrateV1(KVCTestingStorageClient, function (inputData) {
				outputData.push(inputData);
			});
		});

		it('creates destination object', async function () {
			deepEqual(Object.values(await mod.KVCNoteStorageList(KVCTestingStorageClient)), [item]);
		});

		it('deletes source object', async function () {
			deepEqual(await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePrivateClient().getObject(mod.KVCNoteStorageObjectPathV1(item)), null);
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
			mod.KVCNoteStoragePublicObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if no KVCNotePublicID', function() {
		throws(function() {
			mod.KVCNoteStoragePublicObjectPath(StubNoteObjectValid());
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		});

		deepEqual(mod.KVCNoteStoragePublicObjectPath(item), item.KVCNotePublicID);
	});

});

describe('KVCNoteStoragePublicRootPagePath', function test_KVCNoteStoragePublicRootPagePath() {

	it('returns string', function() {
		deepEqual(mod.KVCNoteStoragePublicRootPagePath(), 'index.html');
	});

});

describe('KVCNoteStoragePublicWrite', function test_KVCNoteStoragePublicWrite() {

	it('rejects if not object path', async function() {
		await rejects(mod.KVCNoteStoragePublicWrite(KVCTestingStorageClient, '', 'bravo'), /KVCErrorInputNotValid/);
	});

	it('rejects if not string', async function() {
		await rejects(mod.KVCNoteStoragePublicWrite(KVCTestingStorageClient, 'alfa', null), /KVCErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(await mod.KVCNoteStoragePublicWrite(KVCTestingStorageClient, 'alfa', 'bravo'), undefined);
	});

	it('writes file to public folder', async function() {
		await mod.KVCNoteStoragePublicWrite(KVCTestingStorageClient, 'alfa', 'bravo');

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile('alfa')).data, 'bravo');
	});

});

describe('KVCNoteStoragePublicDelete', function test_KVCNoteStoragePublicDelete() {

	it('rejects if not object path', async function() {
		await rejects(mod.KVCNoteStoragePublicDelete(KVCTestingStorageClient, ''), /KVCErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(await mod.KVCNoteStoragePublicDelete(KVCTestingStorageClient, 'alfa'), {
			statusCode: 200,
		});
	});

	it('deletes file from public folder', async function() {
		const item = Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		});
		await mod.KVCNoteStoragePublicWrite(KVCTestingStorageClient, mod.KVCNoteStoragePublicObjectPath(item), item.KVCNoteBody);

		await mod.KVCNoteStoragePublicDelete(KVCTestingStorageClient, mod.KVCNoteStoragePublicObjectPath(item));

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(mod.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

});

describe('KVCNoteStoragePublicURL', function test_KVCNoteStoragePublicURL() {

	const item = Object.assign(StubNoteObjectValid(), {
		KVCNotePublicID: 'charlie',
	});

	it('throws if not object path', function() {
		throws(function() {
			mod.KVCNoteStoragePublicURL(KVCTestingStorageClient, '');
		}, /KVCErrorInputNotValid/);
	});

	it('returns undefined', function() {
		deepEqual(mod.KVCNoteStoragePublicURL(KVCTestingStorageClient, mod.KVCNoteStoragePublicObjectPath(item)), undefined);
	});

	it.skip('returns url if connected', async function() {
		await mod.KVCNoteStoragePublicWrite(KVCTestingStorageClient, item, mod.KVCNoteStoragePublicObjectPath(item));

		deepEqual(mod.KVCNoteStoragePublicURL(KVCTestingStorageClient, mod.KVCNoteStoragePublicObjectPath(item)), mod.KVCNoteStoragePublicObjectPath(item));
	});

});
