const { throws, deepEqual } = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubNoteObjectValid() {
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
			mainModule.KVCVersionModelErrorsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if KVCVersionID not string', function() {
		deepEqual(mainModule.KVCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCVersionID: null,
		})), {
			KVCVersionID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCVersionID not filled', function() {
		deepEqual(mainModule.KVCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCVersionID: ' ',
		})), {
			KVCVersionID: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCVersionNoteID not string', function() {
		deepEqual(mainModule.KVCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCVersionNoteID: null,
		})), {
			KVCVersionNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCVersionNoteID not filled', function() {
		deepEqual(mainModule.KVCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCVersionNoteID: ' ',
		})), {
			KVCVersionNoteID: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCVersionBody not string', function() {
		deepEqual(mainModule.KVCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCVersionBody: null,
		})), {
			KVCVersionBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCVersionDate not date', function() {
		deepEqual(mainModule.KVCVersionModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCVersionDate: new Date('alfa'),
		})), {
			KVCVersionDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.KVCVersionModelErrorsFor(kTesting.StubNoteObjectValid()), null);
	});

});
