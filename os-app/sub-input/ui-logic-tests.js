const { throws, deepEqual } = require('assert');

const mod = require('./ui-logic.js');

describe('KVCWriteInputLineObjectsFor', function test_KVCWriteInputLineObjectsFor() {

	it('throws error if not array', function() {
		throws(function() {
			mod.KVCWriteInputLineObjectsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mod.KVCWriteInputLineObjectsFor([]), []);
	});

	it('converts non-link single', function() {
		deepEqual(mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('alfa')), [{
			start: 0,
			end: 4,
			string: 'alfa',
			type: 'variable-2',
		}]);
	});

	it('converts non-link multiple', function() {
		deepEqual(mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('alfa bravo')), [{
			start: 0,
			end: 10,
			string: 'alfa bravo',
			type: 'variable-2',
		}]);
	});

	it('converts link single', function() {
		deepEqual(mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('[[alfa]]')), [{
			start: 0,
			end: 8,
			string: '[[alfa]]',
			type: 'variable-2 link',
		}]);
	});

	it('converts link multiple', function() {
		deepEqual(mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('[[alfa]] [[bravo]]')), [{
			start: 0,
			end: 8,
			string: '[[alfa]]',
			type: 'variable-2 link',
		}, {
			start: 8,
			end: 9,
			string: ' ',
			type: 'variable-2',
		}, {
			start: 9,
			end: 18,
			string: '[[bravo]]',
			type: 'variable-2 link',
		}]);
	});

	it('converts header', function() {
		deepEqual(mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('# alfa')), [{
			start: 0,
			end: 6,
			string: '# alfa',
			type: 'header header-1',
		}]);
	});

	it('converts multiple header objects', function() {
		deepEqual(mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('# alfa [[bravo]]')), [{
			start: 0,
			end: 7,
			string: '# alfa ',
			type: 'header header-1',
		}, {
			start: 7,
			end: 16,
			string: '[[bravo]]',
			type: 'header header-1 link',
		}]);
	});

});

describe('KVCWriteInputHeaderTokensFrom', function test_KVCWriteInputHeaderTokensFrom() {

	it('throws error if not array', function() {
		throws(function() {
			mod.KVCWriteInputHeaderTokensFrom(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mod.KVCWriteInputHeaderTokensFrom([]), []);
	});

	it('excludes if not header', function() {
		deepEqual(mod.KVCWriteInputHeaderTokensFrom([
			mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('alfa')),
			mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('[[bravo]]')),
		]), []);
	});

	it('includes if header', function() {
		deepEqual(mod.KVCWriteInputHeaderTokensFrom([
			mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('# alfa')),
		]), mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('# alfa')).map(function (e) {
			return Object.assign(e, {
				line: 0,
			});
		}));
	});

	it('excludes if not verbal', function() {
		deepEqual(mod.KVCWriteInputHeaderTokensFrom([
			mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('alfa')),
			mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('====')),
		].map(function (e) {
			return e.map(function (e) {
				return Object.assign(e, {
					type: 'header header-1',
				});
			});
		})), [{
			start: 0,
			end: 4,
			string: 'alfa',
			type: 'header header-1',
			line: 0,
		}]);
	});

	it('merges multiple header objects', function() {
		deepEqual(mod.KVCWriteInputHeaderTokensFrom([
			mod.KVCWriteInputLineObjectsFor(mod.uStubLineTokensFor('# PA PARC https://www.supermarchepa.com/pages/weekly-flyer')),
		]), [{
			start: 0,
			end: 58,
			string: '# PA PARC https://www.supermarchepa.com/pages/weekly-flyer',
			type: 'header header-1',
			line: 0,
		}]);
	});

});
