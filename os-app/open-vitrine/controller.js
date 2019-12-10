exports.OLSKControllerUseLivereload = function() {
	return process.env.NODE_ENV === 'development';
};

exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/vitrine',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCVitrineRoute',
		OLSKRouteFunction: function (req, res, next) {
			return res.render(require('path').join(__dirname, 'ui-view'), {
				KVCVitrineContent: require('OLSKString').OLSKStringReplaceTokens(require('marked').setOptions({
					gfm: true,
					headerIds: false,
				})(require('fs').readFileSync(require('path').join(__dirname, `text.${ res.locals.OLSKSharedPageCurrentLanguage }.md`), 'utf-8')), {
					KVC_SHARED_GITHUB_URL: process.env.KVC_SHARED_GITHUB_URL,
					KVCVitrineDescription: res.locals.OLSKLocalized('KVCVitrineDescription'),
				}),
				OLSKStringReplaceTokens: require('OLSKString').OLSKStringReplaceTokens,
			});
		},
		OLSKRouteLanguages: ['en'],
		OLSKRouteMiddlewares: [
			'KVCSharedGitHubLinkGuardMiddleware',
		],
	}];
};
