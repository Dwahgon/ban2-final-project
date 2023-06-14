import type { Document } from "mongodb";
import { Autor, Banda, Musico } from "../../model/Autores";
import MongoPersistence from "./MongoPersistence";
import Instrumento from "../../model/Instrumento";


export default class MongoAutorPersistence extends MongoPersistence {
    protected static readonly COLLECTION: string = "autores";

    async getAll(): Promise<Autor[]> {
        return [...await this.getAllMusicos(), ...await this.getAllBandas()];
    }

    convertDocToMusico(m: Document) {
        const instrumentos = m._instrumentos.map((m: Document) => Instrumento.fromJson(m)) as Instrumento[];
        return Musico.fromJson({
            ...m,
            _instrumentos: instrumentos.map(i => i.idInstrumento)
        }, [], instrumentos)
    }

    convertDocToBanda(b: Document) {
        const membros = b._membros.map((m: Document) => this.convertDocToMusico(m)) as Musico[];
        return Banda.fromJson({
            ...b,
            _membros: membros.map(m => m.idAutor)
        }, membros)
    }

    async getAllMusicos(): Promise<Musico[]> {
        return (await this.aggregate([
            { $match: { _tipo: 'm' } },
            {
                $lookup: {
                    from: "instrumentos",
                    let: {
                        instrumentos: "$_instrumentos",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$instrumentos"],
                                },
                            },
                        },
                    ],
                    as: "_instrumentos",
                },
            },
        ]))?.map(m => this.convertDocToMusico(m)) || []
    }

    async getAllBandas(): Promise<Banda[]> {
        return (await this.aggregate([
            { $match: { _tipo: "b" } },
            {
                $lookup: {
                    from: "autores",
                    let: {
                        membros: "$_membros",
                    },
                    pipeline: [
                        {
                            $match: {
                                _tipo: "m",
                                $expr: {
                                    $in: ["$_id", "$$membros"],
                                },
                            },
                        },
                    ],
                    as: "_membros",
                },
            },
        ]))?.map(b => this.convertDocToBanda(b)) || []
    }

    private prepareAutorToSave(autor: Autor) {
        const autorJson = autor.toJson();
        delete autorJson._idAutor;
        return {
            ...autorJson,
            ...(autor instanceof Banda ? { _membros: autorJson._membros.map((id: number) => this.convertDecimalToMongoId(id)) } : {}),
            ...(autor instanceof Musico ? { _instrumentos: autorJson._instrumentos.map((id: number) => this.convertDecimalToMongoId(id)) } : {})
        }
    }

    async insertAutor(autor: Autor): Promise<void> {
        await this.insert({
            _id: this.generateId(),
            ...this.prepareAutorToSave(autor)
        });
    }

    async updateAutor(autor: Autor) {
        await this.replace({ '_id': this.convertDecimalToMongoId(autor.idAutor || 0) }, this.prepareAutorToSave(autor))
    }

    async deleteAutor(id: number): Promise<void> {
        await this.delete({ "_id": this.convertDecimalToMongoId(id) });
    }
}