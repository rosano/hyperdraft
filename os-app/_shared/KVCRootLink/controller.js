exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCRootLink',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKExpressLayoutRender(require('path').join(__dirname, 'main'));
		},
		OLSKRouteSignature: 'KVCRootLinkStubRoute',
		OLSKRouteLanguageCodes: ['en'],
		OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
	}];
};
