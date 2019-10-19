<script>
import OLSKViewportContent from 'OLSKViewportContent';
import ModuleMaster from './ModuleMaster.svelte';
import ModuleDetail from './ModuleDetail.svelte';
import ModuleFooter from './ModuleFooter.svelte';

import { OLSKLocalized } from '../../_shared/common/global.js';
import { storageClient, isLoading, isMobile, isInErrorState } from './persistence.js';

let WKCWriteFooterStorageStatus = '';
import * as OLSKRemoteStorage from '../_shared/__external/OLSKRemoteStorage/main.js'
OLSKRemoteStorage.OLSKRemoteStorageStatus(storageClient.remoteStorage, function (inputData) {
	WKCWriteFooterStorageStatus = inputData
}, OLSKLocalized)

import { onMount } from 'svelte';
onMount(function () {
	(new window.OLSKStorageWidget(storageClient.remoteStorage)).attach('WKCWriteStorageWidget').backend(document.querySelector('.WKCWriteFooterStorageButton'));
});

const mod = {

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
	<ModuleFooter on:WIKWriteFooterDispatchStorage={ mod.WIKWriteFooterDispatchStorage } { WKCWriteFooterStorageStatus } />
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
