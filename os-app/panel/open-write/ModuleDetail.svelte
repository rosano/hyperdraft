<script context="module">
import {
	OLSKLocalized,
	_WIKIsTestingBehaviour,
} from '../../_shared/common/global.js';

let editorInstance = null;
let editorPostInitializeQueue = [];
export let editorConfigure = function (inputData) {
	// console.log(editorInstance ? 'run' : 'queue', inputData);
	return editorInstance ? inputData(editorInstance) : editorPostInitializeQueue.push(inputData);
};
</script>

<script>
import WKCWriteJumpButton from './modules/WKCWriteJumpButton/main.svelte';
import ModuleFooter from './ModuleFooter.svelte';
import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';

import * as WKCNoteAction from '../../_shared/WKCNote/action.js';
import * as WKCVersionAction from '../../_shared/WKCVersion/action.js';
import * as WKCWriteLogic from './ui-logic.js';

import { storageClient, notesAll, filterText, defaultFocusNode, mobileViewCurrent, isMobile } from './persistence.js';
import { noteSelected } from './_shared.js';

let jumpRecipes = [];

noteSelected.subscribe(function (val) {
	window.LCHPageRecipes = null;
	jumpRecipes = [];

	if (!val && editorInstance) {
		editorInstance.toTextArea();
		editorInstance = null;
	}

	if (!val) {
		return;
	}

	return editorConfigure(function () {
		if (_WIKIsTestingBehaviour()) {
			document.querySelector('#WKCWriteEditorDebugInput').value = val.WKCNoteBody;
		}
		editorInstance.setValue(val.WKCNoteBody);
		editorInstance.getDoc().clearHistory();
	});
});

function openTextObject (inputData) {
	if (URLParse(inputData, {}).protocol) {
		return window.open(inputData, '_blank');
	}

	let match = inputData.match(/\[\[(.*)\]\]/).pop();
	if (!match) {
		return;
	}

	event.stopPropagation();
	
	filterText.set('');
	filterText.set(match);
}

function openCursorObject (inputData) {
	let cursor = editorInstance.getCursor();

	let currentObject = WKCWriteLogic.WKCWriteLineObjectsFor(editorInstance.getLineTokens(cursor.line)).filter(function (e) {
		return Math.max(e.start, Math.min(e.end, cursor.ch)) === cursor.ch;
	}).shift();

	if (!currentObject.type.match('link')) {
		return;
	}

	openTextObject(currentObject.string);
}

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
			  'Cmd-H': function (event) {
			  	return event.preventDefault();
			  },
			  Esc: function () {}, // overwrite to control via other binding
			  Tab: false,
			},

			theme: 'wkc',

			keyMap: 'sublime',
		});

		editorInstance.on('change', function (instance, changeObject) {
			jumpRecipes = WKCWriteLogic.WKCWriteHeaderTokensFrom([...Array(editorInstance.getDoc().size)].map(function (e, i) {
				return WKCWriteLogic.WKCWriteLineObjectsFor(editorInstance.getLineTokens(i));
			})).map(function (e) {
				return {
					LCHRecipeName: e.string,
					LCHRecipeCallback: function () {
						editorInstance.scrollIntoView(CodeMirror.Pos(e.line, e.start), 300);
						editorInstance.setSelection(CodeMirror.Pos(e.line, e.start), CodeMirror.Pos(e.line, e.end));

						if (isMobile()) {
							return;
						}
					},
				};
			});

			if (changeObject.origin === 'setValue') {
				return;
			}

			Object.assign($noteSelected, {
				WKCNoteBody: instance.getValue(),
			}); // @DependancySvelteIgnoresMutableChanges

			noteSave($noteSelected);
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

		document.querySelector('.CodeMirror').addEventListener('mouseup', function (event) {
			if (!event.target.className.match('cm-link'))  {
				return;
			}

			openTextObject(event.target.textContent);
		});
	})();

	// console.log(editorPostInitializeQueue);

	editorPostInitializeQueue.splice(0, editorPostInitializeQueue.length).forEach(function(e) {
		// console.log('run', e);

		return e(editorInstance);
	});
});

