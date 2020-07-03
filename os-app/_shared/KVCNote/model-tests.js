const { throws, deepEqual } = require('assert');

const mainModule = require('./model.js').default;

const kTesting = {
	StubNoteObjectValid() {
		return {
			KVCNoteID: 'alfa',
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('KVCNoteModelErrorsFor', function test_KVCNoteModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.KVCNoteModelErrorsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if KVCNoteID not string', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteID: null,
		})), {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCNoteID not filled', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteID: ' ',
		})), {
			KVCNoteID: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCNoteBody not string', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteBody: null,
		})), {
			KVCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCNoteCreationDate not date', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteCreationDate: new Date('alfa'),
		})), {
			KVCNoteCreationDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns object if KVCNoteModificationDate not date', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNoteModificationDate: new Date('alfa'),
		})), {
			KVCNoteModificationDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.KVCNoteModelErrorsFor(kTesting.StubNoteObjectValid()), null);
	});

	context('KVCNoteIsPublic', function() {

		it('returns object if KVCNoteIsPublic not boolean', function() {
			deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				KVCNoteIsPublic: 'true',
			})), {
				KVCNoteIsPublic: [
					'KVCErrorNotBoolean',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				KVCNoteIsPublic: true,
			})), null);
		});

	});

	context('KVCNotePublishDate', function() {

		it('returns object if KVCNotePublishDate not date', function() {
			deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				KVCNotePublishDate: new Date('alfa'),
			})), {
				KVCNotePublishDate: [
					'KVCErrorNotDate',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				KVCNotePublishDate: new Date(),
			})), null);
		});

	});

	context('KVCNotePublicID', function() {

		it('returns object if KVCNotePublicID not string', function() {
			deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				KVCNotePublicID: null,
			})), {
				KVCNotePublicID: [
					'KVCErrorNotString',
				],
			});
		});

		it('returns object if KVCNotePublicID not filled', function() {
			deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				KVCNotePublicID: ' ',
			})), {
				KVCNotePublicID: [
					'KVCErrorNotFilled',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mainModule.KVCNoteModelErrorsFor(Object.assign(kTesting.StubNoteObjectValid(), {
				KVCNotePublicID: 'alfa',
			})), null);
		});

	});

});
