const { throws, deepEqual } = require('assert');

const mainModule = require('./storage.js');

describe('WKCSettingStoragePath', function testWKCSettingStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.WKCSettingStoragePath('alfa'), 'wkc_settings/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.WKCSettingStoragePath(''), 'wkc_settings/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.WKCSettingStoragePath(), 'wkc_settings/');
	});

});