let throttleMapNotes = {};
let throttleMapVersions = {};
import OLSKThrottle from 'OLSKThrottle';
async function noteSave(inputData) {
	notesAll.update(function (val) {
		return val;
	});

	OLSKThrottle.OLSKThrottleMappedTimeoutFor(throttleMapVersions, inputData.WKCNoteID, function (inputData) {
		return {
			OLSKThrottleDuration: 3000,
			OLSKThrottleCallback: async function () {
				delete throttleMapVersions[inputData.WKCNoteID];

				if (!inputData.WKCNoteCreationDate) {
					return;
				}

				await WKCVersionAction.WKCVersionActionCreate(storageClient, {
					WKCVersionNoteID: inputData.WKCNoteID,
					WKCVersionBody: inputData.WKCNoteBody,
					WKCVersionDate: inputData.WKCNoteModificationDate,
				});
			},
		};
	}, inputData);

	OLSKThrottle.OLSKThrottleMappedTimeoutFor(throttleMapNotes, inputData.WKCNoteID, function (inputData) {
		return {
			OLSKThrottleDuration: 500,
			OLSKThrottleCallback: async function () {
				delete throttleMapNotes[inputData.WKCNoteID];

				await WKCNoteAction.WKCNoteActionUpdate(storageClient, inputData);
			},
		};
	}, inputData);
}

async function notePublish() {
	let item = await WKCNoteAction.WKCNoteActionPublish(storageClient, $noteSelected);
	return noteSelected.update(function (val) {
		return Object.assign(val, item);
	});
}

async function noteUnpublish() {
	let item = await WKCNoteAction.WKCNoteActionUnpublish(storageClient, $noteSelected);
	return noteSelected.update(function (val) {
		return Object.assign(val, item);
	});
}

async function noteVersions() {
	(await WKCVersionAction.WKCVersionActionQuery(storageClient, {
		WKCVersionNoteID: $noteSelected.WKCNoteID,
	})).slice(0, 5).forEach(function (e) {
		console.log(e);
		console.log(e.WKCVersionBody);
	});
}

async function noteDelete() {
	if (!window.confirm(OLSKLocalized('WKCWriteNotesDeleteAlertText'))) {
		return;
	}

	await WKCNoteAction.WKCNoteActionDelete(storageClient, $noteSelected.WKCNoteID);

	notesAll.update(function (val) {
		return val.filter(function(e) {
			return e !== $noteSelected;
		});
	});

	noteSelected.set(null);

	defaultFocusNode().focus();
}

function toggleTabFocus (event) {
	event.preventDefault();

	return ((!editorInstance || editorInstance.hasFocus()) ? defaultFocusNode() :editorInstance).focus();
}

function noteClear () {
	noteSelected.set(null);
	notesAll.update(function (val) {
		return val.sort(WKCWriteLogic.WKCWriteLogicListSort);
	});
}

function debugTextAreaDidInput() {
	Object.assign($noteSelected, {
		WKCNoteBody: this.value,
	}); // @DependancySvelteIgnoresMutableChanges

	noteSave($noteSelected);
}

function handleKeydown(event) {
	if (window.Launchlet.LCHSingletonExists()) {
		return;
	}

	if (event.key === 'Tab') {
		return toggleTabFocus(event);
	}

	if (event.key === 'Escape') {
		if (editorInstance && editorInstance.getDoc().listSelections().length > 1) {
			return editorInstance.setSelections(editorInstance.getDoc().listSelections().slice(0, 1));
		}

		noteClear();
		filterText.set('');
		notesAll.update(function (val) {
			return val.sort(WKCWriteLogic.WKCWriteLogicListSort);
		});
		return;
	}
}
</script>
<svelte:window on:keydown={ handleKeydown }/>

