<script>
import WKCNotesAction from '../../_shared/rs-modules/wkc_notes/action.js';

import { storageClient, notesAll, noteSelected } from './persistence.js';

let editorInstance;
let editorInitializeValue = function () {
	editorInstance.setValue($noteSelected.WKCNoteBody);
	editorInstance.getDoc().clearHistory();
}

let _noteSelected;
noteSelected.subscribe(function (val) {
	if (val && (val !== _noteSelected)) {
		document.querySelector('input').focus();

		_noteSelected = val;
	}

	if (!val) {
		editorInstance = null;

		return;
	}

	if (!editorInstance) {
		return;
	}

	editorInitializeValue();
});

let editorElement;
import { afterUpdate } from 'svelte';
afterUpdate(function () {
	if (!editorElement) {
		return;
	}

	if (editorInstance) {
		return;
	}

	editorInstance = CodeMirror.fromTextArea(editorElement, {
		mode: 'javascript',

		lineNumbers: true,
		lineWrapping: true,

		placeholder: window.OLSKLocalized('WIKComposeListItemFormInputFunctionBodyPlaceholder'),
		
	  keyMap: 'sublime',
	});

	editorInitializeValue();

	editorInstance.on('change', function (instance, changeObject) {
		if (changeObject.origin === 'setValue') {
			return;
		}

		Object.assign($noteSelected, {
			WKCNoteBody: instance.getValue(),
		}); // @DependancySvelteIgnoresMutableChanges

		noteSave();
	});
});

let throttleMap = {};
import * as OLSKThrottle from '../../_shared/_external/OLSKThrottle/main.js';
async function noteSave() {
	notesAll.update(function (val) {
		return val;
	});

	if (!throttleMap[$noteSelected.WKCNoteID]) {
		throttleMap[$noteSelected.WKCNoteID] = {
			OLSKThrottleDuration: 500,
			OLSKThrottleCallback: async function () {
				delete throttleMap[$noteSelected.WKCNoteID];

				await WKCNotesAction.WKCNotesActionUpdate(storageClient, $noteSelected);
			},
		};	
	}

	OLSKThrottle.default.OLSKThrottleTimeoutFor(throttleMap[$noteSelected.WKCNoteID]);
}

async function noteDelete() {
	if (!window.confirm(OLSKLocalized('WIKComposeListItemDeletePromptText'))) {
		return;
	}

	notesAll.update(function (val) {
		return val.filter(function(e) {
			return e !== $noteSelected;
		});
	});

	await WKCNotesAction.WKCNotesActionDelete(storageClient, $noteSelected.WKCNoteID);

	return noteSelected.set(null);
}
</script>

<div class="Container">

{#if $noteSelected}
	<header class="WIKSharedToolbar">
		<button on:click={ noteDelete } class="WKCSharedButtonNoStyle">{ window.OLSKLocalized('WIKComposeListItemToolbarDeleteButtonText') }</button>
	</header>
{/if}

{#if !$noteSelected}
	<div class="PlaceholderContainer">
		<span>{ window.OLSKLocalized('WIKComposeDetailPlaceholderText') }</span>
	</div>
{/if}

</div>

<style>
.Container {
	/* AppContentContainerFlexboxChild */
	flex-grow: 1;

	/* ContainerFlexboxParent */
	display: flex;
	flex-direction: column;
}

.PlaceholderContainer {
	opacity: 0.5;
	text-align: center;

	/* ContainerFlexboxChild */
	flex-grow: 1;

	/* PlaceholderContainerFlexboxParent */
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
