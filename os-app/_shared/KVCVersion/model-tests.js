const { throws, deepEqual } = require('assert');

const mod = require('./model.js').default;

const kTesting = {
	StubVersionObjectValid() {
		return {
			KVCVersionID: 'alfa',
			KVCVersionNoteID: 'bravo',
			KVCVersionBody: '',
			KVCVersionDate: new Date(),
		};
	},
};

describe('KVCVersionModelErrorsFor', function test_KVCVersionModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mod.KVCVersionModelErrorsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if KVCVersionID not string', function() {
		deepEqual(mod.KVCVersionModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			KVCVersionID: null,
		})), {
			KVCVersionID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCVersionID not filled', function() {
		deepEqual(mod.KVCVersionModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			KVCVersionID: ' ',
		})), {
			KVCVersionID: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCVersionNoteID not string', function() {
		deepEqual(mod.KVCVersionModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			KVCVersionNoteID: null,
		})), {
			KVCVersionNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCVersionNoteID not filled', function() {
		deepEqual(mod.KVCVersionModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			KVCVersionNoteID: ' ',
		})), {
			KVCVersionNoteID: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCVersionBody not string', function() {
		deepEqual(mod.KVCVersionModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			KVCVersionBody: null,
		})), {
			KVCVersionBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCVersionDate not date', function() {
		deepEqual(mod.KVCVersionModelErrorsFor(Object.assign(kTesting.StubVersionObjectValid(), {
			KVCVersionDate: new Date('alfa'),
		})), {
			KVCVersionDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mod.KVCVersionModelErrorsFor(kTesting.StubVersionObjectValid()), null);
	});

});
