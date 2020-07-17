const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js').default;

describe('KVCWriteLogicListSort', function test_KVCWriteLogicListSort() {

	it('sorts by KVCNoteModificationDate descending', function() {
		const item1 = {
			KVCNoteModificationDate: new Date(0),
		};
		const item2 = {
			KVCNoteModificationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.KVCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by KVCNoteCreationDate descending', function() {
		const item1 = {
			KVCNoteCreationDate: new Date(0),
		};
		const item2 = {
			KVCNoteCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.KVCWriteLogicListSort), [item2, item1]);
	});

	it('sorts KVCNoteIsArchived below others', function() {
		const item1 = {
			KVCNoteCreationDate: new Date(0),
		};
		const item2 = {
			KVCNoteCreationDate: new Date(1),
			KVCNoteIsArchived: true,
		};

		deepEqual([item1, item2].sort(mainModule.KVCWriteLogicListSort), [item1, item2]);
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
		}), ('Alfa-' + 'KVCWriteLauncherItemJournalText').toLowerCase() + '-' + mainModule.KVCWriteHumanTimestampString(item) + '\n\n- ');
	});

});

describe('KVCWriteCustomDomainBaseURLData', function test_KVCWriteCustomDomainBaseURLData() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCWriteCustomDomainBaseURLData(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns null if no text', function() {
		deepEqual(mainModule.KVCWriteCustomDomainBaseURLData(''), null);
	});

	it('returns null if no host', function() {
		deepEqual(mainModule.KVCWriteCustomDomainBaseURLData('https:///'), null);
	});

	it('returns string if host', function() {
		deepEqual(mainModule.KVCWriteCustomDomainBaseURLData('example.com'), 'https://example.com/');
	});

	it('returns string if URL with host', function() {
		deepEqual(mainModule.KVCWriteCustomDomainBaseURLData('http://example.com'), 'http://example.com/');
	});

	it('returns string if URL with path', function() {
		deepEqual(mainModule.KVCWriteCustomDomainBaseURLData('http://example.com/alfa/bravo'), 'http://example.com/');
	});

	it('returns string if URL with https', function() {
		deepEqual(mainModule.KVCWriteCustomDomainBaseURLData('https://example.com/alfa/bravo'), 'https://example.com/');
	});

});

describe('KVCWriteCustomDomainBaseURLFunction', function test_KVCWriteCustomDomainBaseURLFunction() {

	it('throws error if param1 not string', function() {
		throws(function() {
			mainModule.KVCWriteCustomDomainBaseURLFunction(null, '');
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mainModule.KVCWriteCustomDomainBaseURLFunction('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns function', function() {
		deepEqual(typeof mainModule.KVCWriteCustomDomainBaseURLFunction('', ''), 'function');
	});

	context('function', function () {

		it('throws error if url not string', function() {
			throws(function() {
				mainModule.KVCWriteCustomDomainBaseURLFunction('', '')(null, '');
			}, /KVCErrorInputNotValid/);
		});

		it('throws error if domain not string', function() {
			throws(function() {
				mainModule.KVCWriteCustomDomainBaseURLFunction('', '')('', null);
			}, /KVCErrorInputNotValid/);
		});
		
		it('returns string', function() {
			deepEqual(mainModule.KVCWriteCustomDomainBaseURLFunction('', '')('', ''), '');
		});
		
		it('returns replaces common substring between original params with domain in url', function() {
			deepEqual(mainModule.KVCWriteCustomDomainBaseURLFunction('alfa-bravo', '-bravo')('alfa-delta', 'echo'), 'echo-delta');
		});
	
	});

});

describe('KVCWriteBacklinksMap', function test_KVCWriteBacklinksMap() {

	it('throws if not array', function () {
		throws(function () {
			mainModule.KVCWriteBacklinksMap(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(mainModule.KVCWriteBacklinksMap([]), {});
	});

	it('includes if no links', function() {
		deepEqual(mainModule.KVCWriteBacklinksMap([StubNoteObjectValid()]), {
			bravo: [],
		});
	});

	it('includes if broken links', function() {
		deepEqual(mainModule.KVCWriteBacklinksMap([Object.assign(StubNoteObjectValid(), {
			KVCNoteBody: 'alfa\n[[bravo]]'
		})]), {
			alfa: [],
		});
	});

	it('includes if unresolved links', function() {
		const item1 = Object.assign(StubNoteObjectValid(), {
			KVCNoteBody: 'alfa\n[[bravo]]'
		});
		const item2 = Object.assign(StubNoteObjectValid(), {
			KVCNoteBody: 'bravo'
		});
		deepEqual(mainModule.KVCWriteBacklinksMap([item1, item2]), {
			alfa: [],
			bravo: ['alfa'],
		});
	});

	it('includes if resolved links', function() {
		const item1 = Object.assign(StubNoteObjectValid(), {
			KVCNoteBody: 'alfa\n[[bravo]]'
		});
		const item2 = Object.assign(StubNoteObjectValid(), {
			KVCNoteBody: 'bravo\n[[alfa]]'
		});
		deepEqual(mainModule.KVCWriteBacklinksMap([item1, item2]), {
			alfa: ['bravo'],
			bravo: ['alfa'],
		});
	});

});

describe('KVCWriteLauncherItemBacklinksTemplate', function test_KVCWriteLauncherItemBacklinksTemplate() {

	it('throws error if param1 not date', function() {
		throws(function() {
			mainModule.KVCWriteHumanTimestampString(new Date('alfa'), {}, function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not object', function() {
		throws(function() {
			mainModule.KVCWriteLauncherItemBacklinksTemplate(new Date(), null, function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		throws(function() {
			mainModule.KVCWriteLauncherItemBacklinksTemplate(new Date(), {}, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mainModule.KVCWriteLauncherItemBacklinksTemplate(item, {}, function (inputData) {
			return 'Alfa-' + inputData;
		}), ('Alfa-' + 'KVCWriteLauncherItemBacklinksText').toLowerCase() + '-' + mainModule.KVCWriteHumanTimestampString(item) + '\n\n');
	});

	it('creates heading for each key', function() {
		deepEqual(mainModule.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[alfa]]\n');
	});

	it('creates item for each value item', function() {
		deepEqual(mainModule.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: ['bravo'],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[alfa]]\n- [[bravo]]');
	});

	it('sorts by length ascending', function() {
		deepEqual(mainModule.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: ['bravo', 'charlie'],
			bravo: ['delta'],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[bravo]]\n- [[delta]]\n\n# [[alfa]]\n- [[bravo]]\n- [[charlie]]');
	});

});
