import { throws, deepEqual } from 'assert';

import * as mainModule from './storage.js';

describe('WKXDocumentStoragePath', function testWKXDocumentStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.WKXDocumentStoragePath('alfa'), 'wkc_documents/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.WKXDocumentStoragePath(''), 'wkc_documents/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.WKXDocumentStoragePath(), 'wkc_documents/');
	});

});
