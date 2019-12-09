<script>
export let WIKWriteDetailDispatchBack;
export let WIKWriteDetailDispatchDiscard;
export let WIKWriteDetailDispatchUpdate;
export let WIKWriteDetailDispatchOpen;
export let OLSKMobileViewInactive = false;

export const WIKWriteDetailSetItem = function (inputData) {
	mod._ValueItem = inputData;

	if (!inputData) {
		return;
	}
	
	mod.ControlConfigureEditor(function (inputData) {
		inputData.WKCWriteEditorSetDocument(mod._ValueItem.WKCNoteBody);
	});
};

export const WIKWriteDetailFocus = function () {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.WKCWriteEditorFocus();
	});
};

export const WIKWriteDetailSetCursor = function (param1, param2) {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.WKCWriteEditorSetCursor(param1, param2);
	});
};

import OLSKInternational from 'OLSKInternational';
export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	_ValueItem: undefined,

	// MESSAGE

	WKCWriteEditorDispatchUpdate (inputData) {
		WIKWriteDetailDispatchUpdate(inputData);
	},

	WKCWriteEditorDispatchOpen (inputData) {
		WIKWriteDetailDispatchOpen(inputData);
	},

	WKCWriteEditorDispatchReady () {
		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod.WKCWriteEditorInstance);
		});
	},

	// VALUE

	_ValueEditorPostInitializeQueue: [],

	// CONTROL

	ControlConfigureEditor (inputData) {
		// console.log(mod.WKCWriteEditorInstance ? 'run' : 'queue', inputData);
		if (mod.WKCWriteEditorInstance) {
			return inputData(mod.WKCWriteEditorInstance);
		};

		mod._ValueEditorPostInitializeQueue.push(inputData);
	},

	// VALUE

	WKCWriteEditorInstance: undefined,

};

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import WKCWriteEditor from '../WKCWriteEditor/main.svelte';
</script>

<div class="WIKWriteDetail OLSKViewportDetail" class:OLSKMobileViewInactive={ OLSKMobileViewInactive }>

{#if !mod._ValueItem}
<div class="WIKWriteDetailPlaceholder OLSKLayoutElementTextVisual">{ OLSKLocalized('WIKWriteDetailPlaceholderText') }</div>
{/if}

{#if mod._ValueItem}
<header class="WIKWriteDetailToolbar">
	<OLSKToolbar OLSKToolbarJustify={ true }>
		<OLSKToolbarElementGroup>
			<button class="WIKWriteDetailToolbarBackButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" on:click={ WIKWriteDetailDispatchBack }>{ OLSKLocalized('WIKWriteDetailToolbarBackButtonText') }</button>
		</OLSKToolbarElementGroup>

		<OLSKToolbarElementGroup>
			<button class="WIKWriteDetailToolbarDiscardButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WIKWriteDetailToolbarDiscardButtonText') } on:click={ () => window.confirm(OLSKLocalized('WIKWriteDetailDiscardPromptText')) && WIKWriteDetailDispatchDiscard(mod._ValueItem) } style="background-image: url('/panel/_shared/ui-assets/wIKWriteDiscard.svg')"></button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<div class="WIKWriteDetailForm">
	<WKCWriteEditor
		WKCWriteEditorDispatchUpdate={ mod.WKCWriteEditorDispatchUpdate }
		WKCWriteEditorDispatchOpen={ mod.WKCWriteEditorDispatchOpen }
		WKCWriteEditorDispatchReady={ mod.WKCWriteEditorDispatchReady }
		bind:this={ mod.WKCWriteEditorInstance }
		/>
</div>
{/if}

</div>

<style>
.WIKWriteDetail {
	/* WIKWriteDetailFlexboxParent */
	display: flex;
	flex-direction: column;
}

.WIKWriteDetailPlaceholder {
	opacity: 0.5;
	text-align: center;

	/* WIKWriteDetailFlexboxChild */
	flex-grow: 1;

	/* WIKWriteDetailPlaceholderFlexboxParent */
	display: flex;
	justify-content: center;
	align-items: center;
}

:global(.OLSKIsLoading) .WIKWriteDetailPlaceholder {
	visibility: hidden;
}

.WIKWriteDetailToolbar {
	border-bottom: var(--WKCBorderStyle);
}

.WIKWriteDetailForm {
	padding: 5px;

	overflow-y: scroll;
}

.WIKWriteDetailForm input[type=text] {
	width: 50%;
	border: var(--WKCBorderStyle);
	border-radius: 5px;
	padding: 5px;
}
</style>
