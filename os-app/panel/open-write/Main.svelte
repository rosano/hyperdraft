<script>
import OLSKViewportContent from './modules/OLSKViewportContent/main.svelte';
import ModuleMaster from './ModuleMaster.svelte';
import ModuleDetail from './ModuleDetail.svelte';
import ModuleFooter from './ModuleFooter.svelte';

import { OLSKLocalized } from '../../_shared/common/global.js';
import { storageClient, isLoading, isMobile, isInErrorState } from './persistence.js';

import { onMount } from 'svelte';
import Widget from 'remotestorage-widget';
onMount(function () {
	(new Widget(storageClient.remoteStorage)).attach('WIKWriteStorageWidget');	
});
</script>

<div class="Container OLSKViewport" class:OLSKIsLoading={ $isLoading }>

<OLSKViewportContent>
	<ModuleMaster />
	<ModuleDetail />
</OLSKViewportContent>

{#if !isMobile()}
	<ModuleFooter />
{/if}

</div>

<div id="WIKWriteStorageWidget"></div>
{#if $isInErrorState}
	<div class="WIKWriteDebug">
		<button class="WIKSharedButtonNoStyle" onclick="location.reload();">{ OLSKLocalized('WKCUpdateReloadText') }</button>
	</div>
{/if}

<style>
.OLSKIsLoading :global(.OLSKToolbar *), .OLSKIsLoading :global(.MasterContentContainer *), .OLSKIsLoading :global(.DetailContentContainer *) {
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
