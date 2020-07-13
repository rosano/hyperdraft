exports.OLSKControllerRoutes = function() {
	return {
		KVCCommonIdentityRedirect: {
			OLSKRoutePath: '/identity.svg',
			OLSKRouteMethod: 'get',
			OLSKRouteRedirect: '/_shared/KVCRootLink/ui-assets/identity.svg',
		},
	};
};

exports.OLSKControllerSharedStaticAssetFolders = function() {
	return [
		'_shared/__external',
	];
};

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		KVCSharedDropboxAppKeyGuardMiddleware (req, res, next) {
			return next(require('./logic.js').KVCSharedDropboxAppKeyGuard(process.env));
		},
		KVCSharedGoogleClientKeyGuardMiddleware (req, res, next) {
			return next(require('./logic.js').KVCSharedGoogleClientKeyGuard(process.env));
		},
		KVCSharedDonateLinkGuardMiddleware (req, res, next) {
			return next(require('./logic.js').KVCSharedDonateLinkGuard(process.env));
		},
		KVCSharedGitHubLinkGuardMiddleware (req, res, next) {
			return next(require('./logic.js').KVCSharedGitHubLinkGuard(process.env));
		},
	};
};