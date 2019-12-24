exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCWriteInput',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteInputStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'));
		},
	}];
};
