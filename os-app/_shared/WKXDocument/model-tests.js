import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubDocumentObjectValid: function() {
		return {
			WKXDocumentID: 'alfa',
			WKXDocumentBody: '',
			WKXDocumentCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKXDocumentModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKXDocumentModelErrorsFor', function testWKXDocumentModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.WKXDocumentModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKXDocumentID not string', function() {
		deepEqual(mainModule.WKXDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXDocumentID: null,
		})), {
			WKXDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKXDocumentID not filled', function() {
		deepEqual(mainModule.WKXDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXDocumentID: ' ',
		})), {
			WKXDocumentID: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKXDocumentBody not string', function() {
		deepEqual(mainModule.WKXDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXDocumentBody: null,
		})), {
			WKXDocumentBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKXDocumentCreationDate not date', function() {
		deepEqual(mainModule.WKXDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXDocumentCreationDate: new Date('alfa'),
		})), {
			WKXDocumentCreationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns object if WKXDocumentModificationDate not date', function() {
		deepEqual(mainModule.WKXDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXDocumentModificationDate: new Date('alfa'),
		})), {
			WKXDocumentModificationDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKXDocumentModelErrorsFor(kTesting.StubDocumentObjectValid()), null);
	});

	context('WKXDocumentPublishStatusIsPublished', function() {

		it('returns object if WKXDocumentPublishStatusIsPublished not boolean', function() {
			deepEqual(mainModule.WKXDocumentModelErrorsFor(Object.assign(kTesting.StubDocumentObjectValid(), {
				WKXDocumentPublishStatusIsPublished: 'true',
			})), {
				WKXDocumentPublishStatusIsPublished: [
					'WKCErrorNotBoolean',
				],
			});
		});

	});

});

describe('WKXDocumentModelPreJSONSchemaValidate', function testWKXDocumentModelPreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mainModule.WKXDocumentModelPreJSONSchemaValidate({}), {});
	});

	it('returns input with WKXDocumentCreationDate as string', function() {
		deepEqual(mainModule.WKXDocumentModelPreJSONSchemaValidate({
			WKXDocumentCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKXDocumentCreationDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with WKXDocumentModificationDate as string', function() {
		deepEqual(mainModule.WKXDocumentModelPreJSONSchemaValidate({
			WKXDocumentModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			WKXDocumentModificationDate: '2018-12-09T19:07:01.902Z',
		});
	});

});

describe('WKXDocumentModelPostJSONParse', function testWKXDocumentModelPostJSONParse() {

	it('returns input null', function() {
		deepEqual(mainModule.WKXDocumentModelPostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mainModule.WKXDocumentModelPostJSONParse({}), {});
	});

	it('returns input with WKXDocumentCreationDate as date', function() {
		deepEqual(mainModule.WKXDocumentModelPostJSONParse({
			WKXDocumentCreationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKXDocumentCreationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with WKXDocumentModificationDate as date', function() {
		deepEqual(mainModule.WKXDocumentModelPostJSONParse({
			WKXDocumentModificationDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKXDocumentModificationDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});
