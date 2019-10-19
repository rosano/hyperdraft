import { throws, deepEqual } from 'assert';

import * as mainModule from './storage.js';

describe('WKXSettingStoragePath', function testWKXSettingStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.WKXSettingStoragePath('alfa'), 'wkc_settings/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.WKXSettingStoragePath(''), 'wkc_settings/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.WKXSettingStoragePath(), 'wkc_settings/');
	});

});
