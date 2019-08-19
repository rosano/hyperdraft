<script>
export let OLSKIsLoading = false;
</script>

<div class="OLSKViewport" class:OLSKIsLoading={ OLSKIsLoading }>
	<slot></slot>
</div>

<style>
.OLSKViewport {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;

	/* OLSKViewportFlexboxParent */
	display: flex;
	flex-direction: column;
}
</style>
