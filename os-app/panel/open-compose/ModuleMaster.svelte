<script>
import WKCNotesAction from '../../_shared/rs-modules/wkc_notes/action.js';
import * as WKCWriteLogic from '../open-write/ui-logic.js';

import { storageClient, notesAll, noteSelected } from './persistence.js';

async function noteCreate() {
	let item = await WKCNotesAction.WKCNotesActionCreate(storageClient, {
		WKCNoteBody: '',
	});

	notesAll.update(function (val) {
		return val.concat(item).sort(WKCWriteLogic.default.WKCWriteLogicSort);
	});

	return noteSelect(item);
}

async function noteSelect(inputData) {
	return noteSelected.set(inputData);
}
</script>

<div class="Container WKC_ContextMobileView WKC_ContextMobileViewActive">

<header class="WIKSharedToolbar">
	<button on:click={ noteCreate } class="WKCSharedButtonNoStyle" accesskey="n">{ window.OLSKLocalized('WKCWriteMasterToolbarCreateButtonText') }</button>
</header>
<div class="List">
	{#each $notesAll as e}
		<div on:click={ () => noteSelect(e) } class="ListItem WKCSharedElementTappable">
			<strong>{ e.WKCNoteName || e.WKCNoteSignature || e.WKCNoteID }</strong>
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

.WIKSharedToolbar {
	border-right: var(--WIKBorderStyle);
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
