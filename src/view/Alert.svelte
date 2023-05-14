<script lang="ts">
	import type { BootstrapColors } from '../utils/types';

	export let type: BootstrapColors = 'info';
</script>

<div class="alert alert-{type} alert-dismissible fade show m-4" role="alert">
	<slot />
	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" />
</div>
