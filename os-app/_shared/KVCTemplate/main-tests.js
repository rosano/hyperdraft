const { throws, deepEqual } = require('assert');

const mod = require('./main.js').default;

const uTokenTag = function (inputData) {
	return `{${ mod[inputData]() }}`;
};

const uBlockTag = function (param1, param2) {
	return `{block:${ mod[param1]() }}${ param2 }{/block:${ mod[param1]() }}`;
};

describe('KVCTemplatePlaintextTitle', function test_KVCTemplatePlaintextTitle() {

	it('throws if not string', function () {
		throws(function () {
			mod.KVCTemplatePlaintextTitle(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mod.KVCTemplatePlaintextTitle(''), '');
	});

	it('extracts if single', function() {
		deepEqual(mod.KVCTemplatePlaintextTitle('alfa'), 'alfa');
	});

	it('extracts if multiple', function() {
		deepEqual(mod.KVCTemplatePlaintextTitle('alfa\nbravo'), 'alfa');
	});

	it('extracts if blank', function() {
		deepEqual(mod.KVCTemplatePlaintextTitle('\nbravo'), '');
	});

});

describe('KVCTemplatePlaintextBody', function test_KVCTemplatePlaintextBody() {

	it('throws if not string', function () {
		throws(function () {
			mod.KVCTemplatePlaintextBody(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mod.KVCTemplatePlaintextBody(''), '');
	});

	it('extracts if single', function() {
		deepEqual(mod.KVCTemplatePlaintextBody('alfa'), '');
	});

	it('extracts if multiple', function() {
		deepEqual(mod.KVCTemplatePlaintextBody('alfa\nbravo'), 'bravo');
	});

	it('extracts if blank', function() {
		deepEqual(mod.KVCTemplatePlaintextBody('\nbravo'), 'bravo');
	});

	it('extracts if double break', function() {
		deepEqual(mod.KVCTemplatePlaintextBody('alfa\n\nbravo'), 'bravo');
	});

});

describe('KVCTemplateTruncated', function test_KVCTemplateTruncated() {

	it('throws error if not string', function() {
		throws(function() {
			mod.KVCTemplateTruncated(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns input', function() {
		deepEqual(mod.KVCTemplateTruncated('alfa'), 'alfa');
	});

	it('includes if under 60 characters', function() {
		deepEqual(mod.KVCTemplateTruncated('alfa bravo charlie delta echo foxtrot golf hotel juliet kilo'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilo');
	});

	it('truncates text', function() {
		deepEqual(mod.KVCTemplateTruncated('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
	});

	it('adds ellipsis if second parameter truthy', function() {
		deepEqual(mod.KVCTemplateTruncated('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos', true), 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
	});

});


describe('KVCTemplateTextContent', function test_KVCTemplateTextContent() {

	it('throws error if not string', function() {
		throws(function() {
			mod.KVCTemplateTextContent(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTextContent('<p>alfa <b>bravo</b></p>'), 'alfa bravo');
	});

	it('trims edges', function() {
		deepEqual(mod.KVCTemplateTextContent(' alfa '), 'alfa');
	});

	it('replaces newlines', function() {
		deepEqual(mod.KVCTemplateTextContent('alfa\nbravo'), 'alfa bravo');
	});

});

describe('KVCTemplateNormalizeURL', function test_KVCTemplateNormalizeURL() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateNormalizeURL(), process.env.KVC_TEMPLATE_NORMALIZE_URL);
	});

});

describe('KVCTemplateDecorURL', function test_KVCTemplateDecorURL() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateDecorURL(), process.env.KVC_TEMPLATE_DECOR_URL);
	});

});

describe('KVCTemplateViewDefault', function test_KVCTemplateViewDefault() {

	const uTag = function (inputData) {
		return new RegExp(`<${ inputData }>[\\s\\S]*</${ inputData }>`)
	};

	const uTagContent = function (param1, param2) {
		return new RegExp(`<${ param1 }>[\\s\\S]*${ param2 }[\\s\\S]*</${ param1 }>`)
	};

	const uLocalize = function () {};

	it('throws if not function', function () {
		throws(function () {
			mod.KVCTemplateViewDefault(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(typeof mod.KVCTemplateViewDefault(uLocalize), 'string');
	});

	it('begins with doctype', function() {
		deepEqual(mod.KVCTemplateViewDefault(uLocalize).match('<!DOCTYPE html>').index, 0);
	});

	it('contains html', function() {
		deepEqual(!!mod.KVCTemplateViewDefault(uLocalize).match(uTag('html')), true);
	});

	it('contains head', function() {
		deepEqual(!!mod.KVCTemplateViewDefault(uLocalize).match(uTag('head')), true);
	});

	it('contains title', function() {
		deepEqual(!!mod.KVCTemplateViewDefault(uLocalize).match(uTag('title')), true);
	});

	it('contains KVCTemplateTokenPostTitle in title', function() {
		deepEqual(!!mod.KVCTemplateViewDefault(uLocalize).match(uTagContent('title', mod.KVCTemplateTokenPostTitle())), true);
	});

});

describe('KVCTemplateTokenPostTitle', function test_KVCTemplateTokenPostTitle() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenPostTitle(), 'Title');
	});

});

describe('KVCTemplateTokenPostBlurb', function test_KVCTemplateTokenPostBlurb() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenPostBlurb(), 'PostBlurb');
	});

});

describe('KVCTemplateTokenPostBody', function test_KVCTemplateTokenPostBody() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenPostBody(), 'Body');
	});

});

