exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/stub/WIKWriteDetail',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'WIKWriteDetailStubRoute',
		OLSKRouteFunction: function (req, res, next) {
			return res.render(require('path').join(__dirname, 'stub-view'), {});
		},
		OLSKRouteLanguages: ['en'],
	}];
};
