<script>
export let WIKWriteDetailDispatchBack;
export let WIKWriteDetailDispatchJump;
export let WIKWriteDetailDispatchPublish;
export let WIKWriteDetailDispatchRetract;
export let WIKWriteDetailDispatchVersions;
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
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	// MESSAGE

	WKCWriteEditorDispatchHeaderTokens (inputData) {
		mod._ValueHeaderTokens = inputData;
	},

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
		WIKWriteDetailDispatchJump(mod._ValueHeaderTokens.map(function (e) {
			return {
				LCHRecipeName: e.string,
				LCHRecipeCallback () {
					mod.WKCWriteEditorInstance.WIKWriteEditorScrollIntoView(e.line, e.start);
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
			<button class="WIKWriteDetailToolbarJumpButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WIKWriteDetailToolbarJumpButtonText') } accesskey="r" tabindex="-1" disabled={ !mod._ValueHeaderTokens.length } on:click={ mod.InterfaceJumpButtonDidClick } style="background-image: url('/panel/_shared/ui-assets/wIKWriteJump.svg')"></button>

			{#if !mod._ValueItem.WKCNotePublishStatusIsPublished }
				<button class="WIKWriteDetailToolbarPublishButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WIKWriteDetailToolbarPublishButtonText') } on:click={ () => WIKWriteDetailDispatchPublish() } style="background-image: url('/panel/_shared/ui-assets/wIKWritePublish.svg')"></button>
			{/if}

			{#if mod._ValueItem.WKCNotePublishStatusIsPublished }
				<a class="WIKWriteDetailToolbarPublicLink" href={ window.OLSKCanonicalFor('WKCRouteRefsRead', {
					wkc_note_public_id: mod._ValueItem.WKCNotePublicID,
				}) } target="_blank">{ OLSKLocalized('WIKWriteDetailToolbarPublicLinkText') }</a>
					
				<button class="WIKWriteDetailToolbarRetractButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WIKWriteDetailToolbarRetractButtonText') } on:click={ () => WIKWriteDetailDispatchRetract() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteRetract.svg')"></button>
			{/if}

			<button class="WIKWriteDetailToolbarVersionsButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WIKWriteDetailToolbarVersionsButtonText') } on:click={ () => WIKWriteDetailDispatchVersions() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteVersions.svg')"></button>

			<button class="WIKWriteDetailToolbarDiscardButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('WIKWriteDetailToolbarDiscardButtonText') } on:click={ () => window.confirm(OLSKLocalized('WIKWriteDetailDiscardPromptText')) && WIKWriteDetailDispatchDiscard() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteDiscard.svg')"></button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<div class="WIKWriteDetailForm">
	<WKCWriteEditor
		WKCWriteEditorDispatchHeaderTokens={ mod.WKCWriteEditorDispatchHeaderTokens }
		WKCWriteEditorDispatchUpdate={ mod.WKCWriteEditorDispatchUpdate }
		WKCWriteEditorDispatchOpen={ mod.WKCWriteEditorDispatchOpen }
		WKCWriteEditorDispatchReady={ mod.WKCWriteEditorDispatchReady }
		bind:this={ mod.WKCWriteEditorInstance }
		/>
</div>
{/if}

</div>

<style src="./ui-style.css"></style>
