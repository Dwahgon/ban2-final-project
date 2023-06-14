import { convertMongoIdToDecimal } from "./util";

export type InstrumentoPostgresEntry = {
    id_i: number,
    nome: string,
    tipo: string,
    marca: string | null,
}

export default class Instrumento {
    private _idInstrumento?: number;
    public get idInstrumento(): number | undefined {
        return this._idInstrumento;
    }
    private _nome!: string;
    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }
    private _tipo!: string;
    public get tipo(): string {
        return this._tipo;
    }
    public set tipo(value: string) {
        this._tipo = value;
    }
    private _marca!: string | null;
    public get marca(): string | null {
        return this._marca;
    }
    public set marca(value: string | null) {
        this._marca = value;
    }

    constructor(id?: number) {
        this._idInstrumento = id;
    }

    equals(obj: unknown) {
        return typeof obj == 'object' && obj != null && 'idInstrumento' in obj && obj.idInstrumento == this.idInstrumento;
    }

    static fromPostgresQuery(query: InstrumentoPostgresEntry) {
        const instrumento = new this(query.id_i);
        instrumento.nome = query.nome;
        instrumento.tipo = query.tipo;
        instrumento.marca = query.marca;
        return instrumento;
    }

    toPostgresSqlValues(): unknown[] {
        return [
            this.nome,
            this.tipo,
            this.marca
        ]
    }

    static fromJson(json: any) {
        if ('_id' in json) {
            json._idInstrumento = convertMongoIdToDecimal(json._id)
            delete json._id;
        }
        return Object.assign(new this(), json);
    }

    toJson() {
        return JSON.parse(JSON.stringify(this));
    }

    static fromFormData(formData: FormData): Instrumento {
        const instrumento = new this(formData.get('id') ? Number(formData.get('id')) : undefined);
        instrumento.nome = String(formData.get('nome'));
        instrumento.tipo = String(formData.get('tipo'));
        instrumento.marca = String(formData.get('marca'));

        return instrumento;
    }

    toFormData() {
        return {
            id: this.idInstrumento,
            nome: this.nome,
            tipo: this.tipo,
            marca: this.marca
        }
    }
}