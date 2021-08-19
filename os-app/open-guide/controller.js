exports.OLSKControllerRoutes = function () {
	return [{
		OLSKRoutePath: '/guide',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCGuideRoute',
		OLSKRouteFunction(req, res, next) {
			return res.OLSKExpressLayoutRender(require('path').join(__dirname, 'ui-view'), {
				KVCGuideContent: res.OLSKMarkdownContent(require('path').join(__dirname, `text.${ res.locals.OLSKSharedPageCurrentLanguage }.md`), {
					KVCWriteRoute: res.locals.OLSKCanonical('KVCWriteRoute'),
					KVCCompareSimplenoteRoute: res.locals.OLSKCanonical('KVCCompareSimplenoteRoute'),
				}),
			});
		},
		_OLSKRouteLanguageCodes: ['en'],
	}];
};
