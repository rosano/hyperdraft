<script>
export let OLSKToolbarJustify = false;
</script>
<div class="OLSKToolbar" class:OLSKToolbarJustify={ OLSKToolbarJustify }>
	<slot></slot>
</div>

<style>
.OLSKToolbar {
	padding: 0 4px;

	/* Firefox header spacing */
	line-height: 0;

	/* @OLSKToolbarFlexbox:Parent */
	display: flex; 
	align-items: center;
}

:global(.OLSKViewport) .OLSKToolbar {
	/* @OLSKViewportFlexbox:Child */
	flex-shrink: 0;
}

:global(.OLSKIsLoading) .OLSKToolbar :global(*) {
	visibility: hidden;
}

:global(.OLSKToolbarJustify) {
	/* @OLSKToolbarFlexbox:Parent */
	justify-content: space-between;
}

:global(.OLSKToolbarFlexible) {
	/* @OLSKToolbarFlexbox:Child */
	flex-grow: 1;
}

@media screen and (max-width: 760px) {

.OLSKToolbar {
	min-height: 52px;
}

}
</style>
