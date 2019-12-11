<script>
export let KVCWriteFooterStorageStatus = '';
export let KVCWriteFooterDispatchStorage;
export let _KVCWriteFooterDispatchExport;
export let _KVCWriteFooterDispatchImport;

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	// INTERFACE

	InterfaceExportButtonDidClick () {
		_KVCWriteFooterDispatchExport();
	},

	InterfaceImportButtonDidClick (event) {
		const inputElement = event.target;
		const fileReader = new FileReader();
		
		fileReader.onload = function (event) {
			_KVCWriteFooterDispatchImport(event.target.result);
			
			inputElement.value = null;
		};

		fileReader.readAsText(event.target.files.item(0));
	},

};

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKReloadButton from '../../../_shared/__external/OLSKReloadButton/main.svelte';
import OLSKLanguageSwitcher from '../../../_shared/__external/OLSKLanguageSwitcher/main.svelte';
</script>

<footer class="KVCWriteFooter OLSKMobileViewFooter">

	<OLSKToolbar OLSKToolbarJustify={ true }>
		<OLSKToolbarElementGroup>
			<OLSKReloadButton OLSKLocalized={ OLSKLocalized } />
			
			<OLSKLanguageSwitcher OLSKSharedActiveRouteConstant={ window.OLSKPublicConstants('OLSKSharedActiveRouteConstant') }
				OLSKSharedPageLanguagesAvailable={ window.OLSKPublicConstants('OLSKSharedPageLanguagesAvailable') }
				OLSKSharedPageCurrentLanguage={ window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage') }
				/>

			<a class="KVCWriteFooterDonateLink" href={ window.OLSKPublicConstants('KVC_SHARED_DONATE_URL') } target="_blank">{ OLSKLocalized('KVCWriteFooterDonateLinkText') }</a>

			<!-- <button on:click={ mod.InterfaceExportButtonDidClick }>Export</button>

			<input type="file" accept=".json" on:change={ mod.InterfaceImportButtonDidClick } /> -->
		</OLSKToolbarElementGroup>

		<div>
			<div class="KVCWriteFooterStorageStatus">{ KVCWriteFooterStorageStatus }</div>
			<button class="KVCWriteFooterStorageButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" title={ OLSKLocalized('KVCWriteFooterStorageButtonText') } on:click={ KVCWriteFooterDispatchStorage } class:OSWIconVisible={ false }>
				<img class="KVCWriteFooterStorageButtonImage" role="presentation" src="/open-write/submodules/KVCWriteFooter/ui-assets/KVCWriteFooterStorageButton.svg">
			</button>
		</div>
	</OLSKToolbar>
	
</footer>

<style src="./ui-style.css"></style>
