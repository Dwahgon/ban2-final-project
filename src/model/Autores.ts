import type Endereco from "./Endereco";
import type Instrumento from "./Instrumento";

export class Autor {
    private _idAutor!: number;
    public get idAutor(): number {
        return this._idAutor;
    }

    equals(obj: unknown){
        return typeof obj == 'object' && obj != null && 'idAutor' in obj && obj.idAutor == this.idAutor;
    }
}

export class Musico extends Autor {
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
    private _instrumentos!: Instrumento;
    public get instrumentos(): Instrumento {
        return this._instrumentos;
    }
    public set instrumentos(value: Instrumento) {
        this._instrumentos = value;
    }
}

export class Banda extends Autor {
    private _nome!: string;
    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }
    private _dataFormacao!: Date;
    public get dataFormacao(): Date {
        return this._dataFormacao;
    }
    public set dataFormacao(value: Date) {
        this._dataFormacao = value;
    }
    private _estilos!: Set<string>;
    public get estilos(): Set<string> {
        return this._estilos;
    }
    public set estilos(value: Set<string>) {
        this._estilos = value;
    }
    private _descricao!: string;
    public get descricao(): string {
        return this._descricao;
    }
    public set descricao(value: string) {
        this._descricao = value;
    }
    private _membros!: Set<Musico>;
    public get membros(): Set<Musico> {
        return this._membros;
    }
    public set membros(value: Set<Musico>) {
        this._membros = value;
    }
}
