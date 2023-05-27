import Instrumento, { type InstrumentoPostgresEntry } from "../../model/Instrumento";
import PostgresPersistence from "./PostgresPersistence";

const GET_ALL_SQL = 'select * from instrumentos';
const INSERT_SQL = 'insert into instrumentos(nome, tipo, marca) values ($1, $2, $3)';
const UPDATE_SQL = 'update instrumentos set nome=$1, tipo=$2, marca=$3 where id_i=$4';
const DELETE_SQL = 'delete from instrumentos where id_i=$1';

export default class PostgresInstrumentoPersistence extends PostgresPersistence {
    async getAll(): Promise<Instrumento[]> {
        return (await this.query(GET_ALL_SQL)).map(i => Instrumento.fromPostgresQuery(i as InstrumentoPostgresEntry));
    }

    async insert(instrumento: Instrumento): Promise<void> {
        await this.query(INSERT_SQL, instrumento.toPostgresSqlValues());
    }

    async update(instrumento: Instrumento): Promise<void> {
        await this.query(UPDATE_SQL, [...instrumento.toPostgresSqlValues(), instrumento.idInstrumento]);
    }

    async delete(id: number): Promise<void> {
        await this.query(DELETE_SQL, [id]);
    }
}