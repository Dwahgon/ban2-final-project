<script lang="ts">
	export let name: string;
	export let inputType: 'text' | 'select' = 'text';

	export let idLabelMap: Map<number, string> = new Map();
	export let labelText: string = '';
	export let textInputPlaceholder: string = '';

	let inputElement: HTMLInputElement | HTMLSelectElement;
	let valueElement: HTMLInputElement;

	let value: string = '';
	function addValue(newValue: string) {
		if (newValue == '') return;
		value = Array.from(
			new Set([...value.split(',').filter((v) => v != ''), newValue.replaceAll(',', '')])
		).join(',');
	}

	function removeValue(newValue: string) {
		value = value
			.split(',')
			.filter((v) => v != newValue)
			.join(',');
	}
</script>

<div class="mb-3">
	<input
		type="hidden"
		{name}
		bind:this={valueElement}
		bind:value
		on:change={() => (value = valueElement.value)}
	/>
	<label for="{name}-textinput" class="form-label">{labelText}</label>
	<div class="input-group mb-3">
		{#if inputType == 'text'}
			<input
				bind:this={inputElement}
				type="text"
				class="form-control"
				id="{name}-textinput"
				placeholder={textInputPlaceholder}
			/>
		{:else if inputType == 'select'}
			<select bind:this={inputElement} class="form-select">
				<option value="" selected />
				{#each Array.from(idLabelMap.entries()) as [id, label]}
					<option value={id}>{label}</option>
				{/each}
			</select>
		{/if}
		<button
			type="button"
			class="btn btn-success material-icons"
			on:click={() => (addValue(inputElement.value), (inputElement.value = ''))}>add_circle</button
		>
	</div>
</div>
{#if value.split(',').filter((v) => v != '').length > 0}
	<div
		class="mb-3 px-2 pt-2 bg-black border border-black rounded flex-column"
		style="--bs-bg-opacity: .1;--bs-border-opacity: .3;"
	>
		{#each value.split(',').filter((v) => v != '') as subValue}
			<div class="input-group mb-2">
				<div class="form-control">
					{inputType == 'text' ? subValue : idLabelMap.get(Number(subValue))}
				</div>
				<button
					type="button"
					class="btn btn-danger material-icons"
					on:click={() => removeValue(subValue)}>delete</button
				>
			</div>
		{/each}
	</div>
{/if}
