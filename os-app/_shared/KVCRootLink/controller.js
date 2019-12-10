exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCRootLink',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction: function(req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteSignature: 'KVCRootLinkStubRoute',
		OLSKRouteLanguages: ['en'],
		OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
	}];
};
