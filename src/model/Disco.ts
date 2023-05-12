import type { Autor } from "./Autores";
import type Musica from "./Musica";
import type Produtor from "./Produtor";

export default class Disco {
    private _idDisco!: number;
    public get idDisco(): number {
        return this._idDisco;
    }
    private _formato!: string;
    public get formato(): string {
        return this._formato;
    }
    public set formato(value: string) {
        this._formato = value;
    }
    private _data!: Date;
    public get data(): Date {
        return this._data;
    }
    public set data(value: Date) {
        this._data = value;
    }
    private _titulo!: string;
    public get titulo(): string {
        return this._titulo;
    }
    public set titulo(value: string) {
        this._titulo = value;
    }
    private _imagemCapa!: ImageData;
    public get imagemCapa(): ImageData {
        return this._imagemCapa;
    }
    public set imagemCapa(value: ImageData) {
        this._imagemCapa = value;
    }
    private _autor!: Autor;
    public get autor(): Autor {
        return this._autor;
    }
    public set autor(value: Autor) {
        this._autor = value;
    }
    private _produtor!: Produtor;
    public get produtor(): Produtor {
        return this._produtor;
    }
    public set produtor(value: Produtor) {
        this._produtor = value;
    }
    private _musicas!: Set<Musica>;
    public get musicas(): Set<Musica> {
        return this._musicas;
    }
    public set musicas(value: Set<Musica>) {
        this._musicas = value;
    }

    equals(obj: unknown){
        return typeof obj == 'object' && obj != null && 'idDisco' in obj && obj.idDisco == this.idDisco;
    }
}