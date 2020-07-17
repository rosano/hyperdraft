import * as OLSKStringPackage from 'OLSKString';
const OLSKString = OLSKStringPackage.default || OLSKStringPackage;

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

	KVCTemplatePlaintextSnippet (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.length <= 100 ? inputData : inputData.slice(0, 100).split(' ').slice(0, -1).join(' ').concat('…');
	},

	KVCTemplateViewDefault (inputData) {
		if (typeof inputData !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}

		return `<!DOCTYPE html>
<html>
<head>
	<title>{${ mod.KVCTemplateTokenPostTitle() }}</title>
	<style type="text/css">
		:root {
			--KVCBoxFontFamily: 'Lucida Grande', sans-serif;
			--KVCBoxFontSize: 10.5pt;

			--KVCBoxHeadingFontFamily: 'Helvetica Neue';

			--KVCBoxBackground: white;
			--KVCBoxForeground: black;
		}

		.KVCBox {
			padding: 10px;
			max-width: 400px;

			margin: auto;

			background: var(--KVCBoxBackground);
			font-family: var(--KVCBoxFontFamily);
			font-size: var(--KVCBoxFontSize);
			color: var(--KVCBoxForeground);
		}

		.KVCBox h1, .KVCBox h2, .KVCBox h3, .KVCBox h4 {
			font-family: var(--KVCBoxHeadingFontFamily);
		}

		.KVCBox ul {
			padding-left: 30px;
		}

		.KVCBox hr {
			height: 1px;
			border: none;

			background: var(--KVCBoxForeground);
		}

		.KVCBox code {
			display: inline-block;
			padding: 3px;

			background: hsl(0, 0%, 94%);
			color: hsl(0, 0%, 20%);
		}
	</style>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width" />
</head>
<body class="KVCBox">

{block:${ mod.KVCTemplateTokenNotePage() }}
<a class="KVCRootLink" href="{${ mod.KVCTemplateTokenRootURL() }}">${ inputData('KVCRootLinkText') }</a>

<hr />
{/block:${ mod.KVCTemplateTokenNotePage() }}

<h1 class="KVCArticleTitle">{${ mod.KVCTemplateTokenPostTitle() }}</h1>

<article class="KVCArticleBody">

{${ mod.KVCTemplateTokenPostBody() }}

</article>

{block:${ mod.KVCTemplateTokenBacklinks() }}
<hr />

<div class="KVCBacklinks">

<strong class="KVCBacklinksHeading">${ inputData('KVCBacklinksHeadingText') }</strong><br />

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

		return Object.entries(param2).reduce(function (coll, e) {
			return coll.split(`[[${ e[0] }]]`).join(`[${ e[0] }](${ e[1] })`);
		}, param1);
	},

	KVCTemplateHTML (showdown, inputData) {
		if (typeof showdown.Converter !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}
		
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		const showdownConverter = new showdown.Converter();
		showdownConverter.setOption('simpleLineBreaks', true);
		showdownConverter.setOption('simplifiedAutoLink', true);
		showdownConverter.setOption('noHeaderId', true);

		return showdownConverter.makeHtml(inputData);
	},

	KVCTemplateTokensMap (showdown, body, options) {
		if (typeof showdown.Converter !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}
		
		if (typeof body !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof options !== 'object' || options === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		return Object.fromEntries([
			[mod.KVCTemplateTokenPostTitle(), mod.KVCTemplatePlaintextTitle(body)],
			[mod.KVCTemplateTokenPostBody(), mod.KVCTemplateHTML(showdown, mod.KVCTemplatePlaintextBody(body))],
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
				coll.push(mod.KVCTemplateTokenBacklinks());
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

		const outputData = {};

		if (inputData.KVCBlockTemplateOptions.KVCOptionBacklinks) {
			outputData[uTokenTag('KVCTemplateTokenBacklinks')] = inputData.KVCBlockTemplateOptions.KVCOptionBacklinks.map(function(e) {
				const outputData = {};
				
				outputData[uTokenTag('KVCTemplateTokenName')] = mod.KVCTemplatePlaintextTitle(e.KVCNoteBody);
				
				outputData[uTokenTag('KVCTemplateTokenURL')] = inputData.KVCBlockPermalinkMap[mod.KVCTemplatePlaintextTitle(e.KVCNoteBody)];
				
				outputData[uTokenTag('KVCTemplateTokenDescription')] = mod.KVCTemplatePlaintextBody(e.KVCNoteBody);

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

	KVCView (showdown, inputData) {
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
		}), mod.KVCTemplateTokensMap(showdown, mod.KVCTemplateRemappedLinks(inputData.KVCViewSource, inputData.KVCViewPermalinkMap), inputData.KVCViewTemplateOptions))
	},

};

export default mod;
