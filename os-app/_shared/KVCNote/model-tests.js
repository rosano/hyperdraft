const { throws, deepEqual } = require('assert');

const mod = require('./model.js').default;

describe('KVCNoteModelErrorsFor', function test_KVCNoteModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mod.KVCNoteModelErrorsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if KVCNoteID not string', function() {
		deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
			KVCNoteID: null,
		})), {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCNoteID not filled', function() {
		deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
			KVCNoteID: ' ',
		})), {
			KVCNoteID: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCNoteBody not string', function() {
		deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
			KVCNoteBody: null,
		})), {
			KVCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCNoteCreationDate not date', function() {
		deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
			KVCNoteCreationDate: new Date('alfa'),
		})), {
			KVCNoteCreationDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns object if KVCNoteModificationDate not date', function() {
		deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
			KVCNoteModificationDate: new Date('alfa'),
		})), {
			KVCNoteModificationDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mod.KVCNoteModelErrorsFor(StubNoteObjectValid()), null);
	});

	context('KVCNoteIsArchived', function() {

		it('returns object if boolean', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNoteIsArchived: 'true',
			})), {
				KVCNoteIsArchived: [
					'KVCErrorNotBoolean',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNoteIsArchived: true,
			})), null);
		});

	});

	context('KVCNoteIsPublic', function() {

		it('returns object if boolean', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNoteIsPublic: 'true',
			})), {
				KVCNoteIsPublic: [
					'KVCErrorNotBoolean',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNoteIsPublic: true,
			})), null);
		});

	});

	context('KVCNotePublishDate', function() {

		it('returns object if date', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNotePublishDate: new Date('alfa'),
			})), {
				KVCNotePublishDate: [
					'KVCErrorNotDate',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNotePublishDate: new Date(),
			})), null);
		});

	});

	context('KVCNotePublicID', function() {

		it('returns object if string', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNotePublicID: null,
			})), {
				KVCNotePublicID: [
					'KVCErrorNotString',
				],
			});
		});

		it('returns object if filled', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNotePublicID: ' ',
			})), {
				KVCNotePublicID: [
					'KVCErrorNotFilled',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mod.KVCNoteModelErrorsFor(Object.assign(StubNoteObjectValid(), {
				KVCNotePublicID: 'alfa',
			})), null);
		});

	});

});

describe('KVCNoteModelIsPublic', function test_KVCNoteModelIsPublic() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.KVCNoteModelIsPublic({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if KVCNoteIsPublic not true', function() {
		deepEqual(mod.KVCNoteModelIsPublic(Object.assign(StubNoteObjectValid(), {
			KVCNoteIsPublic: false,
			KVCNotePublishDate: new Date(),
			KVCNotePublicID: 'alfa',
		})), false);
	});

	it('returns false if no KVCNotePublishDate', function() {
		deepEqual(mod.KVCNoteModelIsPublic(Object.assign(StubNoteObjectValid(), {
			KVCNoteIsPublic: true,
			KVCNotePublicID: 'alfa',
		})), false);
	});

	it('returns false if no KVCNotePublicID', function() {
		deepEqual(mod.KVCNoteModelIsPublic(Object.assign(StubNoteObjectValid(), {
			KVCNoteIsPublic: true,
			KVCNotePublishDate: new Date(),
		})), false);
	});

	it('returns true', function() {
		deepEqual(mod.KVCNoteModelIsPublic(Object.assign(StubNoteObjectValid(), {
			KVCNoteIsPublic: true,
			KVCNotePublishDate: new Date(),
			KVCNotePublicID: 'true',
		})), true);
	});

});
