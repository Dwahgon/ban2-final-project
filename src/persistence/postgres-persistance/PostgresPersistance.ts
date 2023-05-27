import PostgresConnection from "../db-connections/PostgresConnection";
import type { IConnectionConfig } from "../types";

export default class PostgresPersistance {
    private dbConfig: IConnectionConfig;

    constructor(dbConfig: IConnectionConfig) {
        this.dbConfig = dbConfig;
    }

    protected async query(query: string, queryArgs: unknown[] = []) {
        const pgdb = new PostgresConnection();
        await pgdb.connect(this.dbConfig);
        try {
            return await pgdb.query(query, queryArgs);
        } finally {
            await pgdb.disconnect();
        }
    }
}