import type Endereco from "./Endereco";

export default class Produtor {
    private _idProdutor!: number;
    public get idProdutor(): number {
        return this._idProdutor;
    }
    public set idProdutor(value: number) {
        this._idProdutor = value;
    }
    private _nome!: string;
    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }
    private _endereco!: Endereco;
    public get endereco(): Endereco {
        return this._endereco;
    }
    public set endereco(value: Endereco) {
        this._endereco = value;
    }

    equals(obj: unknown){
        return typeof obj == 'object' && obj != null && 'idProdutor' in obj && obj.idProdutor == this.idProdutor;
    }
}