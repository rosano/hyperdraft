<script>
export let KVCWriteDetailDispatchBack;
export let KVCWriteDetailDispatchJump;
export let KVCWriteDetailDispatchPublish;
export let KVCWriteDetailDispatchRetract;
export let KVCWriteDetailDispatchVersions;
export let KVCWriteDetailDispatchDiscard;
export let KVCWriteDetailDispatchUpdate;
export let KVCWriteDetailDispatchOpen;
export let KVCWriteDetailDispatchEscape;
export let OLSKMobileViewInactive = false;
export let _KVCWriteDetailVersionsIsDisabled = false;

export const KVCWriteDetailSetItem = function (inputData) {
	mod._ValueItem = inputData;

	if (!inputData) {
		return;
	}
	
	mod.ControlConfigureEditor(function (inputData) {
		if (!OLSK_TESTING_BEHAVIOUR()) {
			document.querySelector('body').scrollIntoView(true);
		}
	});
};

export const KVCWriteDetailEditorFocus = function () {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.KVCWriteInputFocus();
	});
};

export const KVCWriteDetailSetCursor = function (param1, param2) {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.KVCWriteInputSetCursor(param1, param2);
	});
};

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';

const mod = {

	// MESSAGE

	KVCWriteInputDispatchHeaderTokens (inputData) {
		mod._ValueHeaderTokens = inputData;
	},

	KVCWriteInputDispatchUpdate () {
		KVCWriteDetailDispatchUpdate();
	},

	KVCWriteInputDispatchOpen (inputData) {
		KVCWriteDetailDispatchOpen(inputData);
	},

	KVCWriteInputDispatchReady () {
		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod.KVCWriteInputInstance);
		});
	},

	KVCWriteInputDispatchEscape () {
		KVCWriteDetailDispatchEscape();
	},

	// VALUE

	_ValueItem: undefined,

	_ValueHeaderTokens: [],

	_ValueEditorPostInitializeQueue: [],

	KVCWriteInputInstance: undefined,

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
		// console.log(mod.KVCWriteInputInstance ? 'run' : 'queue', inputData);
		if (mod.KVCWriteInputInstance) {
			return inputData(mod.KVCWriteInputInstance);
		};

		mod._ValueEditorPostInitializeQueue.push(inputData);
	},

	ControlJump () {
		KVCWriteDetailDispatchJump(mod._ValueHeaderTokens.map(function (e) {
			return {
				LCHRecipeName: e.string,
				LCHRecipeCallback () {
					mod.KVCWriteInputInstance.KVCWriteInputScrollIntoView(e.line, e.start);
					mod.KVCWriteInputInstance.KVCWriteInputSetSelection(e.line, e.start, e.line, e.end);
				},
			};
		}));
	},

};

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKDetailPlaceholder from 'OLSKDetailPlaceholder';
import _OLSKSharedBack from '../../../_shared/__external/OLSKUIAssets/_OLSKSharedBack.svg';
import _KVCWriteJump from './ui-assets/_KVCWriteJump.svg';
import _KVCWritePublish from './ui-assets/_KVCWritePublish.svg';
import _KVCWriteRetract from './ui-assets/_KVCWriteRetract.svg';
import _KVCWriteVersions from './ui-assets/_KVCWriteVersions.svg';
import _OLSKSharedDiscard from '../../../_shared/__external/OLSKUIAssets/_OLSKSharedDiscard.svg';
import KVCWriteInput from '../KVCWriteInput/main.svelte';
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
			<button class="KVCWriteDetailToolbarBackButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarBackButtonText') } on:click={ KVCWriteDetailDispatchBack }>
				<div class="KVCWriteDetailToolbarBackButtonImage">{@html _OLSKSharedBack }</div>
			</button>
		</OLSKToolbarElementGroup>

		<OLSKToolbarElementGroup>
			<button class="KVCWriteDetailToolbarJumpButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarJumpButtonText') } accesskey="r" tabindex="-1" disabled={ !mod._ValueHeaderTokens.length } on:click={ mod.InterfaceJumpButtonDidClick }>
				<div class="KVCWriteDetailToolbarJumpButtonImage">{@html _KVCWriteJump }</div>
			</button>

			{#if !mod._ValueItem.KVCNotePublishStatusIsPublished }
				<button class="KVCWriteDetailToolbarPublishButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarPublishButtonText') } on:click={ () => KVCWriteDetailDispatchPublish() }>
					<div class="KVCWriteDetailToolbarPublishButtonImage">{@html _KVCWritePublish }</div>
				</button>
			{/if}

			{#if mod._ValueItem.KVCNotePublishStatusIsPublished }
				<a class="KVCWriteDetailToolbarPublicLink" href={ window.OLSKCanonicalFor('WKCRouteRefsRead', {
					kvc_note_public_id: mod._ValueItem.KVCNotePublicID,
				}) } target="_blank">{ OLSKLocalized('KVCWriteDetailToolbarPublicLinkText') }</a>
					
				<button class="KVCWriteDetailToolbarRetractButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarRetractButtonText') } on:click={ () => KVCWriteDetailDispatchRetract() }>
					<div class="KVCWriteDetailToolbarRetractButtonImage">{@html _KVCWriteRetract }</div>
				</button>
			{/if}

			{#if !_KVCWriteDetailVersionsIsDisabled}
				<button class="KVCWriteDetailToolbarVersionsButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarVersionsButtonText') } on:click={ () => KVCWriteDetailDispatchVersions() }>
					<div class="KVCWriteDetailToolbarVersionsButtonImage">{@html _KVCWriteVersions }</div>
				</button>
			{/if}

			<button class="KVCWriteDetailToolbarDiscardButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarDiscardButtonText') } on:click={ () => window.confirm(OLSKLocalized('KVCWriteDetailDiscardPromptText')) && KVCWriteDetailDispatchDiscard() }>
				<div class="KVCWriteDetailToolbarDiscardButtonImage">{@html _OLSKSharedDiscard }</div>
			</button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<KVCWriteInput
	KVCWriteInputItem={ mod._ValueItem }
	KVCWriteInputKey={ 'KVCNoteBody' }
	KVCWriteInputDispatchHeaderTokens={ mod.KVCWriteInputDispatchHeaderTokens }
	KVCWriteInputDispatchUpdate={ mod.KVCWriteInputDispatchUpdate }
	KVCWriteInputDispatchOpen={ mod.KVCWriteInputDispatchOpen }
	KVCWriteInputDispatchReady={ mod.KVCWriteInputDispatchReady }
	KVCWriteInputDispatchEscape={ mod.KVCWriteInputDispatchEscape }
	bind:this={ mod.KVCWriteInputInstance }
	/>
{/if}

</div>

<style src="./ui-style.css"></style>
