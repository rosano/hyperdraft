<script>
export let WKCWriteMasterFilterText;
export let WKCWriteMasterListItems;
export let WKCWriteMasterListItemSelected = null;
export let WKCWriteMasterDispatchCreate;
export let WKCWriteMasterDispatchClick;
export let WKCWriteMasterDispatchArrow;
export let WKCWriteMasterDispatchFilter;
export let WKCWriteMasterDispatchExport;
export let WKCWriteMasterDelegateItemTitle;
export let WKCWriteMasterDelegateItemBody;
export let OLSKMobileViewInactive = false;

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting'

const mod = {

	// MESSAGE

	InputWrapperDispatchClear () {
		WKCWriteMasterDispatchFilter('');
	},

	// VALUE

	_ValueFilterFieldFocused: true,

	// DATA

	DataIsFocused () {
		return document.activeElement === document.querySelector('.WKCWriteMasterFilterField');
	},

	DataIsMobile () {
		return window.innerWidth <= 760;
	},

	// INTERFACE

	InterfaceFilterFieldDidInput (event) {
		WKCWriteMasterDispatchFilter(this.value);
	},

	InterfaceCreateButtonDidClick () {
		WKCWriteMasterDispatchCreate();
	},

	InterfaceExportButtonDidClick () {
		WKCWriteMasterDispatchExport();
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
		if (!WKCWriteMasterFilterText.trim().length) {
			return;
		}

		if (WKCWriteMasterListItemSelected && WKCWriteMasterDelegateItemTitle(WKCWriteMasterListItemSelected) === WKCWriteMasterFilterText) {
			return;
		}
		
		return WKCWriteMasterDispatchCreate(`${ WKCWriteMasterFilterText }\n\n`);
	},

	// SETUP

	SetupEverything () {
		mod.SetupFilterFieldEventListeners();
	},

	SetupFilterFieldEventListeners () {
		setTimeout(function () {
			document.querySelector('.WKCWriteMasterFilterField').addEventListener('focus', function () {
				mod._ValueFilterFieldFocused = true;
			});

			document.querySelector('.WKCWriteMasterFilterField').addEventListener('blur', function () {
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

		if (!element) {
			return;
		}
		
		element.scrollIntoView({
			block: 'nearest',
			inline: 'nearest',
		});
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleComponentDidMount);

import { afterUpdate } from 'svelte';
afterUpdate(mod.LifecycleComponentDidUpdate);

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKInputWrapper from 'OLSKInputWrapper';
import OLSKResults from 'OLSKResults';
import WKCWriteMasterListItem from '../WKCWriteMasterListItem/main.svelte';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<div class="WKCWriteMaster OLSKViewportMaster" class:OLSKMobileViewInactive={ OLSKMobileViewInactive } class:WKCWriteMasterFocused={ mod._ValueFilterFieldFocused } aria-hidden={ OLSKMobileViewInactive ? true : null }>

<header class="WKCWriteMasterToolbar OLSKMobileViewHeader">
	<OLSKToolbar>
		<OLSKInputWrapper OLSKLocalized={ OLSKLocalized } InputWrapperValue={ WKCWriteMasterFilterText } on:InputWrapperDispatchClear={ mod.InputWrapperDispatchClear } >
			<input class="WKCWriteMasterFilterField" placeholder={ OLSKLocalized('WKCWriteMasterFilterFieldText') } bind:value={ WKCWriteMasterFilterText } on:input={ mod.InterfaceFilterFieldDidInput } />
		</OLSKInputWrapper>

		<OLSKToolbarElementGroup>
			<button class="WKCWriteMasterCreateButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" on:click={ mod.InterfaceCreateButtonDidClick } accesskey="n" title={ OLSKLocalized('WKCWriteMasterCreateButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedCreate.svg')"></button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<section class="WKCWriteMasterBody OLSKMobileViewBody">
	<OLSKResults
		OLSKResultsListItems={ WKCWriteMasterListItems }
		OLSKResultsListItemSelected={ WKCWriteMasterListItemSelected }
		OLSKResultsDispatchClick={ WKCWriteMasterDispatchClick }
		OLSKResultsDispatchArrow={ (inputData) => mod.DataIsFocused() && WKCWriteMasterDispatchArrow(inputData) }
		let:OLSKResultsListItem={ e }
		>
		<WKCWriteMasterListItem
			WKCWriteMasterListItemAccessibilitySummary={ WKCWriteMasterDelegateItemTitle(e.KVCNoteBody, true) }
			WKCWriteMasterListItemTitle={ WKCWriteMasterDelegateItemTitle(e.KVCNoteBody) }
			WKCWriteMasterListItemSnippet={ WKCWriteMasterDelegateItemBody(e.KVCNoteBody) }
			/>
	</OLSKResults>

	<div class="WKCWriteMasterDebug">
		<button class="WKCWriteExportButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" on:click={ mod.InterfaceExportButtonDidClick }>{ OLSKLocalized('WKCUpdateExportText') }</button>
	</div>
</section>

</div>

<style src="./ui-style.css"></style>
