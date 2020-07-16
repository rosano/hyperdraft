<script>
export let KVCWriteMasterFilterText;
export let KVCWriteMasterListItems;
export let KVCWriteMasterListItemSelected = null;
export let KVCWriteMasterRevealArchiveIsVisible;
export let KVCWriteMasterDispatchCreate;
export let KVCWriteMasterDispatchClick;
export let KVCWriteMasterDispatchArrow;
export let KVCWriteMasterDispatchFilter;
export let KVCWriteMasterDispatchEscape;
export let KVCWriteMasterDispatchRevealArchive;
export let KVCWriteMasterDelegateItemTitle;
export let KVCWriteMasterDelegateItemSnippet;
export let OLSKMobileViewInactive = false;

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting'
import KVCWriteMasterLogic from './ui-logic.js';

const mod = {

	// INTERFACE

	InterfaceCreateButtonDidClick () {
		KVCWriteMasterDispatchCreate();
	},

	InterfaceWindowDidKeydown (event) {
		if (document.activeElement !== document.querySelector('.OLSKMasterListFilterField')) {
			return;
		}

		if (event.key === 'Enter') {
			return mod.InterfaceWindowDidKeydownEnter();
		}
	},

	InterfaceWindowDidKeydownEnter () {
		if (!KVCWriteMasterFilterText.trim().length) {
			return;
		}

		if (KVCWriteMasterListItemSelected && KVCWriteMasterDelegateItemTitle(KVCWriteMasterListItemSelected.KVCNoteBody) === KVCWriteMasterFilterText) {
			return;
		}
		
		return KVCWriteMasterDispatchCreate(`${ KVCWriteMasterFilterText }\n\n`);
	},

};

import OLSKMasterList from 'OLSKMasterList';
import _OLSKSharedCreate from '../_shared/__external/OLSKUIAssets/_OLSKSharedCreate.svg';
import KVCWriteMasterListItem from './submodules/KVCWriteMasterListItem/main.svelte';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<OLSKMasterList
	OLSKMasterListItems={ KVCWriteMasterListItems }
	OLSKMasterListItemSelected={ KVCWriteMasterListItemSelected }
	OLSKMasterListFilterText={ KVCWriteMasterFilterText }
	OLSKMasterListDispatchClick={ KVCWriteMasterDispatchClick }
	OLSKMasterListDispatchArrow={ KVCWriteMasterDispatchArrow }
	OLSKMasterListDispatchFilter={ KVCWriteMasterDispatchFilter }
	let:OLSKResultsListItem={ item }
	OLSKMasterListItemAccessibilitySummaryFor={ (inputData) =>  KVCWriteMasterLogic.KVCWriteMasterTruncatedTitle(KVCWriteMasterDelegateItemTitle(inputData.KVCNoteBody), true) }	
	OLSKMasterListClass={ 'KVCWriteMaster' }
	OLSKMobileViewInactive={ OLSKMobileViewInactive }
	>
	<div slot="OLSKMasterListToolbarTail">
		<div class="OLSKToolbarElementGroup">
			<button class="KVCWriteMasterCreateButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteMasterCreateButtonText') } on:click={ mod.InterfaceCreateButtonDidClick } accesskey="n">
				<div class="KVCWriteMasterCreateButtonImage">{@html _OLSKSharedCreate }</div>
			</button>
		</div>
	</div>

	<KVCWriteMasterListItem
		KVCWriteMasterListItemObject={ item }
		KVCWriteMasterListItemDispatchTitle={ (inputData) => KVCWriteMasterLogic.KVCWriteMasterTruncatedTitle(KVCWriteMasterDelegateItemTitle(inputData)) }
		KVCWriteMasterListItemDispatchSnippet={ (inputData) => KVCWriteMasterDelegateItemSnippet(inputData) }
		/>

	<div class="OLSKMasterListBodyTail" slot="OLSKMasterListBodyTail">{#if KVCWriteMasterRevealArchiveIsVisible }
		<button class="KVCWriteMasterRevealArchiveButton" on:click={ KVCWriteMasterDispatchRevealArchive }>{ OLSKLocalized('KVCWriteMasterRevealArchiveButtonText') }</button>
	{/if}</div>
</OLSKMasterList>	

<style src="./ui-style.css"></style>
