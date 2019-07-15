<script>
import ModuleMaster from './ModuleMaster.svelte';
import ModuleDetail from './ModuleDetail.svelte';

import { storageClient } from './persistence.js';

import { onMount } from 'svelte';
import Widget from '../_shared/_external/remotestorage-widget/build/widget.js';
onMount(function () {
	(new Widget(storageClient.remoteStorage)).attach('WIKComposeStorageWidget');	
});
</script>

<div class="AppContainer">

<div class="AppContentContainer">
	<ModuleMaster />
	<ModuleDetail />
</div>

</div>

<div id="WIKComposeStorageWidget"></div>
<div class="WIKComposeDebug">
	<button class="WIKSharedButtonNoStyle" onclick="location.reload();">{ window.OLSKLocalized('WIKUpdateReloadText') }</button>
</div>

<style>
.AppContainer {
	height: 100vh;

	font-family: 'Helvetica Neue', 'Helvetica', sans;

	/* AppContainerFlexboxParent */
	display: flex;
	flex-direction: column;
}

.AppContentContainer {
	/* AppContainerFlexboxChild */
	flex-grow: 1;

	/* AppContentContainerFlexboxParent */
	display: flex;
}
</style>
