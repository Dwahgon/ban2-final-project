import type { ObjectId } from "mongodb";

export const convertMongoIdToDecimal = (mongoId: ObjectId) => parseInt(mongoId.toHexString(), 16);