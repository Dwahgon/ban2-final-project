<script lang="ts">
	import type Instrumento from '../../model/Instrumento';
	import CardModel from './CardModel.svelte';

	export let instrumento: Instrumento;
</script>

<CardModel
	title={instrumento.nome}
	badgeText="Instrumento"
	badgeColor="primary"
	on:edit-clicked
	on:delete-clicked
>
	<ul class="list-group list-group-flush">
		<li class="list-group-item">
			{`Tipo: ${instrumento.tipo}`}
		</li>
		<li class="list-group-item">
			{`Marca: ${instrumento.marca}`}
		</li>
	</ul>
</CardModel>
