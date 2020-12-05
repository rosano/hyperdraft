exports.OLSKControllerUseLivereload = function() {
	return process.env.NODE_ENV === 'development';
};

exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCVitrineRoute',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKLayoutRender(require('path').join(__dirname, 'ui-view'), {
				KVCVitrineContent: res.OLSKMarkdownContent(require('path').join(__dirname, `text.${ res.locals.OLSKSharedPageCurrentLanguage }.md`), {
					KVC_VITRINE_NV_URL: process.env.KVC_VITRINE_NV_URL,

					KVCVitrineTokenWriteURL: res.locals.OLSKCanonicalLocalizedFor('KVCWriteRoute'),
				}),
				OLSKStringReplaceTokens: require('OLSKString').OLSKStringReplaceTokens,
				IsTestingBehaviour: req.hostname.match('loc.tests'),
			});
		},
		OLSKRouteLanguageCodes: ['en'],
	}];
};
