<script>
import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import OLSKString from 'OLSKString';
let titleLabel = function (inputData) {
	return OLSKString.OLSKStringWithFormat(OLSKLocalized('RCSLanguageSwitcherLinkTextFormat'), OLSKLocalized('RCSLanguageSwitcherLinkTextLanguageName')[inputData]);
};
</script>

<section id="RCSLanguageSwitcher">
	{#each window.OLSKPublicConstants('OLSKSharedPageLanguagesAvailable') as e}
		{#if e === window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage') }
			<span>{ e.toUpperCase() }</span>
		{/if}

		{#if e !== window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage') }
			<a aria-label="{ titleLabel(e) }" title="{ titleLabel(e) }" href="{ window.OLSKCanonicalFor(window.OLSKPublicConstants('OLSKSharedActiveRouteConstant'), {
				OLSKRoutingLanguage: e,
			}) }">{ e.toUpperCase() }</a>
		{/if}

	{/each}
</section>
