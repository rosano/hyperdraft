<script>
import { OLSKLocalized } from '../../_shared/common/global.js'
</script>

<footer class="WKCSharedToolbar">
	<div class="WKCSharedToolbarElementGroup">
		<button on:click={ () => window.location.reload() } class="WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" title={ OLSKLocalized('WKCWriteFooterToolbarReloadButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedReload.svg')"></button>
	</div>
</footer>

<style>
footer {
	border-top: var(--WIKBorderStyle);

	/* AppContainerFlexboxChild */
	flex-shrink: 0;

	/* WKCSharedToolbarFlexboxParent */
	justify-content: flex-start;
}
</style>
