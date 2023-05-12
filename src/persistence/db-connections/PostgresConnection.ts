import { Pool, type PoolClient } from 'pg';
import type { IPostgresConnectionConfig } from '../types';

export default class PostgresConnection {
    client?: PoolClient;

    static getConnectionConfigFromEnv(): IPostgresConnectionConfig {
        return {
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PW || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'postgres'
        }
    }

    async connect(config: IPostgresConnectionConfig) {
        const pool = new Pool({
            connectionString: `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`
        });
        this.client = await pool.connect();
    }

    async disconnect() {
        if (!this.client) throw Error('Not connected');
        this.client.release()
    }

    async query(queryString: string) {
        if (!this.client) throw Error('Not connected');
        this.client.query(queryString);
    }
}