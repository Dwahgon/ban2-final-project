<script lang="ts">
	export let tabs: string[];
	export let selectedTab: string = tabs[0];
</script>

<ul class="nav nav-tabs" role="tablist">
	{#each tabs as tab}
		<li class="nav-item">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<button
				class="nav-link {selectedTab == tab ? 'active' : ''}"
				on:click={function () {
					selectedTab = tab;
					tabs = tabs;
				}}>{tab}</button
			>
		</li>
	{/each}
</ul>
