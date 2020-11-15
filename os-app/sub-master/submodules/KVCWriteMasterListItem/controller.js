exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCWriteMasterListItem',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteMasterListItemStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKLayoutRender(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteLanguages: ['en', 'fr', 'es'],
	}];
};
