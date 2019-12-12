exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCWriteFooter',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteFooterStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteLanguages: ['en'],
	}];
};
