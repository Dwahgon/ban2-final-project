export default class Album {
    private _idAlbum!: number;
    public get idAlbum(): number {
        return this._idAlbum;
    }
    private _nome!: string;
    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }
    private _dataLancamento!: Date;
    public get dataLancamento(): Date {
        return this._dataLancamento;
    }
    public set dataLancamento(value: Date) {
        this._dataLancamento = value;
    }
    private _imagem!: ImageData;
    public get imagem(): ImageData {
        return this._imagem;
    }
    public set imagem(value: ImageData) {
        this._imagem = value;
    }
    private _descricao!: string;
    public get descricao(): string {
        return this._descricao;
    }
    public set descricao(value: string) {
        this._descricao = value;
    }

    equals(obj: unknown){
        return typeof obj == 'object' && obj != null && 'idAlbum' in obj && obj.idAlbum == this.idAlbum;
    }
}