<div class="Container OLSKViewportDetail WKC_ContextMobileView" class:WKC_ContextMobileViewActive={ $mobileViewCurrent === 'ModuleDetail' } class:WKC_ContextMobileViewInactive={ $mobileViewCurrent !== 'ModuleDetail' }>

{#if $noteSelected}
	<header id="WKCWriteDetailToolbar">
		<OLSKToolbar OLSKToolbarJustify={ true }>
			<OLSKToolbarElementGroup>
				{#if isMobile()}
					<button on:click={ noteClear } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle WKC_ContextMobileExclusive"style="background-image: url('/panel/_shared/ui-assets/wIKWriteBack.svg')"  title={ OLSKLocalized('WKCWriteDetailToolbarBackButtonText')} id="WKCWriteDetailToolbarBackButton"></button>
				{/if}
			</OLSKToolbarElementGroup>

			<OLSKToolbarElementGroup>
				<WKCWriteJumpButton inputData={ jumpRecipes } />

				{#if $noteSelected.WKCNotePublishStatusIsPublished}
					<span id="PublishStatus">{ OLSKLocalized('WKCWriteDetailToolbarPublishStatusPublished') }</span>
					<a class="OLSKToolbarButton OLSKLayoutElementTappable" href={ window.OLSKCanonicalFor('WIKRefsRoute', {
							wkc_note_public_id: $noteSelected.WKCNotePublicID,
						}) } title={ OLSKLocalized('WKCWriteDetailToolbarVisitButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKWriteVisit.svg')" target="_blank">&nbsp;</a>

					<button on:click={ noteUnpublish } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKWriteUnpublish.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarUnpublishButtonText') } id="WKCWriteDetailToolbarUnpublishButton"></button>
				{/if}

				{#if !$noteSelected.WKCNotePublishStatusIsPublished }
					<button on:click={ notePublish } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKWritePublish.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarPublishButtonText') } id="WKCWriteDetailToolbarPublishButton"></button>
				{/if}

				<button on:click={ noteVersions } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKWriteVersions.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarVersionsButtonText') } id="WKCWriteDetailToolbarVersionsButton"></button>

				<button on:click={ noteDelete } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKWriteDiscard.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarDiscardButtonText') } id="WKCWriteDetailToolbarDiscardButton"></button>
			</OLSKToolbarElementGroup>
		</OLSKToolbar>
	</header>

	<div class="DetailContentContainer EditorContainer">
		{#if _WIKIsTestingBehaviour()}
			<textarea on:input={ debugTextAreaDidInput } id="WKCWriteEditorDebugInput"></textarea>
		{/if}
		<textarea bind:this={ editorElement }></textarea>
	</div>
{/if}

{#if !$noteSelected}
	<div class="DetailContentContainer PlaceholderContainer">
		<span>{ OLSKLocalized('WKCWriteDetailPlaceholderText') }</span>
	</div>
{/if}

</div>

<style>
.Container {
	/* ContainerFlexboxParent */
	display: flex;
	flex-direction: column;
}

header {
	border-bottom: var(--WIKBorderStyle);
}

.PlaceholderContainer {
	opacity: 0.5;
	text-align: center;
	font-size: 14px;

	/* ContainerFlexboxChild */
	flex-grow: 1;

	/* PlaceholderContainerFlexboxParent */
	display: flex;
	justify-content: center;
	align-items: center;
}

#PublishStatus {
	color: #bfbfbf
}

.EditorContainer {
	/* ContainerFlexboxChild */
	flex-grow: 1;

	/* EditorContainerStationParent */
	position: relative;
}

.EditorContainer :global(.CodeMirror) {
	height: 100%;

	/* EditorContainerStationChild */
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;

	font-family: inherit;
	font-size: 14px;
}

.EditorContainer :global(.CodeMirror-scroll) {
	background: #f8f8f8;

  /* OLSKMobileSafariSmoothScrolling */
	-webkit-overflow-scrolling: touch;
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
