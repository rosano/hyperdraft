const { throws, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

const kTesting = {
	StubNoteObjectValid() {
		return {
			KVCNoteID: 'alfa',
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

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
		const item = kTesting.StubNoteObjectValid();
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
		deepEqual(mainModule.KVCNoteStorageObjectPath(kTesting.StubNoteObjectValid()), mainModule.KVCNoteStorageFolderPath(kTesting.StubNoteObjectValid()) + 'main');
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
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(kTesting.StubNoteObjectValid()).replace(item, item.slice(0, -2) + '/')), false);
	});

	it('returns false if no KVCNoteStorageObjectPath', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(kTesting.StubNoteObjectValid()).slice(0, -1)), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(kTesting.StubNoteObjectValid())), true);
	});

});
