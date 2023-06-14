import Instrumento from "../../model/Instrumento";
import MongoPersistence from "./MongoPersistence";


export default class MongoInstrumentoPersistence extends MongoPersistence {
    protected static readonly COLLECTION: string = 'instrumentos';

    async getAll(): Promise<Instrumento[]> {
        return (await this.find({}))?.map(i => Instrumento.fromJson(i)) || []
    }

    private prepareInstrumentoToSave(instrumento: Instrumento) {
        const instrumentoJson = instrumento.toJson();
        delete instrumentoJson._idInstrumento;
        return instrumentoJson;
    }

    async insertInstrumento(instrumento: Instrumento): Promise<void> {
        await this.insert({
            _id: this.generateId(),
            ...instrumento.toJson()
        });
    }

    async updateInstrumento(instrumento: Instrumento): Promise<void> {
        await this.replace({ '_id': this.convertDecimalToMongoId(instrumento.idInstrumento || 0) }, this.prepareInstrumentoToSave(instrumento));
    }

    async deleteInstrumento(id: number): Promise<void> {
        await this.delete({ "_id": this.convertDecimalToMongoId(id) });
    }
}