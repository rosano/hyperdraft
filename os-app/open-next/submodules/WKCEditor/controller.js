exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/WKCEditor',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'WKCEditorStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'), {});
		},
		OLSKRouteLanguages: ['en'],
	}];
};
