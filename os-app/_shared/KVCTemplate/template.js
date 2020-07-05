const mod = {

	KVCTemplateViewDefault () {
		return `<!DOCTYPE html>
<html>
<head>
	<title>${ mod.KVCTemplateTokenPostTitle() }</title>
</head>
<body>

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
