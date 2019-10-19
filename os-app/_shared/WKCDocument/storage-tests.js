import { throws, deepEqual } from 'assert';

import * as mainModule from './storage.js';

describe('WKCDocumentStoragePath', function testWKCDocumentStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.WKCDocumentStoragePath('alfa'), 'wkc_documents/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.WKCDocumentStoragePath(''), 'wkc_documents/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.WKCDocumentStoragePath(), 'wkc_documents/');
	});

});
