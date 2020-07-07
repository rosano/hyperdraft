const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js');

describe('KVCWriteLogicListSort', function test_KVCWriteLogicListSort() {

	it('sorts by KVCNoteModificationDate descending', function() {
		var item1 = {
			KVCNoteModificationDate: new Date(0),
		};
		var item2 = {
			KVCNoteModificationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.KVCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by KVCNoteCreationDate descending if no KVCNoteModificationDate', function() {
		var item1 = {
			KVCNoteCreationDate: new Date(0),
		};
		var item2 = {
			KVCNoteCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.KVCWriteLogicListSort), [item2, item1]);
	});

});

describe('KVCWriteFilterFunction', function test_KVCWriteFilterFunction() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCWriteFilterFunction(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns function', function() {
		deepEqual(typeof mainModule.KVCWriteFilterFunction('alfa'), 'function');
	});

	context('function', function () {

		it('returns false if no match', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('bravo')({
				KVCNoteBody: 'alfa',
			}), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('alfa')({
				KVCNoteBody: 'alfa',
			}), true);
		});

		it('matches partial', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('alf')({
				KVCNoteBody: 'alfa',
			}), true);
		});

		it('matches case insensitive', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('ALF')({
				KVCNoteBody: 'alfa',
			}), true);
		});

		it('matches diacritic insensitive', function() {
			deepEqual(mainModule.KVCWriteFilterFunction('alfa')({
				KVCNoteBody: 'alfá',
			}), true);
		});

	});

});

describe('KVCWriteHumanTimestampString', function test_KVCWriteHumanTimestampString() {

	it('throws error if not date', function() {
		throws(function() {
			mainModule.KVCWriteHumanTimestampString(new Date('alfa'));
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mainModule.KVCWriteHumanTimestampString(item), `${ item.toJSON().slice(0, 16) }`);
	});

});

describe('KVCWriteLauncherItemJournalTemplate', function test_KVCWriteLauncherItemJournalTemplate() {

	it('throws error if param1 not date', function() {
		throws(function() {
			mainModule.KVCWriteHumanTimestampString(new Date('alfa'), function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not function', function() {
		throws(function() {
			mainModule.KVCWriteLauncherItemJournalTemplate(new Date(), null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mainModule.KVCWriteLauncherItemJournalTemplate(item, function (inputData) {
			return 'Alfa-' + inputData;
		}), ('alfa-' + 'KVCWriteLauncherItemJournalText').toLowerCase() + '-' + mainModule.KVCWriteHumanTimestampString(item) + '\n\n- ');
	});

});

describe('KVCWriteHostname', function test_KVCWriteHostname() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCWriteHostname(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns null if no text', function() {
		deepEqual(mainModule.KVCWriteHostname(''), null);
	});

	it('returns null if no host', function() {
		deepEqual(mainModule.KVCWriteHostname('https:///'), null);
	});

	it('returns string if URL with host', function() {
		deepEqual(mainModule.KVCWriteHostname('http://example.com'), 'example.com');
	});

	it('returns string if URL with path', function() {
		deepEqual(mainModule.KVCWriteHostname('http://example.com/alfa/bravo'), 'example.com');
	});

	it('returns string if URL with https', function() {
		deepEqual(mainModule.KVCWriteHostname('https://example.com/alfa/bravo'), 'example.com');
	});

	it('returns string if host', function() {
		deepEqual(mainModule.KVCWriteHostname('example.com'), 'example.com');
	});

});
