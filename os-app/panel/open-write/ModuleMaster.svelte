<script>
import WKCWriteSearchInput from './modules/WKCWriteSearchInput/main.svelte';
import ModuleFooter from './ModuleFooter.svelte';

import * as WKCNotesAction from '../../_shared/rs-modules/wkc_notes/action.js';

import WKCParser from '../../_shared/WKCParser/main.js';

import { WIKWriteTruncatedTitleFor, WKCWriteLogicListSort } from './ui-logic.js';

import {
	OLSKLocalized,
	_WIKIsTestingBehaviour,
} from '../../_shared/common/global.js';
import { storageClient, notesAll, filterText, defaultFocusNode, isMobile, mobileViewCurrent } from './persistence.js';
import { noteSelected } from './_shared.js';

import { editorConfigure } from './ModuleDetail.svelte';

let inputFocused = false;
import { onMount } from 'svelte';
onMount(function () {
	defaultFocusNode().addEventListener('focus', function () {
		inputFocused = true;
	});

	defaultFocusNode().addEventListener('blur', function () {
		inputFocused = false;
	});
});

async function noteCreate(inputData) {
	let item = await WKCNotesAction.WKCNotesActionCreate(storageClient, {
		WKCNoteBody: typeof inputData === 'string' ? inputData : '',
	});

	notesAll.update(function (val) {
		return [].concat(val, item).sort(WKCWriteLogicListSort);
	});

	noteSelect(item);

	editorConfigure(function (editorInstance) {
		editorInstance.focus();
		
		if (typeof inputData !== 'string') {
			return;
		}

		if (!inputData.match('\n')) {
			return;
		}

		editorInstance.setCursor(CodeMirror.Pos(inputData.split('\n').length - 1, 0));
	});
}

async function noteSelect(inputData) {
	mobileViewCurrent.set('ModuleDetail');

	editorConfigure(function (editorInstance) {
		if (isMobile()) {
			return;
		}
		
		return editorInstance.focus();
	});
	
	return noteSelected.set(inputData);
}

noteSelected.subscribe(function noteSelectedDidChange (val) {
	if (val) {
		return;
	}

	mobileViewCurrent.set('ModuleMaster');

	let element = document.querySelector('.MasterContentContainer');

	if (!element) {
		return;
	}

	if (!_WIKIsTestingBehaviour()) {
		element.scrollTo(0, 0);
	}

	if (isMobile()) {
		return;
	}

	defaultFocusNode().focus();
});

import { afterUpdate } from 'svelte';
afterUpdate(function () {
	if (_WIKIsTestingBehaviour()) {
		return;
	}
	
	let element = document.querySelector('.ListItemSelected');

	if (!element) {
		return;
	}

	if (isMobile()) {
		return;
	}
	
	element.scrollIntoView({
		block: 'nearest',
		inline: 'nearest',
	});
});

let notesVisible = [];

function notesVisibleNeedsChange () {
	notesVisible = $notesAll.filter(function (e) {
		return e.WKCNoteBody.toLowerCase().match($filterText.toLowerCase());
	});
}

notesAll.subscribe(notesVisibleNeedsChange);
filterText.subscribe(function filterTextDidChange (val) {
	notesVisibleNeedsChange();
	
	notesVisible = notesVisible.sort(WKCWriteLogicListSort);

	if (!val.length) {
		return noteSelected.set(null);
	}

	if (!notesVisible.length) {
		return noteSelected.set(null);
	}

	return noteSelected.set(notesVisible.filter(function (e) {
		return WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody).toLowerCase() === val.toLowerCase();
	}).concat(notesVisible.filter(function (e) {
		return WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody).toLowerCase().includes(val.toLowerCase());
	})).shift());
});

function clearButtonDidClick() {
	filterText.set('');
	
	defaultFocusNode().focus();
}

async function exportNotes() {
	let zip = new JSZip();

	$notesAll.forEach(function (e) {
		zip.file(`${ e.WKCNoteID }.txt`, e.WKCNoteBody, {
			date: e.WKCNoteModificationDate,
		});
	});
	
	zip.generateAsync({type: 'blob'}).then(function (content) {
		saveAs(content, 'notes.zip');
	});
}

function handleArrowUp () {
	noteSelected.set(notesVisible[Math.max(notesVisible.indexOf($noteSelected) - 1, 0)]);

	return event.preventDefault();
}

function handleArrowDown () {
	noteSelected.set(notesVisible[Math.min(notesVisible.indexOf($noteSelected) + 1, notesVisible.length - 1)]);

	return event.preventDefault();
}

