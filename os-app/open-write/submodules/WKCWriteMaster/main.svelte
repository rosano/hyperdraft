<script>
export let WKCWriteMasterListItems;
export let WKCWriteMasterListItemSelected = null;
export let WKCWriteMasterDispatchCreate;
export let WKCWriteMasterDispatchSelect;
export let OLSKMobileViewInactive = false;

import OLSKInternational from 'OLSKInternational';
export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
</script>

<div class="WKCWriteMaster OLSKViewportMaster" class:OLSKMobileViewInactive={ OLSKMobileViewInactive }>

<header class="WKCWriteMasterToolbar OLSKMobileViewHeader">
	<OLSKToolbar>
		<OLSKToolbarElementGroup>
			<button class="WKCWriteMasterCreateButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" on:click={ WKCWriteMasterDispatchCreate } accesskey="n">{ OLSKLocalized('WKCWriteMasterCreateButtonText') }</button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<section class="WKCWriteMasterBody OLSKMobileViewBody">
	{#each WKCWriteMasterListItems as e}
		<div class="WKCWriteMasterListItem OLSKLayoutElementTappable" class:WKCWriteMasterListItemSelected={ (WKCWriteMasterListItemSelected || {}).WKCDocumentID === e.WKCDocumentID } on:click={ () => WKCWriteMasterDispatchSelect(e) } >
			<strong>{ e.WKCDocumentName || e.WKCDocumentID }</strong>
		</div>
	{/each}
</section>

</div>

<style>
.WKCWriteMaster {
	border-right: var(--WKCBorderStyle);

	/* WKCWriteMasterFlexboxParent */
	display: flex;
	flex-direction: column;
}

.WKCWriteMasterToolbar {
	border-bottom: var(--WKCBorderStyle);
}

.WKCWriteMasterBody {
	overflow: auto;
	
	/* WKCWriteMasterFlexboxChild */
	flex-grow: 1;
}

.WKCWriteMasterListItem {
	min-height: 40px;
	padding: 5px;
	border-bottom: var(--WKCBorderStyle);
}

.WKCWriteMasterListItem:last-of-type {
	border-bottom: none;
}
</style>
