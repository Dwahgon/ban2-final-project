import type { Autor } from "../model/Autores";
import type Instrumento from "../model/Instrumento";
import PostgresConnection from "../persistence/db-connections/PostgresConnection";
import PostgresAutorPersistance from "../persistence/postgres-persistance/AutorPersistance";
import PostgresInstrumentoPersistance from "../persistence/postgres-persistance/InstrumentoPersistance";

export default class RecorderController {
    private static _instance: RecorderController;
    private autorPersistance: PostgresAutorPersistance;
    private instrumentoPersistance: PostgresInstrumentoPersistance;

    private constructor() {
        const config = PostgresConnection.getConnectionConfigFromEnv();
        this.autorPersistance = new PostgresAutorPersistance(config);
        this.instrumentoPersistance = new PostgresInstrumentoPersistance(config);
    }

    static get instance() {
        return RecorderController._instance || new this();
    }

    async getAllAutores() {
        return await this.autorPersistance.getAll();
    }

    async getAllMusicos() {
        return await this.autorPersistance.getAllMusicos();
    }

    async getAllBandas() {
        return await this.autorPersistance.getAllBandas();
    }

    async insertAutor(autor: Autor) {
        await this.autorPersistance.insertAutor(autor);
    }

    async updateAutor(autor: Autor) {
        await this.autorPersistance.updateAutor(autor);
    }

    async deleteAutor(id: number) {
        await this.autorPersistance.deleteAutor(id);
    }

    async getAllInstrumentos() {
        return await this.instrumentoPersistance.getAll();
    }

    async insertIntrumento(instrumento: Instrumento) {
        await this.instrumentoPersistance.insert(instrumento);
    }

    async updateInstrumento(instrumento: Instrumento) {
        await this.instrumentoPersistance.update(instrumento);
    }

    async deleteInstrumento(id: number) {
        await this.instrumentoPersistance.delete(id);
    }
}