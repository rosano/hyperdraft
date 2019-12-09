exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/WKCWriteEditor',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'WKCWriteEditorStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'), {});
		},
		OLSKRouteLanguages: ['en'],
	}];
};
