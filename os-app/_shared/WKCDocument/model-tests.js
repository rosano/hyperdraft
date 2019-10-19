import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubDocumentObjectValid: function() {
		return {
			WKCDocumentID: 'alfa',
			WKCDocumentBody: '',
			WKCDocumentCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKCDocumentModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKCDocumentModelErrorsFor', function testWKCDocumentModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.WKCDocumentModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKCDocumentID not string', function() {
		deepEqual(mainModule.WKCDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCDocumentID: null,
		})), {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCDocumentID not filled', function() {
		deepEqual(mainModule.WKCDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCDocumentID: ' ',
		})), {
			WKCDocumentID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCDocumentBody not string', function() {
		deepEqual(mainModule.WKCDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCDocumentBody: null,
		})), {
			WKCDocumentBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCDocumentCreationDate not date', function() {
		deepEqual(mainModule.WKCDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCDocumentCreationDate: new Date('alfa'),
		})), {
			WKCDocumentCreationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns object if WKCDocumentModificationDate not date', function() {
		deepEqual(mainModule.WKCDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCDocumentModificationDate: new Date('alfa'),
		})), {
			WKCDocumentModificationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKCDocumentModelErrorsFor(kTesting.StubDocumentObjectValid()), null);
	});

	context('WKCDocumentPublishStatusIsPublished', function() {

		it('returns object if WKCDocumentPublishStatusIsPublished not boolean', function() {
			deepEqual(mainModule.WKCDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
				WKCDocumentPublishStatusIsPublished: 'true',
			})), {
				WKCDocumentPublishStatusIsPublished: [
					'WKCErrorNotBoolean',
				],
			});
		});

	});

});

describe('WKCDocumentModelPreJSONSchemaValidate', function testWKCDocumentModelPreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mainModule.WKCDocumentModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKCDocumentCreationDate as string', function() {
		deepEqual(mainModule.WKCDocumentModelPreJSONSchemaValidate({
			WKCDocumentCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCDocumentCreationDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with WKCDocumentModificationDate as string', function() {
		deepEqual(mainModule.WKCDocumentModelPreJSONSchemaValidate({
			WKCDocumentModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKCDocumentModificationDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKCDocumentModelPostJSONParse', function testWKCDocumentModelPostJSONParse() {

	it('returns input null', function() {
		deepEqual(mainModule.WKCDocumentModelPostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mainModule.WKCDocumentModelPostJSONParse({}), {});
	});

	it('returns input with WKCDocumentCreationDate as date', function() {
		deepEqual(mainModule.WKCDocumentModelPostJSONParse({
			WKCDocumentCreationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCDocumentCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with WKCDocumentModificationDate as date', function() {
		deepEqual(mainModule.WKCDocumentModelPostJSONParse({
			WKCDocumentModificationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCDocumentModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
