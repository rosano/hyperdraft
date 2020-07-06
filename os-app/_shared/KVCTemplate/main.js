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

	KVCTemplateReplaceLinks (param1, param2) {
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

	KVCTemplateReplaceTokens (showdown, inputData) {
		if (typeof showdown.Converter !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}
		
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return [
			[mod.KVCTemplateTokenPostTitle(), mod.KVCTemplatePlaintextTitle(inputData)],
			[mod.KVCTemplateTokenPostBody(), mod.KVCTemplateHTML(showdown, mod.KVCTemplatePlaintextBody(inputData))],
		].reduce(function (coll, item) {
			coll[item.shift()] = item.pop();

			return coll;
		}, {});
	},

	KVCTemplateSubstitutePublicLinks (param1, param2) {
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

		KVCTemplateViewDefault () {
			return `<!DOCTYPE html>
	<html>
	<head>
		<title>${ mod.KVCTemplateTokenPostTitle() }</title>
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
	</head>
	<body class="KVCBox">

	<h1 class="KVCArticleTitle">${ mod.KVCTemplateTokenPostTitle() }</h1>

	<article class="KVCArticleBody">

	${ mod.KVCTemplateTokenPostBody() }

	</article>

	</body>
	</html>`;
		},

		KVCTemplateTokenPostTitle () {
			return '{Title}';
		},

		KVCTemplateTokenPostBody () {
			return '{Body}';
		},

};

Object.assign(exports, mod);
