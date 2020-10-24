exports.OLSKControllerUseLivereload = function() {
	return process.env.NODE_ENV === 'development';
};

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		KVCVitrineRouteGuardMiddleware (req, res, next) {
			return next(require('./logic.js').KVCVitrineRouteGuard(process.env));
		},
	};
};

exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCVitrineRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'ui-view'), {
				KVCVitrineContent: require('OLSKString').OLSKStringReplaceTokens(require('marked').setOptions({
					gfm: true,
					headerIds: false,
				})(require('fs').readFileSync(require('path').join(__dirname, `text.${ res.locals.OLSKSharedPageCurrentLanguage }.md`), 'utf-8')), {
					KVCVitrineDescription: res.locals.OLSKLocalized('KVCVitrineDescription'),
					KVC_VITRINE_NV_URL: process.env.KVC_VITRINE_NV_URL,
					KVCVitrineContentAppButtonText: res.locals.OLSKLocalized('KVCVitrineContentAppButtonText'),
					KVCVitrineTokenWriteURL: res.locals.OLSKCanonicalLocalizedFor('KVCWriteRoute'),
					KVC_SHARED_GITHUB_URL: process.env.KVC_SHARED_GITHUB_URL,
					KVC_SHARED_DONATE_URL: process.env.KVC_SHARED_DONATE_URL,
				}),
				OLSKStringReplaceTokens: require('OLSKString').OLSKStringReplaceTokens,
				IsTestingBehaviour: req.hostname.match('loc.tests'),
			});
		},
		OLSKRouteLanguages: ['en'],
		OLSKRouteMiddlewares: [
			'KVCVitrineRouteGuardMiddleware',
			'KVCSharedDonateLinkGuardMiddleware',
			'KVCSharedGitHubLinkGuardMiddleware',
		],
	}];
};
