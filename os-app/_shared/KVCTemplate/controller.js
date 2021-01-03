exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCTemplate',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCTemplateStubRoute',
		OLSKRouteFunction (req, res, next) {
			const filePath = require('path').join(__dirname, '__compiled/main.js');
			require('OLSKDisk').OLSKDiskWriteFile(filePath, Object.entries({
				[`import OLSKString from 'OLSKString'`]: `const OLSKString = require('OLSKString')`,
				[`import marked from 'marked'`]: `const marked = require('marked')`,
				[`import escapeRegExp from 'escape-string-regexp'`]: `const escapeRegExp = require('escape-string-regexp')`,
				'export default mod;': 'Object.assign(exports, mod);',
			}).reduce(function (coll, [search, replace]) {
				return require('OLSKString').OLSKStringPatch(
					coll, search, replace);
			}, require('OLSKDisk').OLSKDiskReadFile(require('path').join(__dirname, 'main.js'))));
			return res.send(require(filePath).KVCTemplateViewDefault(res.locals.OLSKLocalized));
		},
		OLSKRouteLanguageCodes: ['en', 'fr', 'es'],
	}];
};
