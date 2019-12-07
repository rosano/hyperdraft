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
export let OLSKMobileViewInactive = false;

import OLSKInternational from 'OLSKInternational';
export const OLSKLocalized = function(translationConstant) {
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
		if (document.activeElement !== document.querySelector('.WKCWriteMasterFilterField')) {
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
		
		const element = document.querySelector('.WKCWriteMasterListItemSelected');

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
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<div class="WKCWriteMaster OLSKViewportMaster" class:OLSKMobileViewInactive={ OLSKMobileViewInactive } class:WKCWriteMasterFocused={ mod._ValueFilterFieldFocused }>

<header class="WKCWriteMasterToolbar OLSKMobileViewHeader">
	<OLSKToolbar>
		<OLSKInputWrapper OLSKLocalized={ OLSKLocalized } InputWrapperValue={ WKCWriteMasterFilterText } on:InputWrapperDispatchClear={ mod.InputWrapperDispatchClear } >
			<input class="WKCWriteMasterFilterField" placeholder={ OLSKLocalized('WKCWriteMasterFilterFieldText') } bind:value={ WKCWriteMasterFilterText } on:input={ mod.InterfaceFilterFieldDidInput } />
		</OLSKInputWrapper>

		<OLSKToolbarElementGroup>
			<button class="WKCWriteMasterCreateButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" on:click={ mod.InterfaceCreateButtonDidClick } accesskey="n">{ OLSKLocalized('WKCWriteMasterCreateButtonText') }</button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<section class="WKCWriteMasterBody OLSKMobileViewBody">
	<OLSKResults OLSKResultsListItems={ WKCWriteMasterListItems } OLSKResultsListItemSelected={ WKCWriteMasterListItemSelected } OLSKResultsDispatchClick={ WKCWriteMasterDispatchClick } OLSKResultsDispatchArrow={ WKCWriteMasterDispatchArrow } let:OLSKResultsListItem={ e } >
		<div class="WKCWriteMasterListItem">
			<strong>{ e.WKCNoteBody }</strong>
		</div>
	</OLSKResults>

	<div class="WKCWriteMasterDebug">
		<button class="WKCWriteExportButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" on:click={ mod.InterfaceExportButtonDidClick }>{ OLSKLocalized('WKCUpdateExportText') }</button>
	</div>
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

.WKCWriteMasterListItemSelected {
	background: #e6e6e6;
}

.WKCWriteMasterDebug {
	padding: 5px;
}
</style>
