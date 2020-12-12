exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCFeatureList',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKLayoutRender(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteSignature: 'KVCFeatureListStubRoute',
		OLSKRouteLanguageCodes: ['en'],
	}];
};
