<script>
export let KVCWriteDetailConnected = false;
export let KVCWriteDetailItemIsRootPage = false;
export let KVCWriteDetailPublicURLFor;
export let KVCWriteDetailDispatchBack;
export let KVCWriteDetailDispatchJump;
export let KVCWriteDetailDispatchArchive;
export let KVCWriteDetailDispatchUnarchive;
export let KVCWriteDetailDispatchConnect;
export let KVCWriteDetailDispatchPublish;
export let KVCWriteDetailDispatchRetract;
export let KVCWriteDetailDispatchVersions;
export let KVCWriteDetailDispatchDiscard;
export let KVCWriteDetailDispatchUpdate;
export let KVCWriteDetailDispatchSetAsRootPage;
export let KVCWriteDetailDispatchOpen;
export let KVCWriteDetailDispatchEscape;
export let OLSKMobileViewInactive = false;
export let _KVCWriteDetailVersionsIsDisabled = false;
export let _DebugLauncher = false;

export const modPublic = {

	KVCWriteDetailSetItem (inputData) {
		mod._ValueItem = inputData;

		if (!inputData) {
			return;
		}
		
		mod.ControlConfigureEditor(function (inputData) {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				document.body.scrollIntoView(true);
			}
		});
	},

	_KVCWriteDetailTriggerUpdate () {
		mod.ControlConfigureEditor(function (inputData) {
			inputData.modPublic._KVCWriteInputTriggerUpdate();
		});
	},

	KVCWriteDetailEditorFocus () {
		mod.ControlConfigureEditor(function (inputData) {
			inputData.modPublic.KVCWriteInputFocus();
		});
	},

	KVCWriteDetailSetCursor (param1, param2) {
		mod.ControlConfigureEditor(function (inputData) {
			inputData.modPublic.KVCWriteInputSetCursor(param1, param2);
		});
	},

	KVCWriteDetailRecipes () {
		return mod._ValueItem ? mod.DataWriteDetailRecipes() : [];
	},

};

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import KVCNoteModel from '../_shared/KVCNote/model.js';
import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';

const mod = {

	// VALUE

	_ValueItem: undefined,

	_ValueHeaderTokens: [],

	_ValueEditorPostInitializeQueue: [],

	KVCWriteInputInstance: undefined,

	// DATA

	DataWriteDetailRecipes () {
		const outputData = [];

		if (mod._ValueItem && !mod._ValueItem.KVCNoteIsArchived) {
			outputData.push({
				LCHRecipeSignature: 'KVCWriteDetailLauncherItemArchive',
				LCHRecipeName: OLSKLocalized('KVCWriteDetailToolbarArchiveButtonText'),
				LCHRecipeCallback: function KVCWriteDetailLauncherItemArchive () {
					KVCWriteDetailDispatchArchive()
				},
			})
		}

		if (mod._ValueItem && mod._ValueItem.KVCNoteIsArchived) {
			outputData.push({
				LCHRecipeSignature: 'KVCWriteDetailLauncherItemUnarchive',
				LCHRecipeName: OLSKLocalized('KVCWriteDetailToolbarUnarchiveButtonText'),
				LCHRecipeCallback: function KVCWriteDetailLauncherItemUnarchive () {
					KVCWriteDetailDispatchUnarchive()
				},
			})
		}

		if (KVCWriteDetailConnected) {
			outputData.push({
				LCHRecipeSignature: 'KVCWriteDetailLauncherItemSetAsRootPage',
				LCHRecipeName: OLSKLocalized('KVCWriteDetailLauncherItemSetAsRootPageText'),
				LCHRecipeCallback: function KVCWriteDetailLauncherItemSetAsRootPage () {
					KVCWriteDetailDispatchSetAsRootPage(mod._ValueItem.KVCNoteID);
				},
			})
		}

		if (OLSK_TESTING_BEHAVIOUR()) {
			outputData.push({
				LCHRecipeName: 'KVCWriteDetailLauncherFakeItemProxy',
				LCHRecipeCallback: function KVCWriteDetailLauncherFakeItemProxy () {},
			});
		}

		return outputData;
	},

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
					mod.KVCWriteInputInstance.modPublic.KVCWriteInputScrollIntoView(e.line, e.start);
					mod.KVCWriteInputInstance.modPublic.KVCWriteInputSetSelection(e.line, e.start, e.line, e.end);
				},
			};
		}));
	},

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

};

import OLSKDetailPlaceholder from 'OLSKDetailPlaceholder';
import _OLSKSharedBack from '../_shared/__external/OLSKUIAssets/_OLSKSharedBack.svg';
import _KVCWriteJump from './ui-assets/_KVCWriteJump.svg';
import _KVCWriteArchive from './ui-assets/_KVCWriteArchive.svg';
import _KVCWriteUnarchive from './ui-assets/_KVCWriteUnarchive.svg';
import _KVCWritePublish from './ui-assets/_KVCWritePublish.svg';
import _KVCWriteRetract from './ui-assets/_KVCWriteRetract.svg';
import _KVCWriteVersions from './ui-assets/_KVCWriteVersions.svg';
import _OLSKSharedDiscard from '../_shared/__external/OLSKUIAssets/_OLSKSharedDiscard.svg';
import KVCWriteInput from '../sub-input/main.svelte';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<div class="KVCWriteDetail OLSKViewportDetail" class:OLSKMobileViewInactive={ OLSKMobileViewInactive } aria-hidden={ OLSKMobileViewInactive ? true : null }>

