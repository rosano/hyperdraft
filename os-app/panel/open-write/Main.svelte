<script>
import OLSKViewportContent from 'OLSKViewportContent';
import ModuleMaster from './ModuleMaster.svelte';
import ModuleDetail from './ModuleDetail.svelte';
import ModuleFooter from './ModuleFooter.svelte';

import { OLSKLocalized } from '../../_shared/common/global.js';
import { storageClient, isLoading, isMobile, isInErrorState, notesAll } from './persistence.js';

<<<<<<< HEAD
import * as WKCNotesMetal from '../../_shared/rs-modules/wkc_notes/metal.js';
import { WKCNotesModelPostJSONParse } from '../../_shared/rs-modules/wkc_notes/model.js';
import * as WKCNotesAction from '../../_shared/rs-modules/wkc_notes/action.js';
import WKCSettingsMetal from '../../_shared/rs-modules/wkc_settings/metal.js';
import WKCSettingsAction from '../../_shared/rs-modules/wkc_settings/action.js';
import { WKCWriteLogicListSort } from './ui-logic.js';

export const DocumentsExport = async function () {
	let zip = new JSZip();

	const fileName = [
		'com.wikiavec.export',
		(new Date()).toJSON(),
	].join(' ');

	zip.file(`${ fileName }.json`, JSON.stringify({
		WKCNoteObjects: $notesAll,
		WKCSettingObjects: await WKCSettingsAction.WKCSettingsActionQuery(storageClient, {}),
	}));
	
	zip.generateAsync({type: 'blob'}).then(function (content) {
		saveAs(content, `${ fileName }.zip`);
	});	
};

export const DocumentsImport = async function(inputData) {
	let outputData;
	try {
		outputData = JSON.parse(inputData);
	} catch (e)  {
		console.log(e);
	}

	if (typeof outputData !== 'object' || outputData === null) {
		return;
	}

	if (!Array.isArray(outputData.WKCNoteObjects)) {
		return;
	}

	if (!Array.isArray(outputData.WKCSettingObjects)) {
		return;
	}

	await Promise.all(outputData.WKCSettingObjects.map(function (e) {
		return WKCSettingsMetal.WKCSettingsMetalWrite(storageClient, e);
	}));

	await Promise.all(outputData.WKCNoteObjects.map(function (e) {
		return WKCNotesMetal.WKCNotesMetalWrite(storageClient, WKCNotesModelPostJSONParse(e));
	}));

	notesAll.set(await WKCNotesAction.WKCNotesActionQuery(storageClient, {}));
};

let WIKWriteFooterStorageStatus = '';
import * as OLSKRemoteStorage from '../../_shared/__external/OLSKRemoteStorage/main.js'
OLSKRemoteStorage.OLSKRemoteStorageStatus(storageClient.remoteStorage, function (inputData) {
	WIKWriteFooterStorageStatus = inputData
}, OLSKLocalized)

import { onMount } from 'svelte';
onMount(function () {
	(new window.OLSKStorageWidget(storageClient.remoteStorage)).attach('WIKWriteStorageWidget').backend(document.querySelector('.WIKWriteFooterStorageButton'));
});

const mod = {

	FooterDispatchExport () {
		DocumentsExport();
	},

	FooterDispatchImport (event) {
		DocumentsImport(event.detail);
	},

	_ValueStorageHidden: true,
	WIKWriteFooterDispatchStorage () {
		mod._ValueStorageHidden = !mod._ValueStorageHidden;
	},

};
</script>

<div class="Container OLSKViewport" class:OLSKIsLoading={ $isLoading }>

<OLSKViewportContent>
	<ModuleMaster />
	<ModuleDetail />
</OLSKViewportContent>

<div id="WIKWriteStorageWidget" class:StorageHidden={ mod._ValueStorageHidden }></div>

{#if !isMobile()}
	<ModuleFooter on:FooterDispatchExport={ mod.FooterDispatchExport } on:FooterDispatchImport={ mod.FooterDispatchImport } on:WIKWriteFooterDispatchStorage={ mod.WIKWriteFooterDispatchStorage } { WIKWriteFooterStorageStatus } />
{/if}

</div>

{#if $isInErrorState}
	<div class="WIKWriteDebug">
		<button class="WIKSharedButtonNoStyle" onclick="location.reload();">{ OLSKLocalized('WKCUpdateReloadText') }</button>
	</div>
{/if}

<style>
.OLSKIsLoading :global(.MasterContentContainer *), .OLSKIsLoading :global(.DetailContentContainer *) {
	visibility: hidden;
}

.Container {
	font-family: 'Helvetica Neue', 'Helvetica', sans;
	font-size: 12px;
}

.WIKWriteDebug {
	font-family: sans-serif;

	position: absolute;
	bottom: 50vh;
	right: 0;

	z-index: 10;
}

.WIKWriteDebug button {
	padding: 10px;
	border: 1px solid #bbb;

	margin: 10px;

	background: #ddd;
}

.StorageHidden {
	display: none;
}

@media screen and (max-width: 760px) {

.OLSKViewport :global(.WKC_ContextMobileView) {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.OLSKViewport :global(.WKC_ContextMobileViewInactive) {
	left: 100vw;
	right: -100vw;
}

.OLSKViewport :global(.WKC_ContextMobileExclusive) {
	display: unset;
}

}
</style>
