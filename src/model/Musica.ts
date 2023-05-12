import type Album from "./Album";
import type { Autor } from "./Autores";

export default class Musica{
    private _idMusica!: number;
    public get idMusica(): number {
        return this._idMusica;
    }
    private _titulo!: string;
    public get titulo(): string {
        return this._titulo;
    }
    public set titulo(value: string) {
        this._titulo = value;
    }
    private _generos!: Set<string>;
    public get generos(): Set<string> {
        return this._generos;
    }
    public set generos(value: Set<string>) {
        this._generos = value;
    }
    private _dataLancamento!: Date;
    public get dataLancamento(): Date {
        return this._dataLancamento;
    }
    public set dataLancamento(value: Date) {
        this._dataLancamento = value;
    }
    private _audio!: AudioBuffer;
    public get audio(): AudioBuffer {
        return this._audio;
    }
    public set audio(value: AudioBuffer) {
        this._audio = value;
    }
    private _albuns!: Set<Album>;
    public get albuns(): Set<Album> {
        return this._albuns;
    }
    public set albuns(value: Set<Album>) {
        this._albuns = value;
    }
    private _autores!: Set<Autor>;
    public get autores(): Set<Autor> {
        return this._autores;
    }
    public set autores(value: Set<Autor>) {
        this._autores = value;
    }

    equals(obj: unknown): boolean{
        return typeof obj == 'object' && obj != null && 'idMusica' in obj && obj.idMusica == this.idMusica;
    }
}