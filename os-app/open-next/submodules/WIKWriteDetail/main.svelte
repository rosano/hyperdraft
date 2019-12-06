<script>
export let WIKWriteDetailItem = null;
export let WIKWriteDetailDispatchBack;
export let WIKWriteDetailDispatchDiscard;
export let WIKWriteDetailDispatchUpdate;
export let WIKWriteDetailDispatchOpen;
export let OLSKMobileViewInactive = false;

export const WIKWriteDetailFocus = function () {
	mod.WKCEditorInstance.WKCEditorFocus();
};

import OLSKInternational from 'OLSKInternational';
export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	// MESSAGE

	WKCEditorDispatchUpdate (inputData) {
		WIKWriteDetailDispatchUpdate(inputData);
	},

	WKCEditorDispatchOpen (inputData) {
		WIKWriteDetailDispatchOpen(inputData);
	},

	// VALUE

	WKCEditorInstance: undefined,

};

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import WKCEditor from '../WKCEditor/main.svelte';
</script>

<div class="WIKWriteDetail OLSKViewportDetail" class:OLSKMobileViewInactive={ OLSKMobileViewInactive }>

{#if !WIKWriteDetailItem}
<div class="WIKWriteDetailPlaceholder OLSKLayoutElementTextVisual">{ OLSKLocalized('WIKWriteDetailPlaceholderText') }</div>
{/if}

{#if WIKWriteDetailItem}
<header class="WIKWriteDetailToolbar">
	<OLSKToolbar OLSKToolbarJustify={ true }>
		<OLSKToolbarElementGroup>
			<button class="WIKWriteDetailToolbarBackButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" on:click={ WIKWriteDetailDispatchBack }>{ OLSKLocalized('WIKWriteDetailToolbarBackButtonText') }</button>
		</OLSKToolbarElementGroup>

		<OLSKToolbarElementGroup>
			<button class="WIKWriteDetailToolbarDiscardButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" on:click={ () => window.confirm(OLSKLocalized('WIKWriteDetailDiscardPromptText')) && WIKWriteDetailDispatchDiscard(WIKWriteDetailItem) }>{ OLSKLocalized('WIKWriteDetailToolbarDiscardButtonText') }</button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</header>

<div class="WIKWriteDetailForm">
	<WKCEditor WKCEditorInitialValue={ WIKWriteDetailItem.WKCNoteBody } WKCEditorDispatchUpdate={ mod.WKCEditorDispatchUpdate } WKCEditorDispatchOpen={ mod.WKCEditorDispatchOpen } bind:this={ mod.WKCEditorInstance } />
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
