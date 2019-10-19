import { throws, deepEqual } from 'assert';

import * as mainModule from './storage.js';

describe('WKXVersionStoragePath', function testWKXVersionStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.WKXVersionStoragePath('alfa'), 'wkc_versions/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.WKXVersionStoragePath(''), 'wkc_versions/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.WKXVersionStoragePath(), 'wkc_versions/');
	});

});
