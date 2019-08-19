<script>
import OLSKServiceWorker from '../../_shared/_external/OLSKServiceWorker/Main.svelte';

import {
	OLSKLocalized,
	_WIKIsTestingBehaviour,
} from '../../_shared/common/global.js';
</script>

<footer class="OLSKToolbar">
	<div class="OLSKToolbarElementGroup">
		<button on:click={ () => window.location.reload() } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" title={ OLSKLocalized('WKCWriteFooterToolbarReloadButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedReload.svg')" id="WKCWriteReloadButton"></button>
	</div>
</footer>

{#if !_WIKIsTestingBehaviour()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style>
footer {
	border-top: var(--WIKBorderStyle);

	/* @OLSKViewportFlexbox:Child */
	flex-shrink: 0;

	/* @OLSKToolbarFlexbox:Parent */
	justify-content: flex-start;
}
</style>
