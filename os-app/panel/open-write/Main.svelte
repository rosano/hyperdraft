<script>
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

<div class="OLSKAppContainer" class:OLSKIsLoading={ $isLoading }>

<div class="AppContentContainer">
	<ModuleMaster />
	<ModuleDetail />
</div>

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
.OLSKAppContainer {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;

	font-family: 'Helvetica Neue', 'Helvetica', sans;
	font-size: 12px;

	/* OLSKAppContainerFlexboxParent */
	display: flex;
	flex-direction: column;
}

.OLSKIsLoading :global(.WKCSharedToolbar *), .OLSKIsLoading :global(.MasterContentContainer *), .OLSKIsLoading :global(.DetailContentContainer *) {
	visibility: hidden;
}

.AppContentContainer {
	/* Chrome/Firefox scroll flexbox child */
	overflow: auto;

	/* OLSKAppContainerFlexboxChild */
	flex-grow: 1;

	/* AppContentContainerFlexboxParent */
	display: flex;
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

.OLSKAppContainer {
  position: fixed;

  overflow: hidden;
}

.OLSKAppContainer :global(.WKC_ContextMobileView) {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.OLSKAppContainer :global(.WKC_ContextMobileViewInactive) {
	left: 100vw;
	right: -100vw;
}

.OLSKAppContainer :global(.WKCSharedToolbarButton) {
	width: 20px;
	height: 20px;
	background-size: 20px 20px;
}

.OLSKAppContainer :global(.WKC_ContextMobileExclusive) {
	display: unset;
}

}
</style>