function handleEnter () {
	if (!$filterText.length) {
		return;
	}
	
	if (document.activeElement !== defaultFocusNode()) {
		return;
	}

	if ($noteSelected && WKCParser.WKCParserTitleForPlaintext($noteSelected.WKCNoteBody) === $filterText) {
		return;
	}

	return noteCreate($filterText + '\n\n');
}

function handleKeydown(event) {
	if (window.Launchlet.instanceExists()) {
		return;
	}
	
	if (document.activeElement !== defaultFocusNode()) {
		return;
	}

	if (event.key === 'ArrowUp') {
		return handleArrowUp(event);
	}

	if (event.key === 'ArrowDown') {
		return handleArrowDown(event);
	}

	if (event.key === 'Enter') {
		return handleEnter(event);
	}
}
</script>
<svelte:window on:keydown={ handleKeydown }/>

<div class="Container OLSKViewportMaster WKCWriteMaster WKC_ContextMobileView" class:WKC_ContextMobileViewActive={ $mobileViewCurrent === 'ModuleMaster' } class:WKC_ContextMobileViewInactive={ $mobileViewCurrent !== 'ModuleMaster' } aria-hidden={ $mobileViewCurrent !== 'ModuleMaster' } class:WKCWriteMasterContainerFocused={ inputFocused }>

<header class="WKCSharedToolbar">
	<WKCWriteSearchInput bind:inputData={ $filterText } on:WKCWriteSearchInputClearButtonDidClick={ clearButtonDidClick } />

	<div class="WKCSharedToolbarElementGroup">
		<button on:click={ noteCreate } class="WKCSharedToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" title={ OLSKLocalized('WKCWriteMasterToolbarCreateButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedCreate.svg')" accesskey="n" id="WKCWriteCreateButton"></button>
	</div>
</header>

<div class="MasterContentContainer">
	<div class="List">
		{#each notesVisible as e}
			<div on:click={ () => noteSelect(e) } class="ListItem OLSKLayoutElementTappable" class:ListItemSelected={ $noteSelected === e }>
				<strong class="WKCWriteListItemAccessibilitySummary OLSKScreenReaderOnly">{ WIKWriteTruncatedTitleFor(WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody), true) }</strong>
				<strong class="ListItemTitle " aria-hidden="true">{ WIKWriteTruncatedTitleFor(WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody)) }</strong>
				<span class="ListItemSnippet" aria-hidden="true">{ WKCParser.WKCParserSnippetForPlaintext(WKCParser.WKCParserBodyForPlaintext(e.WKCNoteBody)) }</span>
			</div>
		{/each}
	</div>
	
	<div id="WKCWriteMasterDebug">
		<button on:click={ exportNotes } class="OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" id="WKCWriteExportButton">{ OLSKLocalized('WKCUpdateExportText') }</button>
	</div>
</div>

{#if isMobile()}
	<ModuleFooter />
{/if}

</div>

<style>

.Container {
	--OLSKViewportMasterWidth: 300px;

	border-right: var(--WIKBorderStyle);

	/* ContainerFlexboxParent */
	display: flex;
	flex-direction: column;
}

header {
	/* ContainerFlexboxChild */
	flex-shrink: 0;
}

header :global(.WKCWriteSearchInputContainer) {
	/* WKCSharedToolbarFlexboxChild */
	flex-grow: 1;
}

.MasterContentContainer {
	overflow: auto;

	/* ContainerFlexboxChild */
	flex-grow: 1;
}

.ListItem {
	min-height: 46px;
	padding: 10px;
	border-bottom: var(--WIKBorderStyle);

	overflow: hidden;
	text-overflow: ellipsis;

	/* prevent breaking from long urls */
	overflow-wrap: break-word;
	word-wrap: break-word;
	word-break: break-word;
	hyphens: auto;
}

.ListItemSelected {
	background: #e6e6e6;
}

.ListItemTitle {
	display: inline-block;
}

.ListItemSnippet {
	display: block;
	margin-top: 5px;
}

.FilterNoMatches {
	padding: 10px;
}

#WKCWriteMasterDebug {
	padding: 10px;
}

@media screen and (max-width: 760px) {

.MasterContentContainer {
  /* MobileSafariSmoothScrolling */
	-webkit-overflow-scrolling: touch;
}

.WKCSharedToolbar {
	padding: 4px;
}

.WKCSharedToolbarElementGroup {
	margin-left: 8px;
}

}

@media screen and (min-width: 760px) {

.WKCWriteMasterContainerFocused .ListItemSelected {
	background: #1a81ff;
	color: white;
}

}
</style>
