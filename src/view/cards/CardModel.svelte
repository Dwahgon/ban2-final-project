<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { BootstrapColors } from '../../utils/types';

	export let title: string;
	export let badgeText: string = '';
	export let badgeColor: BootstrapColors = 'primary';

	const dispatch = createEventDispatcher();
</script>

<div class="card m-4" style="width: 18rem;">
	<div class="card-body">
		<h5 class="card-title">
			{title}
			{#if badgeText}
				<span class="badge text-bg-{badgeColor}">{badgeText}</span>
			{/if}
		</h5>
	</div>
	<slot />
	<div class="card-body">
		<button class="material-icons btn btn-success" on:click={() => dispatch('edit-clicked')}
			>edit</button
		>
		<button class="material-icons btn btn-danger" on:click={() => dispatch('delete-clicked')}
			>delete</button
		>
	</div>
</div>
