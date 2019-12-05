exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/WKCWriteJumpButton',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction: function(req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteSignature: 'WKCWriteJumpButtonStubRoute',
		OLSKRouteLanguages: ['en'],
		OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
	}];
};
