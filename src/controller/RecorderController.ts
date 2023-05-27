import type { Autor } from "../model/Autores";
import type Instrumento from "../model/Instrumento";
import PostgresConnection from "../persistence/postgres/PostgresConnection";
import PostgresAutorPersistence from "../persistence/postgres/AutorPersistence";
import PostgresInstrumentoPersistence from "../persistence/postgres/InstrumentoPersistence";

export default class RecorderController {
    private static _instance: RecorderController;
    private autorPersistence: PostgresAutorPersistence;
    private instrumentoPersistence: PostgresInstrumentoPersistence;

    private constructor() {
        const config = PostgresConnection.getConnectionConfigFromEnv();
        this.autorPersistence = new PostgresAutorPersistence(config);
        this.instrumentoPersistence = new PostgresInstrumentoPersistence(config);
    }

    static get instance() {
        return RecorderController._instance || new this();
    }

    async getAllAutores() {
        return await this.autorPersistence.getAll();
    }

    async getAllMusicos() {
        return await this.autorPersistence.getAllMusicos();
    }

    async getAllBandas() {
        return await this.autorPersistence.getAllBandas();
    }

    async insertAutor(autor: Autor) {
        await this.autorPersistence.insertAutor(autor);
    }

    async updateAutor(autor: Autor) {
        await this.autorPersistence.updateAutor(autor);
    }

    async deleteAutor(id: number) {
        await this.autorPersistence.deleteAutor(id);
    }

    async getAllInstrumentos() {
        return await this.instrumentoPersistence.getAll();
    }

    async insertIntrumento(instrumento: Instrumento) {
        await this.instrumentoPersistence.insert(instrumento);
    }

    async updateInstrumento(instrumento: Instrumento) {
        await this.instrumentoPersistence.update(instrumento);
    }

    async deleteInstrumento(id: number) {
        await this.instrumentoPersistence.delete(id);
    }
}