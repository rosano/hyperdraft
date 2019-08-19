<script>
</script>

<div class="OLSKViewportContentContainer">
	<slot></slot>
</div>

<style>
.OLSKViewportContentContainer {
	/* Chrome/Firefox scroll flexbox child */
	overflow: auto;

	/* @OLSKViewportFlexbox:Child */
	flex-grow: 1;

	/* @OLSKViewportContentContainerFlexbox:Parent */
	display: flex;
}
</style>
