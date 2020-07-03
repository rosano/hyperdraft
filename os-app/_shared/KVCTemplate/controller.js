exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/KVCTemplate',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCTemplateStubRoute',
		OLSKRouteFunction (req, res, next) {
			return res.send(require('./template.js').KVCTemplateViewDefault());
		},
	}];
};
