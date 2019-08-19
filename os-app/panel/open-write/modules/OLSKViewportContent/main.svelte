<script>
</script>

<div class="OLSKViewportContent">
	<slot></slot>
</div>

<style>
.OLSKViewportContent {
	--OLSKViewportMasterWidth: 300px;
	/* Chrome/Firefox scroll flexbox child */
	overflow: auto;

	/* @OLSKViewportFlexbox:Child */
	flex-grow: 1;

	/* @OLSKViewportContentFlexbox:Parent */
	display: flex;
}

.OLSKViewportContent :global(.OLSKViewportMaster) {
	/* @OLSKViewportContentFlexbox:Child */
	flex-basis: var(--OLSKViewportMasterWidth);
	flex-shrink: 0;
}
</style>
