const { throws, deepEqual } = require('assert');

const mainModule = require('./storage.js');

describe('KVCVersionStoragePath', function testKVCVersionStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCVersionStoragePath('alfa'), 'kvc_versions/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.KVCVersionStoragePath(''), 'kvc_versions/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.KVCVersionStoragePath(), 'kvc_versions/');
	});

});
