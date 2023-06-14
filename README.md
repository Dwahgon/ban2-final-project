# Trabalho Final de BAN2 - Gravadora

Trabalho final da disciplina de Banco de Dados 2, cujo tema é Gravadora.

## Enunciado

A companhia discográfica decidiu criar uma base de dados com informação sobre os seus
músicos bem como outra informação da companhia. As informações dadas ao projetista foram
as seguintes:
- [x] Cada músico tem um nro. de registro, um nome, um endereço e um número de
telefone. Os músicos em início de carreira muitas vezes partilham um endereço e,
além disso, assume-se que cada endereço só tem um telefone.
- [x] Cada músico pode pertencer a uma ou mais bandas.
- [x] Cada instrumento usado nos estúdios tem um nome (ex. guitarra, bateria, etc.) e um
código interno.
- [ ] Cada disco gravado na companhia tem um título, uma data, um formato (ex. CD, MC,
K7), e um identificador do disco.
- [ ] Cada música gravada na companhia tem um título e autores.
- [x] Cada músico pode tocar vários instrumentos, e cada instrumento pode ser tocado por
vários músicos.
- [ ] Cada disco pertence a um músico ou a uma banca e tem um certo número de músicas,
mas cada música pode aparecer em um ou mais discos.
- [ ] Cada música pode ter a participação de vários músicos ou bandas, e cada músico ou
banca pode participar em várias músicas.
- [ ] Cada disco tem um produtor. Os produtores podem produzir vários discos.

## Como rodar o projeto

### Versão Postgres

1. Tenha um servidor PostgreSQL em execução disponível localmente ou externamente.
    * Comando para iniciar um servidor via Docker:
```bash
# Configurações padrões:
# Usuário: postgres
# Porta: 5432
sudo docker run --name nome-do-container-aqui -e POSTGRES_PASSWORD=senha-aqui -d postgres

# Pegar o endereço IP do container
sudo docker inspect nome-do-container-aqui | grep IPAddress
```
2. Crie um arquivo `.env` na pasta raiz do projeto contendo as seguintes informações:
```bash
DB_USER='usuario-do-bd'
DB_PW='senha-do-usuario-do-bd'
DB_HOST='endereco-do-hospedeiro-do-bd'
DB_PORT='porta-do-bd'
DB_NAME='nome-do-bd'
```
3. Instale as dependências do projeto via `npm`:
```bash
npm install
```
4. Rode o projeto em modo desenvolvedor:
```bash
npm run dev
```

### Versão MongoDb
1. Tenha um servidor PostgreSQL em execução disponível localmente ou externamente.
    * Comando para iniciar um servidor via Docker:
```bash
sudo docker run --name nome-do-container-aqui -p 27017:27017 -d mongo
```
2. Crie um arquivo `.env` na pasta raiz do projeto contendo as seguintes informações:
```bash
# Deixe DB_USER e DB_PW vazios quando rodar o mongodb por meio do comando acima
DB_USER='usuario-do-bd'
DB_PW='senha-do-usuario-do-bd'
DB_HOST='endereco-do-hospedeiro-do-bd'
DB_PORT='porta-do-bd'
DB_NAME='nome-do-bd'
```
3. Instale as dependências do projeto via `npm`:
```bash
npm install
```
4. Rode o projeto em modo desenvolvedor:
```bash
npm run dev
```