{#if !mod._ValueItem}
<OLSKDetailPlaceholder />
{/if}

{#if mod._ValueItem}
<header class="KVCWriteDetailToolbar OLSKToolbar OLSKToolbarJustify OLSKMobileViewHeader">
	<div class="OLSKToolbarElementGroup">
		<button class="KVCWriteDetailToolbarBackButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton OLSKVisibilityMobile" title={ OLSKLocalized('KVCWriteDetailToolbarBackButtonText') } on:click={ KVCWriteDetailDispatchBack }>
			<div class="KVCWriteDetailToolbarBackButtonImage">{@html _OLSKSharedBack }</div>
		</button>
	</div>

	<div class="OLSKToolbarElementGroup">
		<button class="KVCWriteDetailToolbarJumpButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarJumpButtonText') } accesskey="r" tabindex="-1" disabled={ !mod._ValueHeaderTokens.length } on:click={ mod.InterfaceJumpButtonDidClick }>
			<div class="KVCWriteDetailToolbarJumpButtonImage">{@html _KVCWriteJump }</div>
		</button>

		{#if !mod._ValueItem.KVCNoteIsArchived }
			<button class="KVCWriteDetailToolbarArchiveButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarArchiveButtonText') } on:click={ KVCWriteDetailDispatchArchive }>
				<div class="KVCWriteDetailToolbarArchiveButtonImage">{@html _KVCWriteArchive }</div>
			</button>
		{/if}

		{#if mod._ValueItem.KVCNoteIsArchived }
			<button class="KVCWriteDetailToolbarUnarchiveButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarUnarchiveButtonText') } on:click={ KVCWriteDetailDispatchUnarchive }>
				<div class="KVCWriteDetailToolbarUnarchiveButtonImage">{@html _KVCWriteUnarchive }</div>
			</button>
		{/if}

		{#if !KVCWriteDetailConnected }
			<button class="KVCWriteDetailToolbarConnectButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarPublishButtonText') } on:click={ () => window.confirm(OLSKLocalized('KVCWriteDetailConnectConfirmText')) && KVCWriteDetailDispatchConnect() }>
				<div class="KVCWriteDetailToolbarConnectButtonImage">{@html _KVCWritePublish }</div>
			</button>
		{/if}

		{#if KVCWriteDetailItemIsRootPage }
			<span class="KVCWriteDetailToolbarIsRootPage">{ OLSKLocalized('KVCWriteDetailToolbarIsRootPageText') }</span>
		{/if}

		{#if KVCWriteDetailConnected }
			{#if !KVCNoteModel.KVCNoteModelIsPublic(mod._ValueItem) }
				<button class="KVCWriteDetailToolbarPublishButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarPublishButtonText') } on:click={ () => KVCWriteDetailDispatchPublish() }>
					<div class="KVCWriteDetailToolbarPublishButtonImage">{@html _KVCWritePublish }</div>
				</button>
			{/if}

			{#if KVCNoteModel.KVCNoteModelIsPublic(mod._ValueItem) }
				<a class="KVCWriteDetailToolbarPublicLink" href={ KVCWriteDetailPublicURLFor(mod._ValueItem) } target="_blank">{ OLSKLocalized('KVCWriteDetailToolbarPublicLinkText') }</a>
					
				<button class="KVCWriteDetailToolbarRetractButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarRetractButtonText') } on:click={ () => KVCWriteDetailDispatchRetract() }>
					<div class="KVCWriteDetailToolbarRetractButtonImage">{@html _KVCWriteRetract }</div>
				</button>
			{/if}
		{/if}

		{#if !_KVCWriteDetailVersionsIsDisabled}
			<button class="KVCWriteDetailToolbarVersionsButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarVersionsButtonText') } on:click={ () => KVCWriteDetailDispatchVersions() }>
				<div class="KVCWriteDetailToolbarVersionsButtonImage">{@html _KVCWriteVersions }</div>
			</button>
		{/if}

		<button class="KVCWriteDetailToolbarDiscardButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteDetailToolbarDiscardButtonText') } on:click={ () => window.confirm(OLSKLocalized('KVCWriteDetailDiscardConfirmText')) && KVCWriteDetailDispatchDiscard() }>
			<div class="KVCWriteDetailToolbarDiscardButtonImage">{@html _OLSKSharedDiscard }</div>
		</button>
	</div>
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

{#if _DebugLauncher && OLSK_TESTING_BEHAVIOUR() }
	<button class="OLSKAppToolbarLauncherButton" on:click={ () => window.Launchlet.LCHSingletonCreate({ LCHOptionRecipes: mod.DataWriteDetailRecipes() }) }></button>	
{/if}

<style src="./ui-style.css"></style>
