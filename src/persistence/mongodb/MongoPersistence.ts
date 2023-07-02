import { type Filter, type Document, type OptionalId, ObjectId, type WithoutId, type UpdateFilter } from "mongodb";
import type { IConnectionConfig } from "../types";
import MongodbConnection from "./MongodbConnection";

export default class MongoPersistence {
    protected static readonly COLLECTION: string;
    private dbConfig: IConnectionConfig;

    constructor(dbConfig: IConnectionConfig) {
        this.dbConfig = dbConfig;
    }

    private getCollection() {
        return Object.getPrototypeOf(this).constructor.COLLECTION;
    }

    protected convertMongoIdToDecimal(mongoId: ObjectId) {
        return parseInt(mongoId.toHexString(), 16);
    }

    protected convertDecimalToMongoId(id: number) {
        return new ObjectId(id.toString(16).padStart(24, '0'))
    }

    protected generateId() {
        return new ObjectId(new ObjectId().toHexString().substring(16).padStart(24, '0'));
    }

    protected async find(params: Filter<Document>) {
        const mongodb = new MongodbConnection();
        try {
            await mongodb.connect(this.dbConfig);
            return await mongodb.find(this.getCollection(), params);
        } finally {
            await mongodb.disconnect();
        }
    }

    protected async aggregate(params: Document[]) {
        const mongodb = new MongodbConnection();
        try {
            await mongodb.connect(this.dbConfig);
            return await mongodb.aggregate(this.getCollection(), params);
        } finally {
            await mongodb.disconnect();
        }
    }

    protected async insert(params: OptionalId<Document>) {
        const mongodb = new MongodbConnection();
        try {
            await mongodb.connect(this.dbConfig);
            return await mongodb.insertOne(this.getCollection(), params);
        } finally {
            await mongodb.disconnect();
        }
    }

    protected async delete(params: Filter<Document>) {
        const mongodb = new MongodbConnection();
        try {
            await mongodb.connect(this.dbConfig);
            return await mongodb.delete(this.getCollection(), params);
        } finally {
            await mongodb.disconnect();
        }
    }

    protected async replace(filter: Filter<Document>, doc: WithoutId<Document>) {
        const mongodb = new MongodbConnection();
        try {
            await mongodb.connect(this.dbConfig);
            return await mongodb.replace(this.getCollection(), filter, doc);
        } finally {
            await mongodb.disconnect();
        }
    }

    protected async updateMany(filter: Filter<Document>, update: UpdateFilter<Document>) {
        const mongodb = new MongodbConnection();
        try {
            await mongodb.connect(this.dbConfig);
            return await mongodb.updateMany(this.getCollection(), filter, update);
        } finally {
            await mongodb.disconnect();
        }
    }
}