<script>
export let KVCWriteMasterFilterText;
export let KVCWriteMasterListItems;
export let KVCWriteMasterListItemSelected = null;
export let KVCWriteMasterDispatchCreate;
export let KVCWriteMasterDispatchClick;
export let KVCWriteMasterDispatchArrow;
export let KVCWriteMasterDispatchFilter;
export let KVCWriteMasterDispatchEscape;
export let KVCWriteMasterDispatchExport;
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

	// VALUE

	_ValueFilterFieldFocused: true,

	// DATA

	DataIsFocused () {
		return document.activeElement === document.querySelector('.KVCWriteMasterFilterField');
	},

	DataIsMobile () {
		return window.innerWidth <= 760;
	},

	// INTERFACE

	InterfaceFilterFieldDidInput (event) {
		KVCWriteMasterDispatchFilter(this.value);
	},

	InterfaceCreateButtonDidClick () {
		KVCWriteMasterDispatchCreate();
	},

	InterfaceExportButtonDidClick () {
		KVCWriteMasterDispatchExport();
	},

	InterfaceWindowDidKeydown (event) {
		if (!mod.DataIsFocused()) {
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

		if (KVCWriteMasterListItemSelected && KVCWriteMasterDelegateItemTitle(KVCWriteMasterListItemSelected) === KVCWriteMasterFilterText) {
			return;
		}
		
		return KVCWriteMasterDispatchCreate(`${ KVCWriteMasterFilterText }\n\n`);
	},

	// SETUP

	SetupEverything () {
		mod.SetupFilterFieldEventListeners();
	},

	SetupFilterFieldEventListeners () {
		setTimeout(function () {
			document.querySelector('.KVCWriteMasterFilterField').addEventListener('focus', function () {
				mod._ValueFilterFieldFocused = true;
			});

			document.querySelector('.KVCWriteMasterFilterField').addEventListener('blur', function () {
				mod._ValueFilterFieldFocused = false;
			});
		}, 100);
	},

	// LIFECYCLE

	LifecycleComponentDidMount () {
		mod.SetupEverything();
	},

	LifecycleComponentDidUpdate () {
		if (OLSK_TESTING_BEHAVIOUR()) {
			return;
		}

		if (mod.DataIsMobile()) {
			return;
		}

		const element = document.querySelector('.OLSKResultsListItemSelected');

		element ? element.scrollIntoView(false) : document.querySelector('.KVCWriteMasterBody').scrollTo(0, 0);
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleComponentDidMount);

import { afterUpdate } from 'svelte';
afterUpdate(mod.LifecycleComponentDidUpdate);

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKInputWrapper from 'OLSKInputWrapper';
import _OLSKSharedCreate from '../../../_shared/__external/OLSKUIAssets/_OLSKSharedCreate.svg';
import OLSKResults from 'OLSKResults';
import KVCWriteMasterListItem from '../KVCWriteMasterListItem/main.svelte';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<div class="KVCWriteMaster OLSKViewportMaster" class:OLSKMobileViewInactive={ OLSKMobileViewInactive } class:KVCWriteMasterFocused={ mod._ValueFilterFieldFocused } aria-hidden={ OLSKMobileViewInactive ? true : null }>

<header class="KVCWriteMasterToolbar OLSKMobileViewHeader">
	<OLSKToolbar>
		<OLSKInputWrapper OLSKInputWrapperValue={ KVCWriteMasterFilterText } OLSKInputWrapperDispatchClear={ KVCWriteMasterDispatchEscape } >
			<input class="KVCWriteMasterFilterField" placeholder={ OLSKLocalized('KVCWriteMasterFilterFieldText') } bind:value={ KVCWriteMasterFilterText } on:input={ mod.InterfaceFilterFieldDidInput } />
		</OLSKInputWrapper>

		<OLSKToolbarElementGroup>
			<button class="KVCWriteMasterCreateButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" on:click={ mod.InterfaceCreateButtonDidClick } accesskey="n" title={ OLSKLocalized('KVCWriteMasterCreateButtonText') }>
				<div class="KVCWriteMasterCreateButtonImage">{@html _OLSKSharedCreate }</div>
			</button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<section class="KVCWriteMasterBody OLSKMobileViewBody">
	<OLSKResults
		OLSKResultsListItems={ KVCWriteMasterListItems }
		OLSKResultsListItemSelected={ KVCWriteMasterListItemSelected }
		OLSKResultsDispatchClick={ KVCWriteMasterDispatchClick }
		OLSKResultsDispatchArrow={ (inputData) => mod.DataIsFocused() && KVCWriteMasterDispatchArrow(inputData) }
		let:OLSKResultsListItem={ e }
		>
		<KVCWriteMasterListItem
			KVCWriteMasterListItemAccessibilitySummary={ KVCWriteMasterLogic.KVCWriteMasterTruncatedTitle(KVCWriteMasterDelegateItemTitle(e.KVCNoteBody), true) }
			KVCWriteMasterListItemTitle={ KVCWriteMasterLogic.KVCWriteMasterTruncatedTitle(KVCWriteMasterDelegateItemTitle(e.KVCNoteBody)) }
			KVCWriteMasterListItemSnippet={ KVCWriteMasterDelegateItemSnippet(e.KVCNoteBody) }
			/>
	</OLSKResults>

	<div class="KVCWriteMasterDebug">
		<button class="KVCWriteExportButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" on:click={ mod.InterfaceExportButtonDidClick }>{ OLSKLocalized('WKCUpdateExportText') }</button>
	</div>
</section>

</div>

<style src="./ui-style.css"></style>
