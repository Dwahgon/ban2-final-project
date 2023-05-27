import PostgresConnection from "../db-connections/PostgresConnection";
import type { IConnectionConfig } from "../types";

export default class PostgresPersistence {
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

    protected async updateRelations(targetId: number, oldRelations: unknown[] | Set<unknown>, newRelations: unknown[] | Set<unknown>, insertSql: string, deleteSql: string) {
        const oldRelationsSet = oldRelations instanceof Set ? oldRelations : new Set(oldRelations);
        const newRelationsSet = newRelations instanceof Set ? newRelations : new Set(newRelations);
        const oldRelationsArray = Array.isArray(oldRelations) ? oldRelations : Array.from(oldRelations);
        const newRelationsArray = Array.isArray(newRelations) ? newRelations : Array.from(newRelations);

        const removedRelations = oldRelationsArray.filter(r => !newRelationsSet.has(r));
        const addedRelations = newRelationsArray.filter(r => !oldRelationsSet.has(r));

        await this.execRelations(targetId, addedRelations, insertSql);
        await this.execRelations(targetId, removedRelations, deleteSql);
    }

    protected async execRelations(targetId: number, relations: unknown[], relationSql: string) {
        for (const r of relations) {
            await this.query(relationSql, [targetId, r]);
        }
    }
}