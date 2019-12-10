exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCWriteEditor',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteEditorStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'), {});
		},
		OLSKRouteLanguages: ['en'],
	}];
};
