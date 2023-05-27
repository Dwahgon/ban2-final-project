import { Autor, Banda, Musico } from "../../model/Autores";
import Instrumento, { type InstrumentoPostgresEntry } from "../../model/Instrumento";
import PostgresPersistance from "./PostgresPersistance";

type IEstiloBanda = {
    id_a: number,
    estilo: string
}
const GET_MUSICOS_SQL = 'select * from autores where tipo=\'m\'';
const GET_BANDAS_SQL = 'select * from autores where tipo=\'b\'';
const GET_MEMBROS_BANDA = 'select * from autores join membro_banda on musico=id_a where tipo=\'m\';';
const GET_INSTRUMENTOS_MUSICO = 'select * from instrumentos join instrumento_musico using (id_i)';
const GET_ID_MEMBROS_OF_BANDA = 'select musico from membro_banda where banda=$1';
const GET_ID_INSTRUMENTOS_OF_MUSICO = 'select id_i from instrumento_musico where id_a=$1';
const GET_ESTILO_SQL = 'select * from estilos_bandas';
const GET_ESTILO_WHERE_BANDA_SQL = 'select estilo from estilos_bandas where id_a=$1';
const INSERT_SQL = 'insert into autores(nome, tipo, m_endereco_numero, m_endereco_complemento, m_endereco_rua, m_endereco_bairro, m_endereco_cidade, m_endereco_estado, m_endereco_pais, m_endereco_telefone, b_data_formacao, b_descricao) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning id_a';
const INSERT_ESTILO_SQL = 'insert into estilos_bandas(id_a, estilo) values ($1, $2) on conflict do nothing';
const INSERT_MEMBRO_BANDA_SQL = 'insert into membro_banda(banda, musico) values ($1, $2) on conflict do nothing';
const INSERT_INSTRUMENTO_MUSICO_SQL = 'insert into instrumento_musico(id_a, id_i) values ($1, $2) on conflict do nothing';
const DELETE_ESTILO = 'delete from estilos_bandas where id_a=$1 and estilo=$2';
const DELETE_MEMBRO_BANDA_SQL = 'delete from membro_banda where banda=$1 and musico=$2';
const DELETE_INSTRUMENTO_MUSICO_SQL = 'delete from instrumento_musico where id_a=$1 and id_i=$2';
const UPDATE_SQL = 'update autores set nome=$1, tipo=$2, m_endereco_numero=$3, m_endereco_complemento=$4, m_endereco_rua=$5, m_endereco_bairro=$6, m_endereco_cidade=$7, m_endereco_estado=$8, m_endereco_pais=$9, m_endereco_telefone=$10, b_data_formacao=$11, b_descricao=$12 where id_a=$13';
const DELETE_SQL = 'delete from autores where id_a=$1';

export default class PostgresAutorPersistance extends PostgresPersistance {
    private queryResultToMusico(queryResult: unknown[], instrumentosMusico: Map<number, Instrumento[]>) {
        return queryResult
            .map(result => {
                const idA = (result as { id_a: number }).id_a;
                return Object.assign(result as object, {
                    instrumentos: new Set(instrumentosMusico.get(idA)) || new Set()
                });
            })
            .map((result: unknown) => Musico.fromPostgresQuery(result));
    }

    private queryResultToBanda(queryResult: unknown[], estilosGroupedByBanda: Map<number, Set<string>>, membrosBanda: Map<number, Musico[]>) {
        return queryResult
            .map((result) => {
                const idA = (result as { id_a: number }).id_a;
                return Object.assign(result as object, {
                    estilos: estilosGroupedByBanda.get(idA) || new Set(),
                    membros: new Set(membrosBanda.get(idA)) || new Set()
                });
            }) // Add estilos
            .map((result: unknown) => Banda.fromPostgresQuery(result));
    }

    private async getEstilosGroupedByBanda() {
        return (await this.query(GET_ESTILO_SQL)).reduce<Map<number, Set<string>>>((map, estiloBanda) => {
            const idA = (estiloBanda as IEstiloBanda).id_a;
            const estilo = (estiloBanda as IEstiloBanda).estilo;
            map.get(idA)?.add(estilo) || map.set(idA, new Set([estilo]));
            return map;
        }, new Map<number, Set<string>>());
    }

