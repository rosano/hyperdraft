<script>
import ModuleMaster from './ModuleMaster.svelte';
import ModuleDetail from './ModuleDetail.svelte';
import ModuleFooter from './ModuleFooter.svelte';

import { OLSKLocalized } from '../../_shared/common/global.js';
import { storageClient, isLoading, isMobile } from './persistence.js';

import { onMount } from 'svelte';
import Widget from 'remotestorage-widget';
onMount(function () {
	(new Widget(storageClient.remoteStorage)).attach('WIKWriteStorageWidget');	
});
</script>

<div class="AppContainer" class:AppIsLoading={ $isLoading }>

<div class="AppContentContainer">
	<ModuleMaster />
	<ModuleDetail />
</div>

{#if !isMobile()}
	<ModuleFooter />
{/if}

</div>

<div id="WIKWriteStorageWidget"></div>
<div class="WIKWriteDebug">
	<button class="WIKSharedButtonNoStyle" onclick="location.reload();">{ OLSKLocalized('WKCUpdateReloadText') }</button>
</div>

<style>
.AppContainer {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;

	font-family: 'Helvetica Neue', 'Helvetica', sans;
	font-size: 12px;

	/* AppContainerFlexboxParent */
	display: flex;
	flex-direction: column;
}

.AppIsLoading :global(.WKCSharedToolbar *), .AppIsLoading :global(.MasterContentContainer *), .AppIsLoading :global(.DetailContentContainer *) {
	visibility: hidden;
}

.AppContentContainer {
	/* AppContainerFlexboxChild */
	flex-grow: 1;

	/* AppContentContainerFlexboxParent */
	display: flex;
}

@media screen and (max-width: 760px) {

.AppContainer {
  position: fixed;

  overflow: hidden;
}

.AppContainer :global(.WKC_ContextMobileView) {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.AppContainer :global(.WKC_ContextMobileViewInactive) {
	left: 100vw;
	right: -100vw;
}

.AppContainer :global(.WKCSharedToolbarButton) {
	width: 20px;
	height: 20px;
	background-size: 20px 20px;
}

.AppContainer :global(.WKC_ContextMobileExclusive) {
	display: unset;
}

}
</style>
