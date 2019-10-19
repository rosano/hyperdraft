import { throws, deepEqual } from 'assert';

import * as mainModule from './storage.js';

describe('WKCNoteStoragePath', function testWKCNoteStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.WKCNoteStoragePath('alfa'), 'wkc_documents/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.WKCNoteStoragePath(''), 'wkc_documents/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.WKCNoteStoragePath(), 'wkc_documents/');
	});

});
