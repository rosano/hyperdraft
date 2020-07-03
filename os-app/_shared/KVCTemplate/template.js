const mod = {

	KVCTemplateViewDefault () {
		return `<!DOCTYPE html>
<html>
<head>
	<title>${ mod.KVCTemplateTokenPostTitle() }</title>
</head>
<body>

<article class="KVCTemplateArticle">

<h1 class="KVCTemplateArticleHeading">${ mod.KVCTemplateTokenPostTitle() }</h1>

<div class="KVCTemplateArticleContent">

${ mod.KVCTemplateTokenPostBody() }

</div>

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