describe('KVCTemplateTokenRootURL', function test_KVCTemplateTokenRootURL() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenRootURL(), 'HomeURL');
	});

});

describe('KVCTemplateTokenRootURLLegacy', function test_KVCTemplateTokenRootURLLegacy() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenRootURLLegacy(), 'BlogURL');
	});

});

describe('KVCTemplateTokenRootPage', function test_KVCTemplateTokenRootPage() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenRootPage(), 'HomePage');
	});

});

describe('KVCTemplateTokenNotePage', function test_KVCTemplateTokenNotePage() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenNotePage(), 'RefPage');
	});

});

describe('KVCTemplateTokenNotePageLegacy', function test_KVCTemplateTokenNotePageLegacy() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenNotePageLegacy(), 'PermalinkPage');
	});

});

describe('KVCTemplateTokenBacklinks', function test_KVCTemplateTokenBacklinks() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenBacklinks(), 'Backlinks');
	});

});

describe('KVCTemplateTokenName', function test_KVCTemplateTokenName() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenName(), 'Name');
	});

});

describe('KVCTemplateTokenURL', function test_KVCTemplateTokenURL() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenURL(), 'URL');
	});

});

describe('KVCTemplateTokenDescription', function test_KVCTemplateTokenDescription() {

	it('returns string', function() {
		deepEqual(mod.KVCTemplateTokenDescription(), 'Description');
	});

});

