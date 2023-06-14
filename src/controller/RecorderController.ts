import type { Autor } from "../model/Autores";
import type Instrumento from "../model/Instrumento";
// import PostgresConnection from "../persistence/postgres/PostgresConnection";
// import PostgresAutorPersistence from "../persistence/postgres/AutorPersistence";
// import PostgresInstrumentoPersistence from "../persistence/postgres/InstrumentoPersistence";
import MongoAutorPersistence from "../persistence/mongodb/AutorPersisence";
import MongoInstrumentoPersistence from "../persistence/mongodb/InstrumentoPersistence";
import MongodbConnection from "../persistence/mongodb/MongodbConnection";

export default class RecorderController {
    private static _instance: RecorderController;
    // private autorPersistence: PostgresAutorPersistence;
    // private instrumentoPersistence: PostgresInstrumentoPersistence;
    private autorPersistence: MongoAutorPersistence;
    private instrumentoPersistence: MongoInstrumentoPersistence;

    private constructor() {
        const config = MongodbConnection.getConnectionConfigFromEnv();
        // this.autorPersistence = new PostgresAutorPersistence(config);
        // this.instrumentoPersistence = new PostgresInstrumentoPersistence(config);
        this.autorPersistence = new MongoAutorPersistence(config);
        this.instrumentoPersistence = new MongoInstrumentoPersistence(config);
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
        await this.instrumentoPersistence.insertInstrumento(instrumento);
    }

    async updateInstrumento(instrumento: Instrumento) {
        await this.instrumentoPersistence.updateInstrumento(instrumento);
    }

    async deleteInstrumento(id: number) {
        await this.instrumentoPersistence.deleteInstrumento(id);
    }
}