import OLSKString from 'OLSKString';
import marked from 'marked';
import escapeRegExp from 'escape-string-regexp';

const uTokenTag = function (inputData) {
	return `{${ mod[inputData]() }}`;
};

const mod = {

	KVCTemplatePlaintextTitle (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.split('\n').shift();
	},

	KVCTemplatePlaintextBody (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.split('\n').slice(1).join('\n').trim();
	},

	KVCTemplateTextContent (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.replace(/<[^>]*>?/gm, '').replace(/\n/g, ' ').trim();
	},

	KVCTemplateViewDefault (inputData) {
		if (typeof inputData !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}

		return `<!DOCTYPE html>
<html>
<head>

<title>{${ mod.KVCTemplateTokenPostTitle() }}</title>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width" />

<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css">
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/olsk/OLSKDecor/ui-style.css">

</head>
<body class="OLSKDecor OLSKDecorCapped OLSKDecorX">

{block:${ mod.KVCTemplateTokenNotePage() }}
<a class="KVCRootLink" href="{${ mod.KVCTemplateTokenRootURL() }}">${ inputData('KVCRootLinkText') }</a>

<hr role="presentation" />
{/block:${ mod.KVCTemplateTokenNotePage() }}

<div class="OLSKCommonCard OLSKCommonCrownCard">
	<section>
		<span class="KVCArticleTitle">{${ mod.KVCTemplateTokenPostTitle() }}</span>
	</section>
</div>

<article class="KVCArticleBody">

{${ mod.KVCTemplateTokenPostBody() }}

</article>

{block:${ mod.KVCTemplateTokenBacklinks() }}
<hr role="presentation" />

<div class="KVCBacklinks">

<h3 class="KVCBacklinksHeading">${ inputData('KVCBacklinksHeadingText') }</h3>

<p>
	<a class="KVCBacklinksLink" href="${ uTokenTag('KVCTemplateTokenURL') }">${ uTokenTag('KVCTemplateTokenName') }</a><br />
	<span class="KVCBacklinksSnippet">${ uTokenTag('KVCTemplateTokenDescription') }</span>
</p>

</div>
{/block:${ mod.KVCTemplateTokenBacklinks() }}

</body>
</html>`;
	},

	KVCTemplateTokenPostTitle () {
		return 'Title';
	},

	KVCTemplateTokenPostBody () {
		return 'Body';
	},

	KVCTemplateTokenRootURL () {
		return 'HomeURL';
	},

	KVCTemplateTokenRootURLLegacy () {
		return 'BlogURL';
	},

	KVCTemplateTokenRootPage () {
		return 'HomePage';
	},

	KVCTemplateTokenNotePage () {
		return 'RefPage';
	},

	KVCTemplateTokenNotePageLegacy () {
		return 'PermalinkPage';
	},

	KVCTemplateTokenBacklinks () {
		return 'Backlinks';
	},

	KVCTemplateTokenName () {
		return 'Name';
	},

	KVCTemplateTokenURL () {
		return 'URL';
	},

	KVCTemplateTokenDescription () {
		return 'Description';
	},

	KVCTemplateRemappedLinks (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param2 !== 'object' || param2 === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		return Object.entries(param2).reduce(function (coll, [key, value]) {
			return (coll.match(new RegExp(`\\[\\[${ escapeRegExp(key) }\\]\\]`, 'gi')) || []).reduce(function (coll, item) {
				return coll.split(item).join(`${ item.slice(1, -1) }(${ value })`);
			}, (coll.match(new RegExp(`\\]\\(${ escapeRegExp(key) }\\)`, 'gi')) || []).reduce(function (coll, item) {
				return coll.split(item).join(`](${ value })`);
			}, coll));
		}, param1);
	},

	KVCTemplateHTML (inputData, options = {}) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		const renderer = new marked.Renderer();
		renderer.link = function(href, title, text) {
			const _default = marked.Renderer.prototype.link.apply(this, arguments);
			return (options._KVCOptionPublicBaseURL && !href.match(options._KVCOptionPublicBaseURL)) ? _default.replace('<a','<a target="_blank"') : _default;
		};

		return marked.setOptions({
			gfm: true,
			headerIds: false,
			breaks: true,
			renderer,
		})(inputData).trim();
	},

	KVCTemplateTokensMap (body, options) {
		if (typeof body !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof options !== 'object' || options === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		return Object.fromEntries([
			[mod.KVCTemplateTokenPostTitle(), mod.KVCTemplatePlaintextTitle(body)],
			[mod.KVCTemplateTokenPostBody(), mod.KVCTemplateHTML(mod.KVCTemplatePlaintextBody(body), options)],
			[mod.KVCTemplateTokenRootURL(), options.KVCOptionRootURL],
			[mod.KVCTemplateTokenRootURLLegacy(), options.KVCOptionRootURL],
		].map(function (e) {
			e[0] = `{${ e[0] }}`;

			return e;
		}));
	},

	KVCTemplateVisibleBlocks (options) {
		if (typeof options !== 'object' || options === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		return Object.keys(options).reduce(function (coll, item) {
			if (item === 'KVCOptionRootURL') {
				coll.push(mod.KVCTemplateTokenRootURL());
			}

			if (item === 'KVCOptionIsRoot') {
				coll.push(...(options[item] ? [mod.KVCTemplateTokenRootPage()] : [mod.KVCTemplateTokenNotePage(), mod.KVCTemplateTokenNotePageLegacy()]));
			}

			if (item === 'KVCOptionBacklinks') {
				// coll.push(mod.KVCTemplateTokenBacklinks());
			}

			return coll;
		}, []);
	},

	KVCTemplateBlockTokensMap (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof inputData.KVCBlockPermalinkMap !== 'object' || inputData.KVCBlockPermalinkMap === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof inputData.KVCBlockTemplateOptions !== 'object' || inputData.KVCBlockTemplateOptions === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof inputData.KVCBlockTemplateOptions !== 'object' || inputData.KVCBlockTemplateOptions === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		const outputData = {};

		if (inputData.KVCBlockTemplateOptions.KVCOptionBacklinks) {
			outputData[uTokenTag('KVCTemplateTokenBacklinks')] = inputData.KVCBlockTemplateOptions.KVCOptionBacklinks.map(function(e) {
				const outputData = {};
				
				outputData[uTokenTag('KVCTemplateTokenName')] = mod.KVCTemplatePlaintextTitle(e.KVCNoteBody);
				
				outputData[uTokenTag('KVCTemplateTokenURL')] = inputData.KVCBlockPermalinkMap[mod.KVCTemplatePlaintextTitle(e.KVCNoteBody)];
				
				const body = mod.KVCTemplatePlaintextBody(e.KVCNoteBody);
				outputData[uTokenTag('KVCTemplateTokenDescription')] = OLSKString.OLSKStringSnippet(mod.KVCTemplateTextContent(mod.KVCTemplateHTML((body.match(/\[\[.*\]\]/g) || []).reduce(function (coll, item) {
					return coll.split(item).join(item.match(/\[\[(.*)\]\]/)[1]);
				}, body))));

				return outputData;
			});
		}

		return outputData;
	},

	KVCTemplateCollapseBlocks (param1, param2, options) {
		if (typeof param1 !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!Array.isArray(param2)) {
			throw new Error('KVCErrorInputNotValid');
		}

		const blockTokensMap = options ? mod.KVCTemplateBlockTokensMap(options) : null;

		let outputData = param1;

		let startIndex = -1;
		let lastIndex;

		while (startIndex < outputData.length) {
			if (startIndex === lastIndex) {
				startIndex = Infinity;
				return outputData;
			}

			lastIndex = startIndex;

			(function () {
				let matchOpen = outputData.match(/\{block:(\w+)\}/i);

				if (!matchOpen) {
					startIndex = outputData.length;
					return;
				}

				let matchClosed = outputData.match(new RegExp(`\\{\\/block:${ matchOpen[1] }\}`));

				if (!matchClosed) {
					startIndex = matchOpen.index + matchOpen[0].length;
					return;
				}

				outputData = (function (string, matchOpen, matchClosed, exclude) {
					return string.slice(0, matchOpen.index) + (function(inputData) {
						if (exclude) {
							return '';
						}
						
						if (!blockTokensMap) {
							return inputData;
						}

						if (matchOpen[1] === mod.KVCTemplateTokenBacklinks()) {
							return blockTokensMap[uTokenTag('KVCTemplateTokenBacklinks')].map(function (e) {
								return OLSKString.OLSKStringReplaceTokens(inputData, e);
							})
						}

						return inputData;
					})(string.slice(matchOpen.index + matchOpen[0].length, matchClosed.index)) + string.slice(matchClosed.index + matchClosed[0].length);
				})(outputData, matchOpen, matchClosed, !param2.includes(matchOpen[1]));

				startIndex = matchOpen.index;
			})();
		}

		return outputData;
	},

	KVCView (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof inputData.KVCViewSource !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof inputData.KVCViewPermalinkMap !== 'object' || inputData.KVCViewPermalinkMap === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof inputData.KVCViewTemplate !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof inputData.KVCViewTemplateOptions !== 'object' || inputData.KVCViewTemplateOptions === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		return OLSKString.OLSKStringReplaceTokens(mod.KVCTemplateCollapseBlocks(inputData.KVCViewTemplate, mod.KVCTemplateVisibleBlocks(inputData.KVCViewTemplateOptions), {
			KVCBlockPermalinkMap: inputData.KVCViewPermalinkMap,
			KVCBlockTemplateOptions: inputData.KVCViewTemplateOptions,
		}), mod.KVCTemplateTokensMap(mod.KVCTemplateRemappedLinks(inputData.KVCViewSource, inputData.KVCViewPermalinkMap), inputData.KVCViewTemplateOptions))
	},

};

export default mod;
