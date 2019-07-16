<script>
import WKCNotesAction from '../../_shared/rs-modules/wkc_notes/action.js';

import WKCParser from '../../_shared/WKCParser/main.js';

import WKCWriteLogic from '../open-write/ui-logic.js';

import { storageClient, notesAll, noteSelected, filterText, defaultFocusNode, isMobile, mobileViewCurrent } from './persistence.js';

import { editorConfigure } from './ModuleDetail.svelte';

async function noteCreate() {
	let item = await WKCNotesAction.WKCNotesActionCreate(storageClient, {
		WKCNoteBody: '',
	});

	notesAll.update(function (val) {
		return [].concat(val, item).sort(WKCWriteLogic.WKCWriteLogicListSort);
	});

	editorConfigure(function (editorInstance) {
		if (!isMobile()) {
			return;
		}

		return editorInstance.focus();
	});

	noteSelect(item);
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

noteSelected.subscribe(function (val) {
	if (val) {
		return;
	}

	mobileViewCurrent.set('ModuleMaster');
});

let notesVisible = [];

$: notesVisible = $notesAll.filter(function (e) {
	return e.WKCNoteBody.toLowerCase().match($filterText.toLowerCase());
});

let filterTextDidChange = function (val) {
	notesVisible = notesVisible.sort(WKCWriteLogic.WKCWriteLogicListSort);

	if (!val.length) {
		return noteSelected.set(null);
	}

	if (!notesVisible.length) {
		return noteSelected.set(null);
	}

	let item = notesVisible.filter(function (e) {
		return WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody).toLowerCase().match(val.toLowerCase());
	}).shift();

	if (item) {
		return noteSelected.set(item);
	}
};
$: filterTextDidChange($filterText);

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

window.addEventListener('keydown', function (event) {
	if (document.activeElement !== defaultFocusNode()) {
		return;
	}

	if (event.key === 'ArrowUp') {
		return handleArrowUp(event);
	}

	if (event.key === 'ArrowDown') {
		return handleArrowDown(event);
	}
});
</script>

<div class="Container WKC_ContextMobileView" class:WKC_ContextMobileViewActive={ $mobileViewCurrent === 'ModuleMaster' } class:WKC_ContextMobileViewInactive={ $mobileViewCurrent !== 'ModuleMaster' }>

<header class="WKCSharedToolbar">
	<input type="search" bind:value={ $filterText } placeholder="{ OLSKLocalized('WKCWriteMasterToolbarFilterInputPlaceholderText') }" accesskey="f" id="WIKDefaultFocusNode" autofocus />

	<div class="WKCSharedToolbarElementGroup">
		<button on:click={ noteCreate } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" title={ window.OLSKLocalized('WKCWriteMasterToolbarCreateButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedCreate.svg')" accesskey="n"></button>
	</div>
</header>

<div class="MasterContentContainer">
	<div class="List">
		{#each notesVisible as e}
			<div on:click={ () => noteSelect(e) } class="ListItem WKCSharedElementTappable" class:ListItemSelected={ $noteSelected === e }>
				<strong>{ WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody) }</strong>
				<span>{ WKCParser.WKCParserSnippetForPlaintext(WKCParser.WKCParserBodyForPlaintext(e.WKCNoteBody)) }</span>
			</div>
		{/each}
	</div>
	
	<div id="WKCWriteMasterDebug">
		<button on:click={ exportNotes } class="WKCSharedElementTappable WKCSharedButtonNoStyle">{ OLSKLocalized('WKCUpdateExportText') }</button>
	</div>
</div>

</div>

<style>
.Container {
	border-right: var(--WIKBorderStyle);

	/* AppContentContainerFlexboxChild */
	flex-basis: 300px;
	flex-shrink: 0;

	/* ContainerFlexboxParent */
	display: flex;
	flex-direction: column;
}

header {
	/* ContainerFlexboxChild */
	flex-shrink: 0;
}

input {
	padding: 4px;
	margin: 0;
	border: 1px solid #e6e6e6;
	border-radius: 10px;

	text-indent: 2px;
	line-height: 1.4;

	/* WKCSharedToolbarFlexboxChild */
	flex-grow: 1;
}

.MasterContentContainer {
	overflow: auto;

	/* ContainerFlexboxChild */
	/*flex-grow: 1;*/
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

.ListItem span {
	display: block;
	margin-top: 5px;
}

#WKCWriteMasterDebug {
	padding: 10px;
}

@media screen and (max-width: 760px) {

.MasterContentContainer {
  /* smooth scrolling on mobile safari */
	-webkit-overflow-scrolling: touch;
}

.WKCSharedToolbar {
	padding: 8px;
}

input {
	height: 30px;
	border-radius: 10px;

	font-size: 14px;
}

.WKCSharedToolbarElementGroup {
	margin-left: 8px;
}

}
</style>
