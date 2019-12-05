exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/WKCWriteFooter',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'WKCWriteFooterStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'), {});
		},
		OLSKRouteLanguages: ['en'],
	}];
};
