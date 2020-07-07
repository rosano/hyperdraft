const { throws, rejects, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

describe('KVCNoteStorageCollectionType', function test_KVCNoteStorageCollectionType() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageCollectionType(), 'kvc_note');
	});

});

describe('KVCNoteStorageCollectionPath', function test_KVCNoteStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageCollectionPath(), 'kvc_notes/');
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

describe('KVCNoteStoragePublicObjectPath', function test_KVCNoteStoragePublicObjectPath() {

	it('throws if not valid', async function() {
		throws(function() {
			mainModule.KVCNoteStoragePublicObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if no KVCNotePublicID', async function() {
		throws(function() {
			mainModule.KVCNoteStoragePublicObjectPath(StubNoteObjectValid());
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', async function() {
		const item = Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		});

		deepEqual(mainModule.KVCNoteStoragePublicObjectPath(item), '/' + item.KVCNotePublicID);
	});

});

describe('KVCNoteStoragePublicRootPagePath', function test_KVCNoteStoragePublicRootPagePath() {

	it('returns string', async function() {
		deepEqual(mainModule.KVCNoteStoragePublicRootPagePath(), '/index.html');
	});

});

describe('KVCNoteStoragePublicWrite', function test_KVCNoteStoragePublicWrite() {

	it('rejects if not object path', async function() {
		await rejects(mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, '/', 'bravo'), /KVCErrorInputNotValid/);
	});

	it('rejects if not string', async function() {
		await rejects(mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, '/alfa', null), /KVCErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, '/alfa', 'bravo'), undefined);
	});

	it('writes file to public folder', async function() {
		await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, '/alfa', 'bravo');

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePublicClient().getFile('/alfa')).data, 'bravo');
	});

});

describe('KVCNoteStoragePublicDelete', function test_KVCNoteStoragePublicDelete() {

	it('rejects if not object path', async function() {
		await rejects(mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, '/'), /KVCErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(await mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, '/alfa'), {
			statusCode: 200,
		});
	});

	it('deletes file from public folder', async function() {
		const item = Object.assign(StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		});
		await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item), item.KVCNoteBody);

		await mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item));

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePublicClient().getFile(mainModule.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

});

describe('KVCNoteStoragePublicURL', function test_KVCNoteStoragePublicURL() {

	const item = Object.assign(StubNoteObjectValid(), {
		KVCNotePublicID: 'charlie',
	});

	it('throws if not object path', async function() {
		throws(function() {
			mainModule.KVCNoteStoragePublicURL(KVCTestingStorageClient, '/');
		}, /KVCErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(await mainModule.KVCNoteStoragePublicURL(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item)), undefined);
	});

	it.skip('returns url if connected', async function() {
		await mainModule.KVCNoteStoragePublicWrite(KVCTestingStorageClient, item, mainModule.KVCNoteStoragePublicObjectPath(item));

		deepEqual(await mainModule.KVCNoteStoragePublicURL(KVCTestingStorageClient, mainModule.KVCNoteStoragePublicObjectPath(item)), mainModule.KVCNoteStoragePublicObjectPath(item));
	});

});
