exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCTemplate',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCTemplateStubRoute',
		OLSKRouteFunction (req, res, next) {
			const filePath = require('path').join(__dirname, '__compiled/main.js');
			require('OLSKDisk').OLSKDiskWriteFile(filePath, require('OLSKDisk').OLSKDiskReadFile(require('path').join(__dirname, 'main.js')).replace(`import * as OLSKStringPackage from 'OLSKString'`, `const OLSKStringPackage = require('OLSKString')`).replace('export default mod;', 'Object.assign(exports, mod);'));
			return res.send(require(filePath).KVCTemplateViewDefault(res.locals.OLSKLocalized));
		},
		OLSKRouteLanguages: ['en', 'fr', 'es'],
	}];
};
