const { throws, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

describe('KVCNoteStorageCollectionPath', function test_KVCNoteStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageCollectionPath(), 'kvc_notes/');
	});

});

describe('KVCNoteStorageFolderPath', function test_KVCNoteStorageFolderPath() {

	it('throws error if blank', function() {
		throws(function() {
			mainModule.KVCNoteStorageFolderPath('');
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageFolderPath('alfa'), mainModule.KVCNoteStorageCollectionPath() + 'alfa/');
	});

});

describe('KVCNoteStorageObjectPath', function test_KVCNoteStorageObjectPath() {

	it('throws error if blank', function() {
		throws(function() {
			mainModule.KVCNoteStorageObjectPath('');
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageObjectPath('alfa'), mainModule.KVCNoteStorageFolderPath('alfa') + 'main');
	});

});

describe('KVCNoteStorageMatch', function test_KVCNoteStorageMatch() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCNoteStorageMatch(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if no KVCNoteStorageCollectionPath', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath('alfa').replace(mainModule.KVCNoteStorageCollectionPath(), mainModule.KVCNoteStorageCollectionPath().slice(1))), false);
	});

	it('returns false if no KVCNoteStorageObjectPath', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath('alfa').slice(0, -1)), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath('alfa')), true);
	});

});
