<script>
</script>

<div class="OLSKViewportContentContainer">
	<slot></slot>
</div>

<style>
.OLSKViewportContentContainer {
	--OLSKViewportMasterWidth: 300px;
	/* Chrome/Firefox scroll flexbox child */
	overflow: auto;

	/* @OLSKViewportFlexbox:Child */
	flex-grow: 1;

	/* @OLSKViewportContentContainerFlexbox:Parent */
	display: flex;
}

.OLSKViewportContentContainer :global(.OLSKViewportMaster) {
	/* @OLSKViewportContentContainerFlexbox:Child */
	flex-basis: var(--OLSKViewportMasterWidth);
	flex-shrink: 0;
}
</style>
