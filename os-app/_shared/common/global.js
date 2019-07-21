import OLSKInternational from 'OLSKInternational';

let localizationDictionary = JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`);

export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary(translationConstant, localizationDictionary[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};
