const mod = {

	KVCTemplateViewDefault () {
		return `<!DOCTYPE html>
<html>
<head>
	<title>${ mod.KVCTemplateTokenPostTitle() }</title>
</head>
<body>

<h1>${ mod.KVCTemplateTokenPostTitle() }</h1>

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
