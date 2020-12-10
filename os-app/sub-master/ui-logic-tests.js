const { throws, deepEqual } = require('assert');

const mod = require('./ui-logic.js');

describe('KVCWriteMasterTruncatedTitle', function test_KVCWriteMasterTruncatedTitle() {

	it('throws error if not string', function() {
		throws(function() {
			mod.KVCWriteMasterTruncatedTitle(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns input', function() {
		deepEqual(mod.KVCWriteMasterTruncatedTitle('alfa'), 'alfa');
	});

	it('includes if under 60 characters', function() {
		deepEqual(mod.KVCWriteMasterTruncatedTitle('alfa bravo charlie delta echo foxtrot golf hotel juliet kilo'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilo');
	});

	it('truncates text', function() {
		deepEqual(mod.KVCWriteMasterTruncatedTitle('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
	});

	it('adds ellipsis if second parameter truthy', function() {
		deepEqual(mod.KVCWriteMasterTruncatedTitle('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos', true), 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
	});

});
