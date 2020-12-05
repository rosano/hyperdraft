const { throws, rejects, deepEqual } = require('assert');

const mod = require('./main.js').default;

describe('KVC_DataModuleName', function test_KVC_DataModuleName() {

	it('returns string', function () {
		deepEqual(mod.KVC_DataModuleName(), 'wikiavec');
	});

});
