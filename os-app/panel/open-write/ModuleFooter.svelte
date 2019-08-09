<script>
import { OLSKLocalized } from '../../_shared/common/global.js';
import OLSKServiceWorker from '../../_shared/_external/OLSKServiceWorker/Main.svelte';
</script>

<footer class="WKCSharedToolbar">
	<div class="WKCSharedToolbarElementGroup">
		<button on:click={ () => window.location.reload() } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" title={ OLSKLocalized('WKCWriteFooterToolbarReloadButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedReload.svg')" id="WKCWriteReloadButton"></button>
	</div>
</footer>

	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />

<style>
footer {
	border-top: var(--WIKBorderStyle);

	/* AppContainerFlexboxChild */
	flex-shrink: 0;

	/* WKCSharedToolbarFlexboxParent */
	justify-content: flex-start;
}
</style>
