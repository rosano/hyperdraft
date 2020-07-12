const { throws, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

describe('KVCVersionStorageCollectionName', function test_KVCVersionStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mainModule.KVCVersionStorageCollectionName(), 'kvc_versions');
	});

});

describe('KVCVersionStorageCollectionType', function test_KVCVersionStorageCollectionType() {

	it('returns string', function() {
		deepEqual(mainModule.KVCVersionStorageCollectionType(), 'kvc_version');
	});

});

describe('KVCVersionStorageCollectionPath', function test_KVCVersionStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCVersionStorageCollectionPath(), mainModule.KVCVersionStorageCollectionName() + '/');
	});

});

describe('KVCVersionStorageObjectPath', function test_KVCVersionStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCVersionStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubVersionObjectValid();
		deepEqual(mainModule.KVCVersionStorageObjectPath(item), mainModule.KVCVersionStorageCollectionPath() + item.KVCVersionID);
	});

});
