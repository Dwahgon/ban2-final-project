<div class="p-4">
	<h1>Documentação</h1>
	<div
		class="info-container d-flex flex-row justify-content-between flex-wrap align-content-stretch"
	>
		<div class="m-4">
			<h2>Enunciado</h2>
			<object
				data="docs/enunciado.pdf"
				type="application/pdf"
				title="enunciado"
				width="100%"
				height="500px"
			>
				<p>
					Não foi possível visualizar o PDF. Tente <a href="docs/enunciado.pdf">baixar o PDF aqui</a
					>.
				</p>
			</object>
		</div>
		<div class="m-4">
			<h2>Modelo Conceitual</h2>
			<img
				class="img-fluid"
				src="./docs/modelo-conceitual.png"
				alt="Modelo conceitual do banco de dados"
				style="height: 500px;"
			/>
		</div>
		<div class="m-4">
			<h2>Esquema SQL - DDL</h2>
			<iframe
				src="src/persistence/postgres/ddlsql.sql"
				title="ddlsql"
				height="500"
				frameBorder="0"
				style="width: 100%"
			/>
		</div>
		<div class="m-4">
			<h2>Esquema SQL - Funções e Triggers</h2>
			<iframe
				src="src/persistence/postgres/triggsefuncs.sql"
				title="ddlsql"
				height="500"
				style="width: 100%"
				frameBorder="0"
			/>
		</div>
	</div>
</div>

<style>
	.info-container > * {
		width: 45%;
	}
</style>
