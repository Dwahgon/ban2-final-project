<script lang="ts">
	import type { Banda } from '../../model/Autores';
	import { formatDate } from '../../utils/utils';
	import CardModel from './CardModel.svelte';

	export let banda: Banda;
</script>

<CardModel
	title={banda.nome}
	badgeColor={'info'}
	badgeText="Banda"
	on:edit-clicked
	on:delete-clicked
>
	<ul class="list-group list-group-flush">
		<li class="list-group-item">
			Código Interno: {banda.idAutor}
		</li>
		<li class="list-group-item">
			Descrição: {banda.descricao}
		</li>
		<li class="list-group-item">
			Data Formação: {formatDate(banda.dataFormacao, 'dd/mm/YYYY')}
		</li>
		<li class="list-group-item">
			Membros: {@html Array.from(banda.membros)
				.map((a) => a.nome)
				.join(', ') || '<i>Nenhum membro</i>'}
		</li>
		<li class="list-group-item">
			Estilos: {@html Array.from(banda.estilos).join(', ') || '<i>Nenhum estilo</i>'}
		</li>
	</ul>
</CardModel>
