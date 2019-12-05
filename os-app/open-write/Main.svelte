<script>
import { OLSKLocalized } from '../_shared/common/global.js';
import { storageClient, isLoading, isMobile, isInErrorState, WKCNotesAllStore } from './persistence.js';


import { _WIKIsTestingBehaviour } from '../_shared/common/global.js';
import * as WKCNoteMetal from '../_shared/WKCNote/metal.js';
import { WKCNoteModelPostJSONParse } from '../_shared/WKCNote/model.js';
import * as WKCNoteAction from '../_shared/WKCNote/action.js';
import * as WKCSettingMetal from '../_shared/WKCSetting/metal.js';
import * as WKCSettingAction from '../_shared/WKCSetting/action.js';
import { WKCWriteLogicListSort } from './ui-logic.js';

export const DocumentsExport = async function () {
	let zip = new JSZip();

	const fileName = [
		'com.wikiavec.export',
		(new Date()).toJSON(),
	].join(' ');

	zip.file(`${ fileName }.json`, JSON.stringify({
		WKCNoteObjects: $WKCNotesAllStore,
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

	WKCNotesAllStore.set(await WKCNoteAction.WKCNoteActionQuery(storageClient, {}));
};

import * as OLSKRemoteStorage from '../_shared/__external/OLSKRemoteStorage/main.js'
OLSKRemoteStorage.OLSKRemoteStorageStatus(storageClient.remoteStorage, function (inputData) {
	mod._ValueFooterStorageStatus = inputData;
}, OLSKLocalized)

import { onMount } from 'svelte';
onMount(function () {
	(new window.OLSKStorageWidget(storageClient.remoteStorage)).attach('WIKWriteStorageWidget').backend(document.querySelector('.WKCWriteFooterStorageButton'));
});

const mod = {

	_ValueStorageWidgetHidden: true,

	_ValueFooterStorageStatus: '',

	FooterDispatchExport () {
		DocumentsExport();
	},

	FooterDispatchImport (event) {
		DocumentsImport(event.detail);
	},

	WKCWriteFooterDispatchStorage () {
		mod._ValueStorageWidgetHidden = !mod._ValueStorageWidgetHidden;
	},

};

import OLSKViewportContent from 'OLSKViewportContent';
import ModuleMaster from './ModuleMaster.svelte';
import ModuleDetail from './ModuleDetail.svelte';
import WKCWriteFooter from './submodules/WKCWriteFooter/main.svelte';
import OLSKServiceWorker from '../_shared/__external/OLSKServiceWorker/main.svelte';
</script>

<div class="Container OLSKViewport" class:OLSKIsLoading={ $isLoading }>

<OLSKViewportContent>
	<ModuleMaster />
	<ModuleDetail />
</OLSKViewportContent>

<div id="WIKWriteStorageWidget" class:StorageHidden={ mod._ValueStorageWidgetHidden }></div>

<WKCWriteFooter on:FooterDispatchExport={ mod.FooterDispatchExport } on:FooterDispatchImport={ mod.FooterDispatchImport } WKCWriteFooterStorageStatus={ mod._ValueFooterStorageStatus } WKCWriteFooterDispatchStorage={ mod.WKCWriteFooterDispatchStorage } />

{#if !_WIKIsTestingBehaviour()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

</div>

{#if $isInErrorState}
	<div class="WIKWriteDebug">
		<button class="WIKSharedButtonNoStyle" onclick="location.reload();">{ OLSKLocalized('WKCUpdateReloadText') }</button>
	</div>
{/if}

<style>
.Container {
	--WKCBorderStyle: 1px solid #bbb;	
	
	font-family: 'Helvetica Neue', 'Helvetica', sans;
	font-size: 12px;
}

.OLSKIsLoading :global(.MasterContentContainer *), .OLSKIsLoading :global(.DetailContentContainer *) {
	visibility: hidden;
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