describe('KVCTemplateRemappedLinks', function test_KVCTemplateRemappedLinks() {

	it('throws if param1 not string', function () {
		throws(function () {
			mod.KVCTemplateRemappedLinks(null, {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mod.KVCTemplateRemappedLinks('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mod.KVCTemplateRemappedLinks('', {}), '');
	});

	it('ignores if no replacement', function() {
		deepEqual(mod.KVCTemplateRemappedLinks('[[alfa]]', {
			bravo: 'charlie',
		}), '[[alfa]]');
	});

	it('ignores if not double-bracket', function() {
		deepEqual(mod.KVCTemplateRemappedLinks('[alfa]', {
			alfa: 'bravo',
		}), '[alfa]');
	});

	it('replaces single', function() {
		deepEqual(mod.KVCTemplateRemappedLinks('[[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo)');
	});

	it('replaces multiple', function() {
		deepEqual(mod.KVCTemplateRemappedLinks('[[alfa]] [[charlie]]', {
			alfa: 'bravo',
			charlie: 'delta',
		}), '[alfa](bravo) [charlie](delta)');
	});

	it('replaces duplicate', function() {
		deepEqual(mod.KVCTemplateRemappedLinks('[[alfa]] [[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo) [alfa](bravo)');
	});

	it('replaces indirect', function() {
		deepEqual(mod.KVCTemplateRemappedLinks('[alfa](bravo)', {
			bravo: 'charlie',
		}), '[alfa](charlie)');
	});

	context('case insensitive', function () {
		
		it('replaces direct', function() {
			const key = 'Alfa';
			const value = Math.random().toString();

			const item = uRandomElement(key.toUpperCase(), key.toLowerCase());

			deepEqual(mod.KVCTemplateRemappedLinks(`[[${ item }]]`, {
				[key]: value,
			}), `[${ item }](${ value })`);
		});

		it('replaces indirect', function() {
			const key = 'Alfa';
			const item = uRandomElement(key.toUpperCase(), key.toLowerCase());

			deepEqual(mod.KVCTemplateRemappedLinks(`[alfa](${ item })`, {
				[key]: 'charlie',
			}), '[alfa](charlie)');
		});
	
	});

	context('regex characters', function () {
		
		it('replaces direct', function() {
			const key = '$Alfa';
			const value = Math.random().toString();

			const item = uRandomElement(key.toUpperCase(), key.toLowerCase());

			deepEqual(mod.KVCTemplateRemappedLinks(`[[${ item }]]`, {
				[key]: value,
			}), `[${ item }](${ value })`);
		});

		it('replaces indirect', function() {
			const key = '$Alfa';
			const item = uRandomElement(key.toUpperCase(), key.toLowerCase());

			deepEqual(mod.KVCTemplateRemappedLinks(`[alfa](${ item })`, {
				[key]: 'charlie',
			}), '[alfa](charlie)');
		});
	
	});

});

describe('KVCTemplateHTML', function test_KVCTemplateHTML() {

	it('throws if not string', function() {
		throws(function() {
			mod.KVCTemplateHTML(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string as p', function() {
		deepEqual(mod.KVCTemplateHTML('alfa'), '<p>alfa</p>');
	});

	it('converts simple headers without anchors', function() {
		deepEqual(mod.KVCTemplateHTML('# alfa'), '<h1>alfa</h1>');
	});

	it('converts single newline as br', function() {
		deepEqual(mod.KVCTemplateHTML('alfa\nbravo'), '<p>alfa<br>bravo</p>');
	});

	it('converts double newline as p', function() {
		deepEqual(mod.KVCTemplateHTML('alfa\n\nbravo'), '<p>alfa</p>\n<p>bravo</p>');
	});

	it('converts www domains to links', function() {
		deepEqual(mod.KVCTemplateHTML('www.alfa.com'), '<p><a href="http://www.alfa.com">www.alfa.com</a></p>');
	});

	it('converts internal link to a', function() {
		deepEqual(mod.KVCTemplateHTML('[alfa](bravo)'), '<p><a href="bravo">alfa</a></p>');
	});

	it('adds target blank if not matching _KVCOptionPublicBaseURL', function() {
		const item = Math.random().toString();
		deepEqual(mod.KVCTemplateHTML(`[alfa](${ item })`, {
			_KVCOptionPublicBaseURL: Math.random().toString(),
		}), `<p><a target="_blank" href="${ item }">alfa</a></p>`);
	});

});

describe('KVCTemplateTokensMap', function test_KVCTemplateTokensMap() {

	it('throws if param1 not string', function () {
		throws(function () {
			mod.KVCTemplateTokensMap(null, {})
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mod.KVCTemplateTokensMap('', null)
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(typeof mod.KVCTemplateTokensMap('', {}), 'object');
	});

	context('KVCTemplateTokenPostTitle', function () {
		
		it('sets to KVCTemplatePlaintextTitle', function () {
			const item = 'alfa\nbravo';
			deepEqual(mod.KVCTemplateTokensMap(item, {})[uTokenTag('KVCTemplateTokenPostTitle')], mod.KVCTemplatePlaintextTitle(item));
		});
	
	});

	context('KVCTemplateTokenPostBlurb', function () {
		
		it('sets value', function () {
			const item = 'alfa\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
			deepEqual(mod.KVCTemplateTokensMap(item, {})[uTokenTag('KVCTemplateTokenPostBlurb')], require('OLSKString').OLSKStringSnippet(mod.KVCTemplatePlaintextBody(item)));
		});
	
	});

	context('KVCTemplateTokenPostBody', function () {
		
		it('sets to KVCTemplateHTML', function () {
			const item = 'alfa\n# bravo';
			deepEqual(mod.KVCTemplateTokensMap(item, {})[uTokenTag('KVCTemplateTokenPostBody')], mod.KVCTemplateHTML(mod.KVCTemplatePlaintextBody(item)));
		});
	
	});

	context('KVCTemplateTokenRootURL', function () {
		
		it('sets to KVCOptionRootURL', function () {
			deepEqual(mod.KVCTemplateTokensMap('', {
				KVCOptionRootURL: 'alfa',
			})[uTokenTag('KVCTemplateTokenRootURL')], 'alfa');
		});
	
	});

	context('KVCTemplateTokenRootURLLegacy', function () {
		
		it('sets to KVCOptionRootURL', function () {
			deepEqual(mod.KVCTemplateTokensMap('', {
				KVCOptionRootURL: 'alfa',
			})[uTokenTag('KVCTemplateTokenRootURLLegacy')], 'alfa');
		});
	
	});

});

describe('KVCTemplateVisibleBlocks', function test_KVCTemplateVisibleBlocks() {

	it('throws if not object', function () {
		throws(function () {
			mod.KVCTemplateVisibleBlocks(null)
		}, /KVCErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mod.KVCTemplateVisibleBlocks({}), []);
	});

	context('KVCOptionRootURL', function () {
		
		it('includes KVCTemplateTokenRootURL', function () {
			deepEqual(mod.KVCTemplateVisibleBlocks({
				KVCOptionRootURL: 'alfa',
			}), [mod.KVCTemplateTokenRootURL()]);
		});
	
	});

	context('KVCOptionIsRoot', function () {
		
		it('includes KVCTemplateTokenRootPage if true', function () {
			deepEqual(mod.KVCTemplateVisibleBlocks({
				KVCOptionIsRoot: true,
			}), [mod.KVCTemplateTokenRootPage()]);
		});
		
		it('includes KVCTemplateTokenNotePage', function () {
			deepEqual(mod.KVCTemplateVisibleBlocks({
				KVCOptionIsRoot: false,
			}), [mod.KVCTemplateTokenNotePage(), mod.KVCTemplateTokenNotePageLegacy()]);
		});
	
	});

	context('KVCOptionBacklinks', function () {
		
		it.skip('includes KVCTemplateTokenBacklinks', function () {
			deepEqual(mod.KVCTemplateVisibleBlocks({
				KVCOptionBacklinks: {},
			}), [mod.KVCTemplateTokenBacklinks()]);
		});
		
	});

});

describe('KVCTemplateBlockTokensMap', function test_KVCTemplateBlockTokensMap() {

	const uOptions = function () {
		return {
			KVCBlockPermalinkMap: {},
			KVCBlockTemplateOptions: {},
		};
	};

	it('throws if not object', function () {
		throws(function () {
			mod.KVCTemplateBlockTokensMap(null)
		}, /KVCErrorInputNotValid/);
	});

	it('throws if KVCBlockPermalinkMap not object', function () {
		throws(function () {
			mod.KVCTemplateBlockTokensMap(Object.assign(uOptions(), {
				KVCBlockPermalinkMap: null,
			}))
		}, /KVCErrorInputNotValid/);
	});

	it('throws if KVCBlockTemplateOptions not object', function () {
		throws(function () {
			mod.KVCTemplateBlockTokensMap(Object.assign(uOptions(), {
				KVCBlockTemplateOptions: null,
			}))
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(typeof mod.KVCTemplateBlockTokensMap(uOptions()), 'object');
	});

	context('KVCTemplateTokenBacklinks', function () {

		const item = mod.KVCTemplateBlockTokensMap(Object.assign(uOptions(), {
			KVCBlockPermalinkMap: {
				charlie: 'echo'
			},
			KVCBlockTemplateOptions: {
				KVCOptionBacklinks: [StubNoteObjectValid({
					KVCNoteBody: 'charlie\n- [[delta]]\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
				})],
			},
		}))[uTokenTag('KVCTemplateTokenBacklinks')].shift();

		it('sets KVCTemplateTokenName', function () {
			deepEqual(item[uTokenTag('KVCTemplateTokenName')], 'charlie');
		});
		
		it('sets KVCTemplateTokenURL', function () {
			deepEqual(item[uTokenTag('KVCTemplateTokenURL')], 'echo');
		});
		
		it('sets KVCTemplateTokenDescription', function () {
			deepEqual(item[uTokenTag('KVCTemplateTokenDescription')], 'delta  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has…');
		});
	
	});

});

describe('KVCTemplateCollapseBlocks', function test_KVCTemplateCollapseBlocks() {

	it('throws error if param1 not string', function() {
		throws(function() {
			mod.KVCTemplateCollapseBlocks(null, []);
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not array', function() {
		throws(function() {
			mod.KVCTemplateCollapseBlocks('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mod.KVCTemplateCollapseBlocks('', []), '');
	});

	it('replaces if no key', function() {
		deepEqual(mod.KVCTemplateCollapseBlocks('{block:alfa}bravo{/block:alfa}', ['charlie']), '');
	});

	it('replaces single', function() {
		deepEqual(mod.KVCTemplateCollapseBlocks('{block:alfa}bravo{/block:alfa}', ['alfa']), 'bravo');
	});

	it('replaces multiple', function() {
		deepEqual(mod.KVCTemplateCollapseBlocks('{block:alfa}bravo{/block:alfa} {block:charlie}delta{/block:charlie}', ['alfa', 'charlie']), 'bravo delta');
	});

	it('replaces duplicate', function() {
		deepEqual(mod.KVCTemplateCollapseBlocks('{block:alfa}bravo{/block:alfa} {block:alfa}bravo{/block:alfa}', ['alfa']), 'bravo bravo');
	});

	it('maintains whitespace', function() {
		deepEqual(mod.KVCTemplateCollapseBlocks('{block:alfa}\n\tbravo\n{/block:alfa}', ['alfa']), '\n\tbravo\n');
	});

	it('ignores if not corresponding', function() {
		const item = '{block:alfa}bravo{/block:charlie}';
		deepEqual(mod.KVCTemplateCollapseBlocks(item, []), item);
	});

	it.skip('replaces KVCTemplateTokenBacklinks', function() {
		const options = {
			KVCOptionBacklinks: [StubNoteObjectValid({
				KVCNoteBody: 'charlie\ndelta',
				KVCNotePublicID: 'echo',
			})],
		};

		deepEqual(mod.KVCTemplateCollapseBlocks(uBlockTag('KVCTemplateTokenBacklinks', `bravo-{${ mod.KVCTemplateTokenName() }}:{${ mod.KVCTemplateTokenURL() }}:{${ mod.KVCTemplateTokenDescription() }}`), mod.KVCTemplateVisibleBlocks(options), {
			KVCBlockPermalinkMap: {
				charlie: 'echo'
			},
			KVCBlockTemplateOptions: options,
		}), 'bravo-charlie:echo:delta');
	});

});

describe('KVCView', function test_KVCView() {

	const uOptions = function () {
		return {
			KVCViewSource: '',
			KVCViewPermalinkMap: {},
			KVCViewTemplate: '',
			KVCViewTemplateOptions: {},
		};
	};

	it('throws if KVCViewSource not string', function () {
		throws(function () {
			mod.KVCView(Object.assign(uOptions(), {
				KVCViewSource: null,
			}));
		}, /KVCErrorInputNotValid/);
	});

	it('throws if KVCViewPermalinkMap not object', function () {
		throws(function () {
			mod.KVCView(Object.assign(uOptions(), {
				KVCViewPermalinkMap: null,
			}));
		}, /KVCErrorInputNotValid/);
	});

	it('throws if KVCViewTemplate not string', function () {
		throws(function () {
			mod.KVCView(Object.assign(uOptions(), {
				KVCViewTemplate: null,
			}));
		}, /KVCErrorInputNotValid/);
	});

	it('throws if KVCViewTemplateOptions not object', function () {

		throws(function () {
			mod.KVCView(Object.assign(uOptions(), {
				KVCViewTemplateOptions: null,
			}));
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(typeof mod.KVCView(uOptions()), 'string');
	});

	it('replaces KVCViewPermalinkMap', function() {
		deepEqual(mod.KVCView(Object.assign(uOptions(), {
			KVCViewSource: 'alfa\n[[bravo]]',
			KVCViewPermalinkMap: {
				bravo: 'charlie',
			},
			KVCViewTemplate: `delta {${ mod.KVCTemplateTokenPostBody() }}`,
		})), 'delta <p><a href="charlie">bravo</a></p>');
	});

	it('replaces tokens', function() {
		deepEqual(mod.KVCView(Object.assign(uOptions(), {
			KVCViewSource: 'alfa',
			KVCViewTemplate: `bravo {${ mod.KVCTemplateTokenPostTitle() }}`,
		})), 'bravo alfa');
	});

	context('blocks', function () {
		
		it('replaces if not present', function() {
			deepEqual(mod.KVCView(Object.assign(uOptions(), {
				KVCViewTemplate: uBlockTag('KVCTemplateTokenRootURL', 'bravo'),
			})), '');
		});
		
		it('replaces KVCTemplateTokenRootURL', function() {
			deepEqual(mod.KVCView(Object.assign(uOptions(), {
				KVCViewTemplate: uBlockTag('KVCTemplateTokenRootURL', uTokenTag('KVCTemplateTokenRootURL')),
				KVCViewTemplateOptions: {
					KVCOptionRootURL: 'bravo',
				},
			})), 'bravo');
		});
	
	});

});
