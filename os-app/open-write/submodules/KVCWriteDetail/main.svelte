<script>
export let KVCWriteDetailDispatchBack;
export let KVCWriteDetailDispatchJump;
export let KVCWriteDetailDispatchPublish;
export let KVCWriteDetailDispatchRetract;
export let KVCWriteDetailDispatchVersions;
export let KVCWriteDetailDispatchDiscard;
export let KVCWriteDetailDispatchUpdate;
export let KVCWriteDetailDispatchOpen;
export let OLSKMobileViewInactive = false;

export const KVCWriteDetailSetItem = function (inputData) {
	mod._ValueItem = inputData;

	if (!inputData) {
		return;
	}
	
	mod.ControlConfigureEditor(function (inputData) {
		inputData.KVCWriteEditorSetValue(mod._ValueItem.KVCNoteBody);
	});

	if (!OLSK_TESTING_BEHAVIOUR()) {
		document.querySelector('body').scrollIntoView(true);
	}
};

export const KVCWriteDetailEditorFocus = function () {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.KVCWriteEditorFocus();
	});
};

export const KVCWriteDetailSetCursor = function (param1, param2) {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.KVCWriteEditorSetCursor(param1, param2);
	});
};

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';

const mod = {

	// MESSAGE

	KVCWriteEditorDispatchHeaderTokens (inputData) {
		mod._ValueHeaderTokens = inputData;
	},

	KVCWriteEditorDispatchUpdate (inputData) {
		KVCWriteDetailDispatchUpdate(inputData);
	},

	KVCWriteEditorDispatchOpen (inputData) {
		KVCWriteDetailDispatchOpen(inputData);
	},

	KVCWriteEditorDispatchReady () {
		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod.KVCWriteEditorInstance);
		});
	},

	// VALUE

	_ValueItem: undefined,

	_ValueHeaderTokens: [],

	_ValueEditorPostInitializeQueue: [],

	KVCWriteEditorInstance: undefined,

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
		// console.log(mod.KVCWriteEditorInstance ? 'run' : 'queue', inputData);
		if (mod.KVCWriteEditorInstance) {
			return inputData(mod.KVCWriteEditorInstance);
		};

		mod._ValueEditorPostInitializeQueue.push(inputData);
	},

	ControlJump () {
		KVCWriteDetailDispatchJump(mod._ValueHeaderTokens.map(function (e) {
			return {
				LCHRecipeName: e.string,
				LCHRecipeCallback () {
					mod.KVCWriteEditorInstance.KVCWriteEditorScrollIntoView(e.line, e.start);
					mod.KVCWriteEditorInstance.KVCWriteEditorSetSelection(e.line, e.start, e.line, e.end);
				},
			};
		}));
	},

};

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKDetailPlaceholder from 'OLSKDetailPlaceholder';
import KVCWriteEditor from '../KVCWriteEditor/main.svelte';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<div class="KVCWriteDetail OLSKViewportDetail" class:OLSKMobileViewInactive={ OLSKMobileViewInactive } aria-hidden={ OLSKMobileViewInactive ? true : null }>

{#if !mod._ValueItem}
<OLSKDetailPlaceholder />
{/if}

{#if mod._ValueItem}
<header class="KVCWriteDetailToolbar OLSKMobileViewHeader">
	<OLSKToolbar OLSKToolbarJustify={ true }>
		<OLSKToolbarElementGroup>
			<button class="KVCWriteDetailToolbarBackButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarBackButtonText') } on:click={ KVCWriteDetailDispatchBack } style="background-image: url('/panel/_shared/ui-assets/wIKWriteBack.svg')"></button>
		</OLSKToolbarElementGroup>

		<OLSKToolbarElementGroup>
			<button class="KVCWriteDetailToolbarJumpButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarJumpButtonText') } accesskey="r" tabindex="-1" disabled={ !mod._ValueHeaderTokens.length } on:click={ mod.InterfaceJumpButtonDidClick } style="background-image: url('/panel/_shared/ui-assets/wIKWriteJump.svg')"></button>

			{#if !mod._ValueItem.KVCNotePublishStatusIsPublished }
				<button class="KVCWriteDetailToolbarPublishButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarPublishButtonText') } on:click={ () => KVCWriteDetailDispatchPublish() } style="background-image: url('/panel/_shared/ui-assets/wIKWritePublish.svg')"></button>
			{/if}

			{#if mod._ValueItem.KVCNotePublishStatusIsPublished }
				<a class="KVCWriteDetailToolbarPublicLink" href={ window.OLSKCanonicalFor('WKCRouteRefsRead', {
					kvc_note_public_id: mod._ValueItem.KVCNotePublicID,
				}) } target="_blank">{ OLSKLocalized('KVCWriteDetailToolbarPublicLinkText') }</a>
					
				<button class="KVCWriteDetailToolbarRetractButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarRetractButtonText') } on:click={ () => KVCWriteDetailDispatchRetract() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteRetract.svg')"></button>
			{/if}

			<button class="KVCWriteDetailToolbarVersionsButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarVersionsButtonText') } on:click={ () => KVCWriteDetailDispatchVersions() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteVersions.svg')"></button>

			<button class="KVCWriteDetailToolbarDiscardButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarDiscardButtonText') } on:click={ () => window.confirm(OLSKLocalized('KVCWriteDetailDiscardPromptText')) && KVCWriteDetailDispatchDiscard() } style="background-image: url('/panel/_shared/ui-assets/wIKWriteDiscard.svg')"></button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<KVCWriteEditor
	KVCWriteEditorDispatchHeaderTokens={ mod.KVCWriteEditorDispatchHeaderTokens }
	KVCWriteEditorDispatchUpdate={ mod.KVCWriteEditorDispatchUpdate }
	KVCWriteEditorDispatchOpen={ mod.KVCWriteEditorDispatchOpen }
	KVCWriteEditorDispatchReady={ mod.KVCWriteEditorDispatchReady }
	bind:this={ mod.KVCWriteEditorInstance }
	/>
{/if}

</div>

<style src="./ui-style.css"></style>
