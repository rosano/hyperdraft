const mod = {

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

Object.assign(exports, mod)
