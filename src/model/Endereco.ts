export default class Endereco {
    private _numero!: number;
    public get numero(): number {
        return this._numero;
    }
    public set numero(value: number) {
        this._numero = value;
    }
    private _complemento!: string;
    public get complemento(): string {
        return this._complemento;
    }
    public set complemento(value: string) {
        this._complemento = value;
    }
    private _rua!: string;
    public get rua(): string {
        return this._rua;
    }
    public set rua(value: string) {
        this._rua = value;
    }
    private _bairro!: string;
    public get bairro(): string {
        return this._bairro;
    }
    public set bairro(value: string) {
        this._bairro = value;
    }
    private _cidade!: string;
    public get cidade(): string {
        return this._cidade;
    }
    public set cidade(value: string) {
        this._cidade = value;
    }
    private _estado!: string;
    public get estado(): string {
        return this._estado;
    }
    public set estado(value: string) {
        this._estado = value;
    }
    private _pais!: string;
    public get pais(): string {
        return this._pais;
    }
    public set pais(value: string) {
        this._pais = value;
    }
    private _telefone!: string;
    public get telefone(): string {
        return this._telefone;
    }
    public set telefone(value: string) {
        this._telefone = value;
    }
}