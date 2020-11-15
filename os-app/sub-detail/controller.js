exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCWriteDetail',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteDetailStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKLayoutRender(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteLanguages: ['en', 'fr', 'es'],
	}];
};
