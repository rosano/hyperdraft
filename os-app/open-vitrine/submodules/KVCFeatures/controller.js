exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCFeatures',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKLayoutRender(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteSignature: 'KVCFeaturesStubRoute',
		OLSKRouteLanguageCodes: ['en'],
	}];
};
