import { Pool, type PoolClient } from 'pg';
import type { IConnectionConfig } from '../types';
import { DB_USER, DB_PW, DB_HOST, DB_NAME, DB_PORT } from '$env/static/private';
import fs from 'fs';

const DDLSQL_PATH = 'src/persistence/postgres/ddlsql.sql';
const TRIGGSEFUNCS_PATH = 'src/persistence/postgres/triggsefuncs.sql';

export default class PostgresConnection {
    private static readonly DEFAULT_DB_USER: string = 'postgres';
    private static readonly DEFAULT_DB_PW: string = 'postgres';
    private static readonly DEFAULT_DB_HOST: string = 'localhost';
    private static readonly DEFAULT_DB_PORT: string = '5432';
    private static readonly DEFAULT_DB_NAME: string = 'postgres';
    private client?: PoolClient;

    static getConnectionConfigFromEnv(): IConnectionConfig {
        return {
            user: DB_USER || this.DEFAULT_DB_USER,
            password: DB_PW || this.DEFAULT_DB_PW,
            host: DB_HOST || this.DEFAULT_DB_HOST,
            port: parseInt(DB_PORT || this.DEFAULT_DB_PORT),
            database: DB_NAME || this.DEFAULT_DB_NAME
        }
    }

    private async initDb(config: IConnectionConfig) {
        await this.createDatabase(config);
        await this.createTables(config);
    }

    private async createTables(config: IConnectionConfig) {
        const ddlSql = fs.readFileSync(DDLSQL_PATH).toString();
        const triggsFuncsSql = fs.readFileSync(TRIGGSEFUNCS_PATH).toString();
        const createDatabasePool = new Pool({
            connectionString: this.generateConnectionString(config)
        });
        const createDatabaseClient = await createDatabasePool.connect();
        await createDatabaseClient.query(ddlSql);
        await createDatabaseClient.query(triggsFuncsSql);
        createDatabaseClient.release();
    }

    private async createDatabase(config: IConnectionConfig) {
        const databaselessPool = new Pool({
            connectionString: this.generateConnectionString(config, false)
        });
        const databaselessClient = await databaselessPool.connect();
        await databaselessClient.query(`create database "${config.database}" with owner=${config.user} encoding=UTF8 LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE template0`);
        databaselessClient.release();
    }

    private generateConnectionString(config: IConnectionConfig, withDatabase = true) {
        return `postgres://${config.user}:${config.password}@${config.host}:${config.port}${withDatabase ? `/${config.database}` : ''}`;
    }

    async connect(config: IConnectionConfig) {
        const pool = new Pool({
            connectionString: this.generateConnectionString(config)
        });
        try {
            this.client = await pool.connect()
        } catch (err) {
            if ((err as Error).message.includes('does not exist')) {
                await this.initDb(config);
                this.client = await pool.connect()
            }
        }
    }

    async disconnect() {
        if (!this.client) throw Error('Not connected');
        this.client.release()
    }

    async query(queryString: string, queryArgs: unknown[] = []): Promise<unknown[]> {
        if (!this.client) throw Error('Not connected');
        return (await this.client.query(queryString, queryArgs)).rows;
    }
}