<script>
export let WIKWriteFooterStorageStatus = '';

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKServiceWorker from '../../_shared/__external/OLSKServiceWorker/main.svelte';

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

		<div>
			<div class="WIKWriteFooterStorageStatus">{ WIKWriteFooterStorageStatus }</div>
		</div>
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
