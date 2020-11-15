exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCRootLinkEJS',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKLayoutRender(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteSignature: 'KVCRootLinkEJSStubRoute',
		OLSKRouteLanguages: ['en', 'fr', 'es'],
		OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
	}, {
		OLSKRoutePath: '/stub/KVCRootLinkSvelte',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKLayoutRender(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteSignature: 'KVCRootLinkSvelteStubRoute',
		OLSKRouteLanguages: ['en', 'fr', 'es'],
		OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
	}];
};
