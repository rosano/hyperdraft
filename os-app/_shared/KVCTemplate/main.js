import * as showdownPackage from 'showdown';
const showdown = showdownPackage.default || showdownPackage;
const showdownConverter = new showdown.Converter();
showdownConverter.setOption('simpleLineBreaks', true);
showdownConverter.setOption('simplifiedAutoLink', true);
showdownConverter.setOption('noHeaderId', true);

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

	KVCTemplateHTML (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return showdownConverter.makeHtml(inputData);
	},

	KVCTemplateHTML (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return showdownConverter.makeHtml(inputData);
	},

	KVCTemplateViewDefault () {
		return `<!DOCTYPE html>
<html>
<head>
	<title>${ mod.KVCTemplateTokenPostTitle() }</title>
</head>
<body>

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

export default mod;
