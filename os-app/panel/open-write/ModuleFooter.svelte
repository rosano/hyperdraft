<script>
import OLSKToolbar from './modules/OLSKToolbar/main.svelte';
import OLSKToolbarElementGroup from './modules/OLSKToolbarElementGroup/main.svelte';
import OLSKServiceWorker from '../../_shared/_external/OLSKServiceWorker/Main.svelte';

import {
	OLSKLocalized,
	_WIKIsTestingBehaviour,
} from '../../_shared/common/global.js';
</script>

<footer>
	<OLSKToolbar>
		<OLSKToolbarElementGroup>
			<button on:click={ () => window.location.reload() } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" title={ OLSKLocalized('WKCWriteFooterToolbarReloadButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedReload.svg')" id="WKCWriteReloadButton"></button>
		</OLSKToolbarElementGroup>
	</OLSKToolbar>
</footer>

{#if !_WIKIsTestingBehaviour()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style>
footer {
	border-top: var(--WIKBorderStyle);
}
</style>
