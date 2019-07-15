<script>
import WKCNotesAction from '../../_shared/rs-modules/wkc_notes/action.js';
import WKCWriteLogic from '../open-write/ui-logic.js';

import { storageClient, notesAll, noteSelected, filterText } from './persistence.js';

async function noteCreate() {
	let item = await WKCNotesAction.WKCNotesActionCreate(storageClient, {
		WKCNoteBody: '',
	});

	notesAll.update(function (val) {
		return val.concat(item).sort(WKCWriteLogic.WKCWriteLogicSort);
	});

	return noteSelect(item);
}

async function noteSelect(inputData) {
	return noteSelected.set(inputData);
}

let notesVisible = []

$: notesVisible = $notesAll.filter(function (e) {
	return e.WKCNoteBody.toLowerCase().match($filterText.toLowerCase());
});

</script>

<div class="Container WKC_ContextMobileView WKC_ContextMobileViewActive">

<header class="WKCSharedToolbar">
	<input bind:value={ $filterText } placeholder="{ OLSKLocalized('WKCWriteMasterToolbarFilterInputPlaceholderText') }" accesskey="f" id="WIKDefaultFocusNode" autofocus />

	<div class="WKCSharedToolbarElementGroup">
		<button on:click={ noteCreate } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" title={ window.OLSKLocalized('WKCWriteMasterToolbarCreateButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedCreate.svg')" accesskey="n"></button>
	</div>
</header>
<div class="List">
	{#each notesVisible as e}
		<div on:click={ () => noteSelect(e) } class="ListItem WKCSharedElementTappable">
			<strong>{ e.WKCNoteBody }</strong>
		</div>
	{/each}
</div>

</div>

<style>
.Container {
	/* AppContentContainerFlexboxChild */
	flex-basis: 300px;
	flex-shrink: 0;

	/* ContainerFlexboxParent */
	display: flex;
	flex-direction: column;
}

header {
	border-right: var(--WIKBorderStyle);
}

input {
	height: 14px;
	padding: 4px;
	margin: 0;
	border: 1px solid #e6e6e6;
	border-radius: 10px;

	font-size: 80%;
	text-indent: 2px;
	line-height: 1.4;

	/* WKCSharedToolbarFlexboxChild */
	flex-grow: 1;
}

.List {
	border-right: var(--WIKBorderStyle);

	/* ContainerFlexboxChild */
	flex-grow: 1;
	overflow: auto;
}

.ListItem {
	min-height: 40px;
	padding: 5px;
	border-bottom: var(--WIKBorderStyle)
}
</style>
