exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/write',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteRoute',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKExpressLayoutRender(require('path').join(__dirname, 'ui-view.ejs'));
		},
		OLSKRouteLanguageCodes: ['en', 'fr', 'es', 'pt'],
		_OLSKRouteSkipLanguageRedirect: true,
	}, {
		OLSKRoutePath: '/panel/write',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteLegacyRoute',
		OLSKRouteRedirect: '/write',
	}];
};
