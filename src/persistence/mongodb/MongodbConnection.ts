import { MongoClient, type Filter, type Document, type OptionalId, type WithoutId } from 'mongodb';
import type { IConnectionConfig } from '../types';
import { DB_USER, DB_PW, DB_HOST, DB_NAME, DB_PORT } from '$env/static/private';

export default class MongodbConnection {
    private static readonly DEFAULT_DB_USER: string = '';
    private static readonly DEFAULT_DB_PW: string = '';
    private static readonly DEFAULT_DB_HOST: string = 'localhost';
    private static readonly DEFAULT_DB_PORT: string = '27017';
    private static readonly DEFAULT_DB_NAME: string = 'mongo';
    private client?: MongoClient;
    private config?: IConnectionConfig;

    static getConnectionConfigFromEnv(): IConnectionConfig {
        return {
            user: DB_USER || this.DEFAULT_DB_USER,
            password: DB_PW || this.DEFAULT_DB_PW,
            host: DB_HOST || this.DEFAULT_DB_HOST,
            port: parseInt(DB_PORT || this.DEFAULT_DB_PORT),
            database: DB_NAME || this.DEFAULT_DB_NAME
        }
    }

    private generateConnectionString(config: IConnectionConfig) {
        return `mongodb://${config.user && config.password ? `${config.user}:${config.password}@` : ''}${config.host}:${config.port}`;
    }

    async connect(config: IConnectionConfig) {
        this.client = new MongoClient(this.generateConnectionString(config));
        try {
            await this.client.connect();
            this.config = config;
        } catch (err) {
            console.log(err);
            await this.disconnect();
        }
    }

    async disconnect() {
        if (!this.client) throw Error('Not connected');
        await this.client.close();
    }

    private db() {
        return this.client?.db(this.config?.database);
    }

    async find(collection: string, filter: Filter<Document>) {
        if (!this.client) throw Error('Not connected');
        return await this.db()?.collection(collection).find(filter).toArray();
    }

    async aggregate(collection: string, pipeline: Document[]) {
        if (!this.client) throw Error('Not connected');
        return await this.db()?.collection(collection).aggregate(pipeline).toArray();
    }

    async insertOne(collection: string, doc: OptionalId<Document>) {
        if (!this.client) throw Error('Not connected');
        return (await this.db()?.collection(collection).insertOne(doc))?.insertedId;
    }

    async delete(collection: string, doc: Filter<Document>) {
        if (!this.client) throw Error('Not connected');
        await this.db()?.collection(collection).deleteOne(doc);
    }

    async replace(collection: string, filter: Filter<Document>, doc: WithoutId<Document>) {
        if (!this.client) throw Error('Not connected');
        await this.db()?.collection(collection).replaceOne(filter, doc);
    }
}