    private async getMembrosBanda() {
        return (await this.query(GET_MEMBROS_BANDA)).reduce<Map<number, Musico[]>>(
            (map, result) => {
                const musico = Musico.fromPostgresQuery(result);
                const idBanda = (result as { banda: number }).banda;
                map.get(idBanda)?.push(musico) || map.set(idBanda, [musico])
                return map;
            },
            new Map()
        )
    }

    private async getInstrumentosMusico() {
        return (await this.query(GET_INSTRUMENTOS_MUSICO)).reduce<Map<number, Instrumento[]>>(
            (map, result) => {
                const instrumento = Instrumento.fromPostgresQuery(result as InstrumentoPostgresEntry);
                const idMusico = (result as { id_a: number }).id_a;
                map.get(idMusico)?.push(instrumento) || map.set(idMusico, [instrumento]);
                return map;
            },
            new Map()
        );
    }

    async getAll(): Promise<Autor[]> {
        return [...await this.getAllMusicos(), ...await this.getAllBandas()];
    }

    async getAllMusicos(): Promise<Musico[]> {
        return this.queryResultToMusico(
            await this.query(GET_MUSICOS_SQL),
            await this.getInstrumentosMusico()
        );
    }

    async getAllBandas(): Promise<Banda[]> {
        return this.queryResultToBanda(
            await this.query(GET_BANDAS_SQL),
            await this.getEstilosGroupedByBanda(),
            await this.getMembrosBanda()
        );
    }

    async updateAutor(autor: Autor): Promise<void> {
        if (!autor.idAutor) throw Error('Autor must have id for update operations');
        await this.query(UPDATE_SQL, autor.toPostgresSqlValues());
        const params = [autor.idAutor];

        if (autor instanceof Musico) {
            // Update instrumento relations
            await this.updateRelations(
                autor.idAutor,
                (await this.query(GET_ID_INSTRUMENTOS_OF_MUSICO, params)).map(query => (query as { id_i: string }).id_i),
                Array.from(autor.instrumentos).map(i => i.idInstrumento),
                INSERT_INSTRUMENTO_MUSICO_SQL, DELETE_INSTRUMENTO_MUSICO_SQL
            )
        }
        if (autor instanceof Banda) {
            // Update estilo relations
            await this.updateRelations(
                autor.idAutor,
                (await this.query(GET_ESTILO_WHERE_BANDA_SQL, params)).map(estiloQuery => (estiloQuery as { estilo: string }).estilo),
                autor.estilos,
                INSERT_ESTILO_SQL, DELETE_ESTILO
            )

            // Update membro relations
            await this.updateRelations(
                autor.idAutor,
                (await this.query(GET_ID_MEMBROS_OF_BANDA, params)).map(membroQuery => Number((membroQuery as { musico: string }).musico)),
                Array.from(autor.membros).map(a => a.idAutor),
                INSERT_MEMBRO_BANDA_SQL, DELETE_MEMBRO_BANDA_SQL
            );
        }
    }

    async insertAutor(autor: Autor): Promise<void> {
        const id = (await this.query(INSERT_SQL, autor.toPostgresSqlValues().slice(0, -1)) as { id_a: number }[])[0].id_a;
        if (autor instanceof Musico) {
            await this.execRelations(id, Array.from(autor.instrumentos).map(i => i.idInstrumento), INSERT_INSTRUMENTO_MUSICO_SQL);
        }
        if (autor instanceof Banda) {
            await this.execRelations(id, Array.from(autor.estilos), INSERT_ESTILO_SQL);
            await this.execRelations(id, Array.from(autor.membros).map(m => m.idAutor), INSERT_MEMBRO_BANDA_SQL);
        }
    }

    async deleteAutor(id: number): Promise<void> {
        await this.query(DELETE_SQL, [id]);
    }
}