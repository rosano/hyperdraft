<script>
import OLSKServiceWorker from '../../_shared/_external/OLSKServiceWorker/Main.svelte';

import {
	OLSKLocalized,
	_WIKIsTestingBehaviour,
} from '../../_shared/common/global.js';
</script>

<footer class="WKCSharedToolbar">
	<div class="WKCSharedToolbarElementGroup">
		<button on:click={ () => window.location.reload() } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" title={ OLSKLocalized('WKCWriteFooterToolbarReloadButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedReload.svg')" id="WKCWriteReloadButton"></button>
	</div>
</footer>

{#if !_WIKIsTestingBehaviour()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style>
footer {
	border-top: var(--WIKBorderStyle);

	/* OLSKViewportFlexboxChild */
	flex-shrink: 0;

	/* WKCSharedToolbarFlexboxParent */
	justify-content: flex-start;
}
</style>
