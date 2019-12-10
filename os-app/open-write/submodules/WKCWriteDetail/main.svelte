<script>
export let WKCWriteDetailDispatchBack;
export let WKCWriteDetailDispatchJump;
export let WKCWriteDetailDispatchPublish;
export let WKCWriteDetailDispatchRetract;
export let WKCWriteDetailDispatchVersions;
export let WKCWriteDetailDispatchDiscard;
export let WKCWriteDetailDispatchUpdate;
export let WKCWriteDetailDispatchOpen;
export let OLSKMobileViewInactive = false;

export const WKCWriteDetailSetItem = function (inputData) {
	mod._ValueItem = inputData;

	if (!inputData) {
		return;
	}
	
	mod.ControlConfigureEditor(function (inputData) {
		inputData.WKCWriteEditorSetValue(mod._ValueItem.KVCNoteBody);
	});

	if (!OLSK_TESTING_BEHAVIOUR()) {
		document.querySelector('body').scrollIntoView(true);
	}
};

export const WKCWriteDetailEditorFocus = function () {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.WKCWriteEditorFocus();
	});
};

export const WKCWriteDetailSetCursor = function (param1, param2) {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.WKCWriteEditorSetCursor(param1, param2);
	});
};

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';

const mod = {

	// MESSAGE

	WKCWriteEditorDispatchHeaderTokens (inputData) {
		mod._ValueHeaderTokens = inputData;
	},

	WKCWriteEditorDispatchUpdate (inputData) {
		WKCWriteDetailDispatchUpdate(inputData);
	},

	WKCWriteEditorDispatchOpen (inputData) {
		WKCWriteDetailDispatchOpen(inputData);
	},

	WKCWriteEditorDispatchReady () {
		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod.WKCWriteEditorInstance);
		});
	},

	// VALUE

	_ValueItem: undefined,

	_ValueHeaderTokens: [],

	_ValueEditorPostInitializeQueue: [],

	WKCWriteEditorInstance: undefined,

	// INTERFACE

	InterfaceJumpButtonDidClick () {
		mod.ControlJump();
	},

	InterfaceWindowDidKeydown (event) {
		if (!mod._ValueHeaderTokens.length) {
			return;
		}

		if (event.ctrlKey && event.key === 'r') {
			return mod.ControlJump();
		}
	},

	// CONTROL

	ControlConfigureEditor (inputData) {
		// console.log(mod.WKCWriteEditorInstance ? 'run' : 'queue', inputData);
		if (mod.WKCWriteEditorInstance) {
			return inputData(mod.WKCWriteEditorInstance);
		};

		mod._ValueEditorPostInitializeQueue.push(inputData);
	},

	ControlJump () {
		WKCWriteDetailDispatchJump(mod._ValueHeaderTokens.map(function (e) {
			return {
				LCHRecipeName: e.string,
				LCHRecipeCallback () {
					mod.WKCWriteEditorInstance.WKCWriteEditorScrollIntoView(e.line, e.start);
					mod.WKCWriteEditorInstance.WKCWriteEditorSetSelection(e.line, e.start, e.line, e.end);
				},
			};
		}));
	},

};

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import WKCWriteEditor from '../WKCWriteEditor/main.svelte';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<div class="WKCWriteDetail OLSKViewportDetail" class:OLSKMobileViewInactive={ OLSKMobileViewInactive } aria-hidden={ OLSKMobileViewInactive ? true : null }>

{#if !mod._ValueItem}
<div class="WKCWriteDetailPlaceholder OLSKLayoutElementTextVisual">{ OLSKLocalized('WKCWriteDetailPlaceholderText') }</div>
{/if}

{#if mod._ValueItem}
<header class="WKCWriteDetailToolbar OLSKMobileViewHeader">
	<OLSKToolbar OLSKToolbarJustify={ true }>
		<OLSKToolbarElementGroup>
			<button class="WKCWriteDetailToolbarBackButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WKCWriteDetailToolbarBackButtonText') } on:click={ WKCWriteDetailDispatchBack } style="background-image: url('/panel/_shared/ui-assets/wIKWriteBack.svg')"></button>
		</OLSKToolbarElementGroup>

		<OLSKToolbarElementGroup>
			<button class="WKCWriteDetailToolbarJumpButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WKCWriteDetailToolbarJumpButtonText') } accesskey="r" tabindex="-1" disabled={ !mod._ValueHeaderTokens.length } on:click={ mod.InterfaceJumpButtonDidClick } style="background-image: url('/panel/_shared/ui-assets/wIKWriteJump.svg')"></button>

			{#if !mod._ValueItem.KVCNotePublishStatusIsPublished }
				<button class="WKCWriteDetailToolbarPublishButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WKCWriteDetailToolbarPublishButtonText') } on:click={ () => WKCWriteDetailDispatchPublish() } style="background-image: url('/panel/_shared/ui-assets/wIKWritePublish.svg')"></button>
			{/if}

			{#if mod._ValueItem.KVCNotePublishStatusIsPublished }
				<a class="WKCWriteDetailToolbarPublicLink" href={ window.OLSKCanonicalFor('WKCRouteRefsRead', {
					wkc_note_public_id: mod._ValueItem.KVCNotePublicID,
				}) } target="_blank">{ OLSKLocalized('WKCWriteDetailToolbarPublicLinkText') }</a>
					
				<button class="WKCWriteDetailToolbarRetractButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WKCWriteDetailToolbarRetractButtonText') } on:click={ () => WKCWriteDetailDispatchRetract() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteRetract.svg')"></button>
			{/if}

			<button class="WKCWriteDetailToolbarVersionsButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WKCWriteDetailToolbarVersionsButtonText') } on:click={ () => WKCWriteDetailDispatchVersions() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteVersions.svg')"></button>

			<button class="WKCWriteDetailToolbarDiscardButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WKCWriteDetailToolbarDiscardButtonText') } on:click={ () => window.confirm(OLSKLocalized('WKCWriteDetailDiscardPromptText')) && WKCWriteDetailDispatchDiscard() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteDiscard.svg')"></button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<WKCWriteEditor
	WKCWriteEditorDispatchHeaderTokens={ mod.WKCWriteEditorDispatchHeaderTokens }
	WKCWriteEditorDispatchUpdate={ mod.WKCWriteEditorDispatchUpdate }
	WKCWriteEditorDispatchOpen={ mod.WKCWriteEditorDispatchOpen }
	WKCWriteEditorDispatchReady={ mod.WKCWriteEditorDispatchReady }
	bind:this={ mod.WKCWriteEditorInstance }
	/>
{/if}

</div>

<style src="./ui-style.css"></style>
