const { throws, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

describe('KVCSettingStoragePath', function testKVCSettingStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCSettingStoragePath('alfa'), 'kvc_settings/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.KVCSettingStoragePath(''), 'kvc_settings/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.KVCSettingStoragePath(), 'kvc_settings/');
	});

});
