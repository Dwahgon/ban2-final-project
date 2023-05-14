import type { Autor } from "../model/Autores";
import PostgresConnection from "../persistence/db-connections/PostgresConnection";
import PostgresAutorPersistance from "../persistence/postgres-persistance/AutorPersistance";

export default class RecorderController {
    private static _instance: RecorderController;
    private autorPersistance;

    private constructor() {
        const config = PostgresConnection.getConnectionConfigFromEnv();
        this.autorPersistance = new PostgresAutorPersistance(config);
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
}