<script>
export let WKCWriteMasterListItems;
export let WKCWriteMasterListItemSelected = null;
export let WKCWriteMasterDispatchCreate;
export let WKCWriteMasterDispatchSelect;
export let WKCWriteMasterDelegateItemTitle;
export let OLSKMobileViewInactive = false;

import OLSKInternational from 'OLSKInternational';
export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting'

const mod = {

	// VALUE

	_ValueFilterFieldFocused: true,

	_ValueFilterFieldText: '',

	// DATA

	DataIsMobile () {
		return window.innerWidth <= 760;
	},

	// INTERFACE

	InterfaceWindowDidKeydown (event) {
		if (document.activeElement !== document.querySelector('.WKCWriteMasterFilterField')) {
			return;
		}

		if (event.key === 'Enter') {
			return mod.CommandCreateStub();
		}
	},

	// COMMAND

	CommandCreateStub () {
		if (!mod._ValueFilterFieldText.trim().length) {
			return;
		}

		if (WKCWriteMasterListItemSelected && WKCWriteMasterDelegateItemTitle(WKCWriteMasterListItemSelected) === mod._ValueFilterFieldText) {
			return;
		}

		return WKCWriteMasterDispatchCreate(`${ mod._ValueFilterFieldText }\n\n`);
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
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<div class="WKCWriteMaster OLSKViewportMaster" class:OLSKMobileViewInactive={ OLSKMobileViewInactive } class:WKCWriteMasterFocused={ mod._ValueFilterFieldFocused }>

<header class="WKCWriteMasterToolbar OLSKMobileViewHeader">
	<OLSKToolbar>
		<OLSKInputWrapper OLSKLocalized={ OLSKLocalized }>
			<input class="WKCWriteMasterFilterField" placeholder={ OLSKLocalized('WKCWriteMasterFilterFieldText') } bind:value={ mod._ValueFilterFieldText } />
		</OLSKInputWrapper>

		<OLSKToolbarElementGroup>
			<button class="WKCWriteMasterCreateButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" on:click={ WKCWriteMasterDispatchCreate } accesskey="n">{ OLSKLocalized('WKCWriteMasterCreateButtonText') }</button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<section class="WKCWriteMasterBody OLSKMobileViewBody">
	{#each WKCWriteMasterListItems as e}
		<div class="WKCWriteMasterListItem OLSKLayoutElementTappable" class:WKCWriteMasterListItemSelected={ WKCWriteMasterListItemSelected === e } on:click={ () => WKCWriteMasterDispatchSelect(e) } >
			<strong>{ e.WKCNoteBody }</strong>
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

.WKCWriteMasterListItemSelected {
	background: #e6e6e6;
}
</style>
