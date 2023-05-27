<script lang="ts">
	import type { Musico } from '../../model/Autores';
	import { toTitleCase } from '../../utils/utils';
	import CardModel from './CardModel.svelte';

	export let musico: Musico;
</script>

<CardModel title={musico.nome} badgeText="Músico" on:edit-clicked on:delete-clicked>
	<ul class="list-group list-group-flush">
		<li class="list-group-item">
			Código Interno: {musico.idAutor}
		</li>
		<li class="list-group-item">
			{@html `Endereço:<br>${Object.entries(musico.endereco)
				.map(([chave, valor]) => `${toTitleCase(chave.substring(1))}: ${String(valor)}`)
				.join('<br>')}`}
		</li>
		<li class="list-group-item">
			Instrumentos: {@html Array.from(musico.instrumentos)
				.map((i) => i.nome)
				.join(', ') || '<i>Nenhum instrumento</i>'}
		</li>
	</ul>
</CardModel>
