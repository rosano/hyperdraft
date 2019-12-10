<script>
export let WKCWriteFooterStorageStatus = '';
export let WKCWriteFooterDispatchStorage;
export let _WKCWriteFooterDispatchExport;
export let _WKCWriteFooterDispatchImport;

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	// INTERFACE

	InterfaceExportButtonDidClick () {
		_WKCWriteFooterDispatchExport();
	},

	InterfaceImportButtonDidClick (event) {
		const inputElement = event.target;
		const fileReader = new FileReader();
		
		fileReader.onload = function (event) {
			_WKCWriteFooterDispatchImport(event.target.result);
			
			inputElement.value = null;
		};

		fileReader.readAsText(event.target.files.item(0));
	},

};

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKReloadButton from '../../../_shared/__external/OLSKReloadButton/main.svelte';
import RCSLanguageSwitcher from '../../../_shared/RCSLanguageSwitcher/main.svelte';
</script>

<footer class="WKCWriteFooter OLSKMobileViewFooter">

	<OLSKToolbar OLSKToolbarJustify={ true }>
		<OLSKToolbarElementGroup>
			<OLSKReloadButton OLSKLocalized={ OLSKLocalized } />
			
			<RCSLanguageSwitcher />

			<a class="WKCWriteFooterDonateLink" href={ window.OLSKPublicConstants('WKC_SHARED_DONATE_URL') } target="_blank">{ OLSKLocalized('WKCWriteFooterDonateLinkText') }</a>

			<button on:click={ mod.InterfaceExportButtonDidClick }>Export</button>

			<input type="file" accept=".json" on:change={ mod.InterfaceImportButtonDidClick } />
		</OLSKToolbarElementGroup>

		<div>
			<div class="WKCWriteFooterStorageStatus">{ WKCWriteFooterStorageStatus }</div>
			<button class="WKCWriteFooterStorageButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" title={ OLSKLocalized('WKCWriteFooterStorageButtonText') } on:click={ WKCWriteFooterDispatchStorage } class:OSWIconVisible={ false }>
				<img class="WKCWriteFooterStorageButtonImage" role="img" src="/open-write/submodules/WKCWriteFooter/ui-assets/WKCWriteFooterStorageButton.svg">
			</button>
		</div>
	</OLSKToolbar>
	
</footer>

<style src="./ui-style.css"></style>
