const { throws, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

describe('KVCSettingStorageCollectionName', function test_KVCSettingStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mainModule.KVCSettingStorageCollectionName(), 'kvc_settings');
	});

});

describe('KVCSettingStorageCollectionType', function test_KVCSettingStorageCollectionType() {

	it('returns string', function() {
		deepEqual(mainModule.KVCSettingStorageCollectionType(), 'kvc_setting');
	});

});

describe('KVCSettingStorageCollectionPath', function test_KVCSettingStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCSettingStorageCollectionPath(), mainModule.KVCSettingStorageCollectionName() + '/');
	});

});

describe('KVCSettingStorageObjectPath', function test_KVCSettingStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCSettingStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = StubSettingObjectValid();
		deepEqual(mainModule.KVCSettingStorageObjectPath(item), mainModule.KVCSettingStorageCollectionPath() + item.KVCSettingKey);
	});

});
