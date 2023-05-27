<script lang="ts">
	import { Banda, Musico, type Autor } from '../../model/Autores';
	import CardBanda from './CardBanda.svelte';
	import CardMusico from './CardMusico.svelte';

	export let autor: Autor;
</script>

{#if autor instanceof Musico}
	<CardMusico musico={autor} on:edit-clicked on:delete-clicked />
{:else if autor instanceof Banda}
	<CardBanda banda={autor} on:edit-clicked on:delete-clicked />
{/if}
