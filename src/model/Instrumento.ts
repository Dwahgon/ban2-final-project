export default class Instrumento {
    private _idInstrumento!: number;
    public get idInstrumento(): number {
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
    private _marca!: string;
    public get marca(): string {
        return this._marca;
    }
    public set marca(value: string) {
        this._marca = value;
    }

    equals(obj: unknown){
        return typeof obj == 'object' && obj != null && 'idInstrumento' in obj && obj.idInstrumento == this.idInstrumento;
    }
}