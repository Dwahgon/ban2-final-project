<script lang="ts">
	import { Musico, type Autor } from '../../model/Autores';
	import type Instrumento from '../../model/Instrumento';
	import type { ActionData } from '../../routes/authors/$types';
	import Alert from '../Alert.svelte';
	import ListField from '../ListField.svelte';
	import FormModal from './FormModal.svelte';

	export let instrumentos: Instrumento[];
	export let autores: Autor[];
	export let formActionData: ActionData;

	$: if (formActionData?.success) formModal.close();

	const DEFAULT_AUTHOR = {
		nome: '',
		tipo: 'm',
		mEnderecoNumero: '',
		mEnderecoComplemento: '',
		mEnderecoRua: '',
		mEnderecoBairro: '',
		mEnderecoCidade: '',
		mEnderecoEstado: '',
		mEnderecoPais: '',
		mEnderecoTelefone: '',
		mInstrumentos: '',
		bDataFormacao: '',
		bDescricao: '',
		bEstilos: '',
		bMembros: ''
	};

	let formModal: FormModal;
	let autorType: 'm' | 'b' = 'm';

	export function promptEditAutor(autor: Autor) {
		autorType = autor instanceof Musico ? 'm' : 'b';
		formModal.promptEdit(autor.toFormData());
	}

	export function promptInsert() {
		formModal.promptInsert();
		autorType = DEFAULT_AUTHOR.tipo as 'm' | 'b';
	}
</script>

<FormModal
	bind:this={formModal}
	id="authorEditor"
	title="Cadastrar Autor"
	initialValues={DEFAULT_AUTHOR}
	action="/authors"
>
	{#if formActionData?.tipo && formActionData?.missing}
		<Alert type="danger">Valor de tipo está faltando</Alert>{/if}
	{#if formActionData?.tipo && formActionData?.invalid}
		<Alert type="danger">Valor de tipo está inválido</Alert>{/if}
	{#if formActionData?.error} <Alert type="danger">{formActionData.error}</Alert>{/if}
	<div class="mb-3">
		<label for="nameInput" class="form-label">Nome</label>
		<input type="text" class="form-control" name="nome" id="nameInput" placeholder="João Silva" />
	</div>
	<div class="mb-3">
		<legend>Tipo de Autor</legend>
		<div class="form-check form-check-inline">
			<input
				class="form-check-input"
				type="radio"
				name="tipo"
				id="tipoInput1"
				value="m"
				group="tipo"
				on:change={() => (autorType = 'm')}
			/>
			<label class="form-check-label" for="tipoInput1">Músico</label>
		</div>
		<div class="form-check form-check-inline">
			<input
				class="form-check-input"
				type="radio"
				name="tipo"
				id="tipoInput2"
				value="b"
				group="tipo"
				on:change={() => (autorType = 'b')}
			/>
			<label class="form-check-label" for="tipoInput2">Banda</label>
		</div>
	</div>
	<div hidden={autorType != 'm'}>
		<div class="mb-3 row g-3">
			<legend>Endereço</legend>
			<div class="col-md-3">
				<label for="mNumeroInput" class="form-label">Número</label>
				<input
					type="number"
					step="1"
					class="form-control"
					id="mNumeroInput"
					name="mEnderecoNumero"
				/>
			</div>
			<div class="col-md-9">
				<label for="mComplementoInput" class="form-label">Complemento</label>
				<input
					type="text"
					class="form-control"
					id="mComplementoInput"
					name="mEnderecoComplemento"
				/>
			</div>
			<div class="col-md-6">
				<label for="mRuaInput" class="form-label">Rua</label>
				<input type="text" class="form-control" id="mRuaInput" name="mEnderecoRua" />
			</div>
			<div class="col-md-6">
				<label for="mBairroInput" class="form-label">Bairro</label>
				<input type="text" class="form-control" id="mBairroInput" name="mEnderecoBairro" />
			</div>
			<div class="col-md-5">
				<label for="mCidadeInput" class="form-label">Cidade</label>
				<input type="text" class="form-control" id="mCidadeInput" name="mEnderecoCidade" />
			</div>
			<div class="col-md-3">
				<label for="mEstadoInput" class="form-label">UF</label>
				<input type="text" class="form-control" id="mEstadoInput" name="mEnderecoEstado" />
			</div>
			<div class="col-md-4">
				<label for="mPaisInput" class="form-label">País</label>
				<input type="text" class="form-control" id="mPaisInput" name="mEnderecoPais" />
			</div>
			<div class="col-md-12">
				<label for="mTelefoneInput" class="form-label">Telefone</label>
				<input type="text" class="form-control" id="mTelefoneInput" name="mEnderecoTelefone" />
			</div>
		</div>
		<ListField
			name="mInstrumentos"
			labelText="Instrumentos"
			inputType="select"
			idLabelMap={new Map(instrumentos.map((i) => [i.idInstrumento || -1, i.nome]))}
		/>
	</div>
	<div hidden={autorType != 'b'}>
		<div class="mb-3">
			<label for="bDescricao" class="form-label">Descrição</label>
			<input type="textarea" class="form-control" id="bDescricao" name="bDescricao" />
		</div>
		<div class="mb-3">
			<label for="bDataFormacao" class="form-label">Data Formação</label>
			<input type="date" class="form-control" id="bDataFormacao" name="bDataFormacao" />
		</div>
		<ListField name="bEstilos" labelText="Estilos" />
		<ListField
			name="bMembros"
			labelText="Membros"
			inputType="select"
			idLabelMap={new Map(
				autores.filter((a) => a instanceof Musico).map((a) => [a.idAutor || -1, a.nome])
			)}
		/>
	</div>
</FormModal>
