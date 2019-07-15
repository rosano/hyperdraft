<script>
import WKCNotesAction from '../../_shared/rs-modules/wkc_notes/action.js';
import WKCVersionsAction from '../../_shared/rs-modules/wkc_versions/action.js';
import WKCWriteLogic from '../open-write/ui-logic.js';

import { storageClient, notesAll, noteSelected, filterText, defaultFocusNode } from './persistence.js';

let editorInstance;
let editorInitializeValue = function () {
	editorInstance.focus();

	editorInstance.setValue($noteSelected.WKCNoteBody);
	editorInstance.getDoc().clearHistory();
}

let _noteSelected;
noteSelected.subscribe(function (val) {
	_noteSelected = val;

	if (!val) {
		editorInstance = null;

		return;
	}

	if (!editorInstance) {
		return;
	}

	editorInitializeValue();
});

function openTextObject (inputData) {
	if (!!URLParse(inputData, {}).protocol) {
		return window.open(inputData, '_blank');
	}

	let matches = inputData.match(/\[\[(.*)\]\]/);
	if (!matches) {
		return;
	}

	event.preventDefault();
	
	$filterText = matches.pop();
};

function openCursorObject (inputData) {
	let cursor = editorInstance.getCursor();

	let currentObject = WKCWriteLogic.WKCWriteLineObjectsFor(editorInstance.getLineTokens(cursor.line)).filter(function (e) {
		return Math.max(e.start, Math.min(e.end, cursor.ch)) === cursor.ch;
	}).shift();

	if (!currentObject.type.match('link')) {
		return;
	}

	openTextObject(currentObject.string);
};

let editorElement;
import { afterUpdate } from 'svelte';
afterUpdate(function () {
	if (!editorElement) {
		return;
	}

	if (editorInstance) {
		return;
	}

	(function setupEditor() {
		editorInstance = CodeMirror.fromTextArea(editorElement, {
			mode: {
			  name: 'gfm',
			  gitHubSpice: false,
			  emoji: false,
			},
			
			lineNumbers: false,
			lineWrapping: true,

			extraKeys: {
			  Enter: 'newlineAndIndentContinueMarkdownList',
			  'Cmd-Enter': openCursorObject,
			  'Ctrl-Enter': openCursorObject,
			  Esc: function () {
			    return defaultFocusNode().focus();
			  },
			  Tab: false,
			},

			theme: 'wkc',

			keyMap: 'sublime',
		});

		editorInstance.on('change', function (instance, changeObject) {
			if (changeObject.origin === 'setValue') {
				return;
			}

			Object.assign($noteSelected, {
				WKCNoteBody: instance.getValue(),
			}); // @DependancySvelteIgnoresMutableChanges

			noteSave();
		});

		editorInstance.on('keydown', function (instance, event) {
			if (!navigator.platform.match(/mac/i)) {
				return;
			}

			if (!navigator.userAgent.match(/^((?!chrome|android).)*safari/i)) {
				return;
			}

			if (!event.altKey || !event.ctrlKey) {
				return;
			}

			let elements = document.querySelectorAll('[accesskey]');

			if (!elements.length) {
				return;
			}

			let match = [].slice.call(elements).filter(function (e) {
				return e.getAttribute('accesskey') === event.key;
			}).shift();

			if (!match) {
				return;
			}

			event.preventDefault();

			setTimeout(function () {
				match.focus();
			});
		});

		editorInstance.on('mousedown', function (instance, event) {
			if (!event.target.className.match('cm-link'))  {
				return;
			}

			event.preventDefault();
		});

		document.querySelector('.CodeMirror').addEventListener('mouseup)', function (event) {
			if (!event.target.className.match('cm-link'))  {
				return;
			}

			openTextObject(event.target.textContent);
		});
	})();

	editorInitializeValue();
});

let throttleMapNotes = {};
let throttleMapVersions = {};
import OLSKThrottle from '../../_shared/_external/OLSKThrottle/main.js';
async function noteSave() {
	notesAll.update(function (val) {
		return val;
	});

	(async function(noteObject) {
		if (throttleMapVersions[noteObject.WKCNoteID]) {
			return OLSKThrottle.OLSKThrottleTimeoutFor(throttleMapVersions[noteObject.WKCNoteID]);
		}

		throttleMapVersions[noteObject.WKCNoteID] = {
			OLSKThrottleDuration: 3000,
			OLSKThrottleCallback: function () {
				delete throttleMapVersions[noteObject.WKCNoteID]
			},
		};

		if (!noteObject.WKCNoteCreationDate) {
			return;
		}

		await WKCVersionsAction.WKCVersionsActionCreate(storageClient, {
			WKCVersionNoteID: noteObject.WKCNoteID,
			WKCVersionBody: noteObject.WKCNoteBody,
			WKCVersionDate: noteObject.WKCNoteModificationDate,
		});
	})($noteSelected);

	if (!throttleMapNotes[$noteSelected.WKCNoteID]) {
		throttleMapNotes[$noteSelected.WKCNoteID] = {
			OLSKThrottleDuration: 500,
			OLSKThrottleCallback: async function () {
				delete throttleMapNotes[$noteSelected.WKCNoteID];

				await WKCNotesAction.WKCNotesActionUpdate(storageClient, $noteSelected);
			},
		};	
	}

	OLSKThrottle.OLSKThrottleTimeoutFor(throttleMapNotes[$noteSelected.WKCNoteID]);
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
		<button on:click={ noteDelete } class="WKCSharedButtonNoStyle">{ window.OLSKLocalized('WKCWriteDetailToolbarDiscardButtonText') }</button>
	</header>
	<div class="EditorContainer">
		<textarea bind:this={ editorElement }></textarea>
	</div>
{/if}

{#if !$noteSelected}
	<div class="PlaceholderContainer">
		<span>{ window.OLSKLocalized('WKCWriteDetailPlaceholderText') }</span>
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

.EditorContainer {
	position:relative;

	/* ContainerFlexboxChild */
	flex-grow: 1;
}

.EditorContainer :global(.CodeMirror) {
	height: 100%;

	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;

	font-family: inherit;
}

.EditorContainer :global(.CodeMirror-scroll) {
	background: #f8f8f8;
}

.EditorContainer :global(.CodeMirror-lines) {
	/* override defaults */
	padding: 10px;
}

.EditorContainer :global(.CodeMirror pre) {
	/* override defaults */
	padding: 0;
}

.EditorContainer :global(.CodeMirror-line:nth-child(1)) {
	font-weight: bold;
}

.EditorContainer :global(.cm-link:hover) {
  cursor: pointer;
}
</style>
