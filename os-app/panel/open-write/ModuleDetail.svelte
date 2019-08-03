<script context="module">
import { OLSKLocalized } from '../../_shared/common/global.js';

let editorInstance = null;
let editorPostInitializeQueue = [];
export let editorConfigure = function (inputData) {
	// console.log(editorInstance ? 'run' : 'queue', inputData);
	return editorInstance ? inputData(editorInstance) : editorPostInitializeQueue.push(inputData);
};
</script>

<script>
import ModuleFooter from './ModuleFooter.svelte';

import * as WKCNotesAction from '../../_shared/rs-modules/wkc_notes/action.js';
import * as WKCVersionsAction from '../../_shared/rs-modules/wkc_versions/action.js';
import WKCWriteLogic from './ui-logic.js';

import { storageClient, notesAll, filterText, defaultFocusNode, mobileViewCurrent, isMobile } from './persistence.js';
import { noteSelected } from './_shared.js';

let headerTokens = [];

noteSelected.subscribe(function (val) {
	window.LCHPageFormulas = null;
	headerTokens = [];

	if (!val && editorInstance) {
		editorInstance.toTextArea();
		editorInstance = null;
	}

	if (!val) {
		return;
	}

	return editorConfigure(function () {
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
			headerTokens = WKCWriteLogic.WKCWriteHeaderTokensFrom([...Array(editorInstance.getDoc().size)].map(function (e, i) {
				return WKCWriteLogic.WKCWriteLineObjectsFor(editorInstance.getLineTokens(i));
			}));

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

	(async function() {
		if (throttleMapVersions[inputData.WKCNoteID]) {
			return OLSKThrottle.OLSKThrottleTimeoutFor(throttleMapVersions[inputData.WKCNoteID]);
		}

		throttleMapVersions[inputData.WKCNoteID] = {
			OLSKThrottleDuration: 3000,
			OLSKThrottleCallback: function () {
				delete throttleMapVersions[inputData.WKCNoteID];
			},
		};

		if (!inputData.WKCNoteCreationDate) {
			return;
		}

		await WKCVersionsAction.WKCVersionsActionCreate(storageClient, {
			WKCVersionNoteID: inputData.WKCNoteID,
			WKCVersionBody: inputData.WKCNoteBody,
			WKCVersionDate: inputData.WKCNoteModificationDate,
		});
	})();

	if (!throttleMapNotes[inputData.WKCNoteID]) {
		throttleMapNotes[inputData.WKCNoteID] = {
			OLSKThrottleDuration: 500,
			OLSKThrottleCallback: async function () {
				delete throttleMapNotes[inputData.WKCNoteID];

				await WKCNotesAction.WKCNotesActionUpdate(storageClient, inputData);
			},
		};	
	}

	OLSKThrottle.OLSKThrottleTimeoutFor(throttleMapNotes[inputData.WKCNoteID]);
}

function noteJump() {
	window.Launchlet.instanceCreate(headerTokens.map(function (e) {
		return {
			LCHRecipeTitle: e.string,
			LCHRecipeCallback: function () {
				editorInstance.scrollIntoView(CodeMirror.Pos(e.line, e.start), 300);
				editorInstance.setSelection(CodeMirror.Pos(e.line, e.start), CodeMirror.Pos(e.line, e.end));

				if (isMobile()) {
					return;
				}
			},
		};
	}), {
		runMode: window.Launchlet.kRunModeJump,
		completionHandler () {
			if (isMobile()) {
				return;
			}
			
			editorInstance.focus();
		}
	});
}

async function notePublish() {
	let item = await WKCNotesAction.WKCNotesActionPublish(storageClient, $noteSelected);
	return noteSelected.update(function (val) {
		return Object.assign(val, item);
	});
}

async function noteUnpublish() {
	let item = await WKCNotesAction.WKCNotesActionUnpublish(storageClient, $noteSelected);
	return noteSelected.update(function (val) {
		return Object.assign(val, item);
	});
}

async function noteVersions() {
	(await WKCVersionsAction.WKCVersionsActionQuery(storageClient, {
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

	notesAll.update(function (val) {
		return val.filter(function(e) {
			return e !== $noteSelected;
		});
	});

	await WKCNotesAction.WKCNotesActionDelete(storageClient, $noteSelected.WKCNoteID);

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

	if (isMobile()) {
		return;
	}

	defaultFocusNode().focus();
}

function debugTextAreaDidInput() {
	Object.assign($noteSelected, {
		WKCNoteBody: this.value,
	}); // @DependancySvelteIgnoresMutableChanges

	noteSave($noteSelected);
}

function handleKeydown(event) {
	if (window.Launchlet.instanceExists()) {
		return;
	}

	if (event.key === 'Tab') {
		return toggleTabFocus(event);
	}

	if (event.ctrlKey && event.key === 'r' && headerTokens.length) {
		return noteJump();
	}

	if (event.key === 'Escape') {
		if (editorInstance && editorInstance.getDoc().listSelections().length > 1) {
			return editorInstance.setSelections(editorInstance.getDoc().listSelections().slice(0, 1));
		}

		return noteClear();
	}
}
</script>
<svelte:window on:keydown={ handleKeydown }/>

<div class="Container WKC_ContextMobileView" class:WKC_ContextMobileViewActive={ $mobileViewCurrent === 'ModuleDetail' } class:WKC_ContextMobileViewInactive={ $mobileViewCurrent !== 'ModuleDetail' }>

{#if $noteSelected}
	<header class="WKCSharedToolbar" id="WKCWriteDetailToolbar">
		<div class="WKCSharedToolbarElementGroup">
			<button on:click={ noteClear } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle WKC_ContextMobileExclusive"style="background-image: url('/panel/_shared/ui-assets/wIKWriteBack.svg')"  title={ OLSKLocalized('WKCWriteDetailToolbarBackButtonText')} id="WKCWriteDetailToolbarBackButton"></button>
		</div>

		<div class="WKCSharedToolbarElementGroup">
			<button on:click={ () => setTimeout(noteJump) } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" disabled={ !headerTokens.length } accesskey="r" style="background-image: url('/panel/_shared/ui-assets/wIKWriteJump.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarJumpButtonText') } id="WKCWriteDetailToolbarJumpButton"></button>

			{#if $noteSelected.WKCNotePublishStatusIsPublished}
				<span id="PublishStatus">{ OLSKLocalized('WKCWriteDetailToolbarPublishStatusPublished') }</span>
				<a class="WKCSharedToolbarButton WKCSharedElementTappable" href={ window.OLSKCanonicalFor('WIKRefsRoute', {
						wkc_note_public_id: $noteSelected.WKCNotePublicID,
					}) } title={ OLSKLocalized('WKCWriteDetailToolbarVisitButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKWriteVisit.svg')" target="_blank"></a>

				<button on:click={ noteUnpublish } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKWriteUnpublish.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarUnpublishButtonText') } id="WKCWriteDetailToolbarUnpublishButton"></button>
			{/if}

			{#if false && !$noteSelected.WKCNotePublishStatusIsPublished }
				<button on:click={ notePublish } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKWritePublish.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarPublishButtonText') } id="WKCWriteDetailToolbarPublishButton"></button>
			{/if}

			<button on:click={ noteVersions } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKWriteVersions.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarVersionsButtonText') } id="WKCWriteDetailToolbarVersionsButton"></button>

			<button on:click={ noteDelete } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKWriteDiscard.svg')" title={ OLSKLocalized('WKCWriteDetailToolbarDiscardButtonText') } id="WKCWriteDetailToolbarDiscardButton"></button>
		</div>
	</header>

	<div class="DetailContentContainer EditorContainer">
		<!-- <textarea on:input={ debugTextAreaDidInput } id="WKCWriteEditorDebugInput"></textarea> -->
		<textarea bind:this={ editorElement }></textarea>
	</div>
{/if}

{#if !$noteSelected}
	<div class="DetailContentContainer PlaceholderContainer">
		<span>{ OLSKLocalized('WKCWriteDetailPlaceholderText') }</span>
	</div>
{/if}

{#if isMobile()}
	<ModuleFooter />
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
	font-size: 14px;

	/* ContainerFlexboxChild */
	flex-grow: 1;

	/* PlaceholderContainerFlexboxParent */
	display: flex;
	justify-content: center;
	align-items: center;
}

.WKCSharedToolbar {
	font-size: 14px;

	/* WKCSharedToolbarFlexboxChild */
	justify-content: space-between;
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

  /* MobileSafariSmoothScrolling */
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

@media screen and (max-width: 760px) {

.WKCSharedToolbar {
	padding: 12px 8px;
}

.WKCSharedToolbarElementGroup {
	margin: unset;

	display: flex;
}

.WKCSharedToolbarElementGroup * {
	margin: 0 8px;
}

}
</style>
