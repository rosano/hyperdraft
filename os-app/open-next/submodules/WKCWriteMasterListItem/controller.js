exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/WKCWriteMasterListItem',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'WKCWriteMasterListItemStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'), {});
		},
		OLSKRouteLanguages: ['en'],
	}];
};
