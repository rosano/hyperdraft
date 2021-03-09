const { throws, deepEqual } = require('assert');

const mod = require('./ui-logic.js').default;

const uLocalized = function (inputData) {
	return inputData + '-LOCALIZED';
};

describe('KVCWriteAccessibilitySummary', function test_KVCWriteAccessibilitySummary() {

	it('throws if not valid', function () {
		throws(function () {
			mod.KVCWriteAccessibilitySummary({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = Math.random().toString();
		deepEqual(mod.KVCWriteAccessibilitySummary(StubNoteObjectValid({
			KVCNoteBody: item + '\n' + Math.random().toString(),
		})), item);
	});

});

describe('KVCWriteLogicPublicSymbol', function test_KVCWriteLogicPublicSymbol() {

	it('returns string', function() {
		deepEqual(mod.KVCWriteLogicPublicSymbol(), 'ᗕ');
	});

});

describe('KVCWriteFilterFunction', function test_KVCWriteFilterFunction() {

	it('throws error if not string', function() {
		throws(function() {
			mod.KVCWriteFilterFunction(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns function', function() {
		deepEqual(typeof mod.KVCWriteFilterFunction('alfa'), 'function');
	});

	context('function', function () {

		it('returns false if no match', function() {
			deepEqual(mod.KVCWriteFilterFunction('bravo')({
				KVCNoteBody: 'alfa',
			}), false);
		});

		it('returns true', function() {
			deepEqual(mod.KVCWriteFilterFunction('alfa')({
				KVCNoteBody: 'alfa',
			}), true);
		});

		it('matches partial', function() {
			deepEqual(mod.KVCWriteFilterFunction('alf')({
				KVCNoteBody: 'alfa',
			}), true);
		});

		it('matches case insensitive', function() {
			deepEqual(mod.KVCWriteFilterFunction('ALF')({
				KVCNoteBody: 'alfa',
			}), true);
		});

		it('matches diacritic insensitive', function() {
			deepEqual(mod.KVCWriteFilterFunction('alfa')({
				KVCNoteBody: 'alfá',
			}), true);
		});

		context('KVCWriteLogicPublicSymbol', function () {
			
			it('matches whole string', function() {
				deepEqual(mod.KVCWriteFilterFunction(mod.KVCWriteLogicPublicSymbol())({
					KVCNoteBody: Math.random().toString(),
					KVCNoteIsPublic: true,
				}), true);
			});

			it('returns false if no match', function() {
				deepEqual(mod.KVCWriteFilterFunction(mod.KVCWriteLogicPublicSymbol() + Math.random().toString())({
					KVCNoteBody: Math.random().toString(),
					KVCNoteIsPublic: true,
				}), false);
			});

			it('matches non symbol', function() {
				const KVCNoteBody = Math.random().toString();
				deepEqual(mod.KVCWriteFilterFunction(mod.KVCWriteLogicPublicSymbol() + KVCNoteBody)({
					KVCNoteBody,
					KVCNoteIsPublic: true,
				}), true);
			});

			it('matches non symbol with space', function() {
				const KVCNoteBody = Math.random().toString();
				deepEqual(mod.KVCWriteFilterFunction(mod.KVCWriteLogicPublicSymbol() + ' ' +KVCNoteBody)({
					KVCNoteBody,
					KVCNoteIsPublic: true,
				}), true);
			});
		
		});

	});

});

describe('KVCWriteLogicListSort', function test_KVCWriteLogicListSort() {

	it('sorts by KVCNoteModificationDate descending', function() {
		const item1 = {
			KVCNoteModificationDate: new Date(0),
		};
		const item2 = {
			KVCNoteModificationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mod.KVCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by KVCNoteCreationDate descending', function() {
		const item1 = {
			KVCNoteCreationDate: new Date(0),
		};
		const item2 = {
			KVCNoteCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mod.KVCWriteLogicListSort), [item2, item1]);
	});

	it('sorts KVCNoteIsArchived below others', function() {
		const item1 = {
			KVCNoteCreationDate: new Date(0),
		};
		const item2 = {
			KVCNoteCreationDate: new Date(1),
			KVCNoteIsArchived: true,
		};

		deepEqual([item1, item2].sort(mod.KVCWriteLogicListSort), [item1, item2]);
	});

});

describe('KVCWriteHumanTimestampString', function test_KVCWriteHumanTimestampString() {

	it('throws error if not date', function() {
		throws(function() {
			mod.KVCWriteHumanTimestampString(new Date('alfa'));
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mod.KVCWriteHumanTimestampString(item), `${ item.toJSON().slice(0, 16) }`);
	});

});

describe('KVCWriteLauncherItemJournalTemplate', function test_KVCWriteLauncherItemJournalTemplate() {

	it('throws error if param1 not date', function() {
		throws(function() {
			mod.KVCWriteHumanTimestampString(new Date('alfa'), function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not function', function() {
		throws(function() {
			mod.KVCWriteLauncherItemJournalTemplate(new Date(), null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mod.KVCWriteLauncherItemJournalTemplate(item, function (inputData) {
			return 'Alfa-' + inputData;
		}), ('Alfa-' + 'KVCWriteLauncherItemJournalText').toLowerCase() + '-' + mod.KVCWriteHumanTimestampString(item) + '\n\n- ');
	});

});

describe('KVCWriteCustomDomainBaseURLData', function test_KVCWriteCustomDomainBaseURLData() {

	it('throws error if not string', function() {
		throws(function() {
			mod.KVCWriteCustomDomainBaseURLData(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns null if no text', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData(''), null);
	});

	it('returns null if no host', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('https:///'), null);
	});

	it('returns string if host', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('example.com'), 'https://example.com/');
	});

	it('returns string if URL with host', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('https://example.com'), 'https://example.com/');
	});

	it('returns string if URL with path', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('https://example.com/alfa/bravo'), 'https://example.com/');
	});

	it('returns string if URL with https', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('https://example.com/alfa/bravo'), 'https://example.com/');
	});

});

describe('KVCWriteCustomDomainBaseURLFunction', function test_KVCWriteCustomDomainBaseURLFunction() {

	it('throws error if param1 not string', function() {
		throws(function() {
			mod.KVCWriteCustomDomainBaseURLFunction(null, '');
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mod.KVCWriteCustomDomainBaseURLFunction('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns function', function() {
		deepEqual(typeof mod.KVCWriteCustomDomainBaseURLFunction('', ''), 'function');
	});

	context('function', function () {

		it('throws error if url not string', function() {
			throws(function() {
				mod.KVCWriteCustomDomainBaseURLFunction('', '')(null, '');
			}, /KVCErrorInputNotValid/);
		});

		it('throws error if domain not string', function() {
			throws(function() {
				mod.KVCWriteCustomDomainBaseURLFunction('', '')('', null);
			}, /KVCErrorInputNotValid/);
		});
		
		it('returns string', function() {
			deepEqual(mod.KVCWriteCustomDomainBaseURLFunction('', '')('', ''), '');
		});
		
		it('returns replaces common substring between original params with domain in url', function() {
			deepEqual(mod.KVCWriteCustomDomainBaseURLFunction('alfa-bravo', '-bravo')('alfa-delta', 'echo'), 'echo-delta');
		});
	
	});

});

describe('KVCWriteBacklinksMap', function test_KVCWriteBacklinksMap() {

	it('throws if not array', function () {
		throws(function () {
			mod.KVCWriteBacklinksMap(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(mod.KVCWriteBacklinksMap([]), {});
	});

	it('includes if no links', function() {
		const item = StubNoteObjectValid();
		deepEqual(mod.KVCWriteBacklinksMap([item]), {
			[item.KVCNoteBody]: [],
		});
	});

	it('includes if broken links', function() {
		deepEqual(mod.KVCWriteBacklinksMap([StubNoteObjectValid({
			KVCNoteBody: 'alfa\n[[bravo]]'
		})]), {
			alfa: [],
		});
	});

	it('includes if unresolved links', function() {
		const item1 = StubNoteObjectValid({
			KVCNoteBody: 'alfa\n[[bravo]]'
		});
		const item2 = StubNoteObjectValid({
			KVCNoteBody: 'bravo'
		});
		deepEqual(mod.KVCWriteBacklinksMap([item1, item2]), {
			alfa: [],
			bravo: [item1],
		});
	});

	it('includes if resolved links', function() {
		const item1 = StubNoteObjectValid({
			KVCNoteBody: 'alfa\n[[bravo]]'
		});
		const item2 = StubNoteObjectValid({
			KVCNoteBody: 'bravo\n[[alfa]]'
		});
		deepEqual(mod.KVCWriteBacklinksMap([item1, item2]), {
			alfa: [item2],
			bravo: [item1],
		});
	});

});

describe('KVCWriteLauncherItemBacklinksTemplate', function test_KVCWriteLauncherItemBacklinksTemplate() {

	it('throws error if param1 not date', function() {
		throws(function() {
			mod.KVCWriteHumanTimestampString(new Date('alfa'), {}, function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not object', function() {
		throws(function() {
			mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), null, function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		throws(function() {
			mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {}, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(item, {}, function (inputData) {
			return 'Alfa-' + inputData;
		}), ('Alfa-' + 'KVCWriteLauncherItemBacklinksText').toLowerCase() + '-' + mod.KVCWriteHumanTimestampString(item) + '\n\n');
	});

	it('creates heading for each key', function() {
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[alfa]]\n');
	});

	it('creates item for each value item', function() {
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [StubNoteObjectValid({
				KVCNoteBody: 'bravo'
			})],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[alfa]]\n- [[bravo]]');
	});

	it('sorts by length ascending', function() {
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [StubNoteObjectValid({
				KVCNoteBody: 'bravo',
			}), StubNoteObjectValid({
				KVCNoteBody: 'charlie',
			})],
			bravo: [StubNoteObjectValid({
				KVCNoteBody: 'delta',
			})],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[bravo]]\n- [[delta]]\n\n# [[alfa]]\n- [[bravo]]\n- [[charlie]]');
	});

	it('sorts KVCNoteIsArchived below', function() {
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [StubNoteObjectValid({
				KVCNoteBody: 'bravo',
				KVCNoteIsArchived: true,
			}), StubNoteObjectValid({
				KVCNoteBody: 'charlie',
			})],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[alfa]]\n- [[charlie]]\n- [[bravo]]');
	});

});

describe('KVCWriteLauncherItemVersionsTemplate', function test_KVCWriteLauncherItemVersionsTemplate() {

	it('throws error if param1 not date', function() {
		throws(function() {
			mod.KVCWriteLauncherItemVersionsTemplate(new Date('alfa'), uLocalized, []);
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not function', function() {
		throws(function() {
			mod.KVCWriteLauncherItemVersionsTemplate(new Date(), null, []);
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not array', function() {
		throws(function() {
			mod.KVCWriteLauncherItemVersionsTemplate(new Date(), uLocalized, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mod.KVCWriteLauncherItemVersionsTemplate(item, uLocalized, []), uLocalized('KVCWriteVersionsWord') + '-' + mod.KVCWriteHumanTimestampString(item));
	});

	it('shows param3 if present', function() {
		const item = new Date();
		const items = Array.from(Array(Math.max(1, Date.now() % 10))).map(function (e) {
			return item.toString();
		});
		deepEqual(mod.KVCWriteLauncherItemVersionsTemplate(item, uLocalized, items), uLocalized('KVCWriteVersionsWord') + '-' + mod.KVCWriteHumanTimestampString(item) + items.map(function (e) {
				return '\n\n```\n' + e + '\n```';
			}).join(''));
	});

});

describe('KVCWriteFileNoteObject', function test_KVCWriteFileNoteObject() {

	const uFile = function (inputData) {
		return Object.assign({
			_LCHReadTextFileObjectContent: Math.random().toString(),
			lastModified: Date.now(),
			name: Math.random().toString(),
			size: parseInt(Math.random() * 1000),
		}, inputData);
	};

	it('throws error if not File', function() {
		throws(function() {
			mod.KVCWriteFileNoteObject(uFile({
				lastModified: null,
			}));
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if no _LCHReadTextFileObjectContent', function() {
		throws(function() {
			mod.KVCWriteFileNoteObject(uFile({
				_LCHReadTextFileObjectContent: null,
			}));
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not boolean', function() {
		throws(function() {
			mod.KVCWriteFileNoteObject(uFile(), null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		const item = uFile();
		deepEqual(mod.KVCWriteFileNoteObject(item), {
			KVCNoteBody: item._LCHReadTextFileObjectContent,
			KVCNoteCreationDate: new Date(item.lastModified),
			KVCNoteModificationDate: new Date(item.lastModified),
		});
	});

	context('param2', function () {

		it('extracts filename to KVCNoteBody', function() {
			const filename = Math.random().toString();
			const _LCHReadTextFileObjectContent = Math.random().toString();
			deepEqual(mod.KVCWriteFileNoteObject(uFile({
				_LCHReadTextFileObjectContent,
				name: filename + '.' + Date.now().toString(),
			}), true).KVCNoteBody, filename + '\n\n' + _LCHReadTextFileObjectContent);
		});
	
	});

});
