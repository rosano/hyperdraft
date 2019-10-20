<script>
import OLSKViewportContent from 'OLSKViewportContent';
import ModuleMaster from './ModuleMaster.svelte';
import ModuleDetail from './ModuleDetail.svelte';
import ModuleFooter from './ModuleFooter.svelte';

import { OLSKLocalized } from '../../_shared/common/global.js';
import { storageClient, isLoading, isMobile, isInErrorState, notesAll } from './persistence.js';

import * as WKCNoteMetal from '../../_shared/WKCNote/metal.js';
import { WKCNoteModelPostJSONParse } from '../../_shared/WKCNote/model.js';
import * as WKCNoteAction from '../../_shared/WKCNote/action.js';
import * as WKCSettingMetal from '../../_shared/WKCSetting/metal.js';
import * as WKCSettingAction from '../../_shared/WKCSetting/action.js';
import { WKCWriteLogicListSort } from './ui-logic.js';

export const DocumentsExport = async function () {
	let zip = new JSZip();

	const fileName = [
		'com.wikiavec.export',
		(new Date()).toJSON(),
	].join(' ');

	zip.file(`${ fileName }.json`, JSON.stringify({
		WKCNoteObjects: $notesAll,
		WKCSettingObjects: await WKCSettingAction.WKCSettingsActionQuery(storageClient, {}),
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
		return WKCSettingMetal.WKCSettingsMetalWrite(storageClient, e);
	}));

	await Promise.all(outputData.WKCNoteObjects.map(function (e) {
		return WKCNoteMetal.WKCNoteMetalWrite(storageClient, WKCNoteModelPostJSONParse(e));
	}));

	notesAll.set(await WKCNoteAction.WKCNoteActionQuery(storageClient, {}));
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

<ModuleFooter on:FooterDispatchExport={ mod.FooterDispatchExport } on:FooterDispatchImport={ mod.FooterDispatchImport } on:WIKWriteFooterDispatchStorage={ mod.WIKWriteFooterDispatchStorage } { WIKWriteFooterStorageStatus } />

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

x.OLSKViewport :global(.WKC_ContextMobileView) {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

x.OLSKViewport :global(.WKC_ContextMobileViewInactive) {
	left: 100vw;
	right: -100vw;
}

.OLSKViewport :global(.WKC_ContextMobileViewActive) {
	flex-basis: 100% !important;
}

.OLSKViewport :global(.WKC_ContextMobileViewInactive) {
	display: none;
}

.OLSKViewport :global(.WKC_ContextMobileExclusive) {
	display: unset;
}

}
</style>
