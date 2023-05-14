import { formatDate } from "../utils/utils";
import Endereco from "./Endereco";
import type Instrumento from "./Instrumento";

export class Autor {
    private _idAutor?: number;
    public get idAutor(): number | undefined {
        return this._idAutor;
    }
    private _nome!: string;
    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }

    constructor(idAutor?: number) {
        this._idAutor = idAutor;
    }

    equals(obj: unknown) {
        return typeof obj == 'object' && obj != null && 'idAutor' in obj && obj.idAutor != undefined && obj.idAutor == this.idAutor;
    }

    static fromFormData(formData: FormData, _musicos: Musico[] = []) {
        const idAutor = formData.get('id') ? Number(formData.get('id')) : undefined;
        const autor = new Autor(idAutor);
        autor.nome = String(formData.get('nome') || '');
        return autor;
    }

    toFormData() {
        return {
            id: this.idAutor,
            nome: this.nome,
            tipo: '',
            mEnderecoNumero: '',
            mEnderecoComplemento: '',
            mEnderecoRua: '',
            mEnderecoBairro: '',
            mEnderecoCidade: '',
            mEnderecoEstado: '',
            mEnderecoPais: '',
            mEnderecoTelefone: '',
            bDataFormacao: '',
            bDescricao: '',
            bEstilos: ''
        }
    }

    static fromJson(json: any, musicos: Musico[] = []): Autor {
        return json._tipo == 'm' ? Musico.fromJson(json) : Banda.fromJson(json, musicos);
    }

    static fromPostgresQuery(result: any): Autor {
        const tipo = (result as { tipo: string }).tipo;
        return tipo == 'm' ? Musico.fromPostgresQuery(result)
            : tipo == 'b' ? Banda.fromPostgresQuery(result)
                : (() => { throw Error(`Invalid tipo: ${tipo}`) })();
    }

    toPostgresSqlValues(): unknown[] {
        throw Error('Cannot convert raw Autor to PostgresSqlValues');
    }

    toJson() {
        return JSON.parse(JSON.stringify(this));
    }
}

export class Musico extends Autor {
    private _endereco!: Endereco;
    private _tipo = 'm';
    public get endereco(): Endereco {
        return this._endereco;
    }
    public set endereco(value: Endereco) {
        this._endereco = value;
    }
    private _instrumentos: Set<Instrumento> = new Set();
    public get instrumentos(): Set<Instrumento> {
        return this._instrumentos;
    }
    public set instrumentos(value: Set<Instrumento>) {
        this._instrumentos = value;
    }

    static fromPostgresQuery(result: any) {
        const musico = new this(result.id_a);
        musico.endereco = new Endereco();
        musico.nome = result.nome;
        musico.endereco.numero = result.m_endereco_numero;
        musico.endereco.complemento = result.m_endereco_complemento;
        musico.endereco.rua = result.m_endereco_rua;
        musico.endereco.bairro = result.m_endereco_bairro;
        musico.endereco.cidade = result.m_endereco_cidade;
        musico.endereco.estado = result.m_endereco_estado;
        musico.endereco.pais = result.m_endereco_pais;
        musico.endereco.telefone = result.m_endereco_telefone;

        return musico;
    }

    static fromFormData(formData: FormData): Musico {
        const musico = Object.assign(new this(), super.fromFormData(formData));
        musico.endereco = new Endereco();
        musico.endereco.numero = Number(formData.get('mEnderecoNumero'));
        musico.endereco.complemento = String(formData.get('mEnderecoComplemento'));
        musico.endereco.rua = String(formData.get('mEnderecoRua'));
        musico.endereco.bairro = String(formData.get('mEnderecoBairro'));
        musico.endereco.cidade = String(formData.get('mEnderecoCidade'));
        musico.endereco.estado = String(formData.get('mEnderecoEstado'));
        musico.endereco.pais = String(formData.get('mEnderecoPais'));
        musico.endereco.telefone = String(formData.get('mEnderecoTelefone'));

        return musico;
    }

    toFormData() {
        return {
            id: this.idAutor,
            nome: this.nome,
            tipo: 'm',
            mEnderecoNumero: String(this.endereco.numero),
            mEnderecoComplemento: this.endereco.complemento,
            mEnderecoRua: this.endereco.rua,
            mEnderecoBairro: this.endereco.bairro,
            mEnderecoCidade: this.endereco.cidade,
            mEnderecoEstado: this.endereco.estado,
            mEnderecoPais: this.endereco.pais,
            mEnderecoTelefone: this.endereco.telefone,
            bDataFormacao: '',
            bDescricao: '',
            bEstilos: ''
        }
    }

    toPostgresSqlValues(): unknown[] {
        return [
            this.nome,
            'm',
            this.endereco.numero,
            this.endereco.complemento,
            this.endereco.rua,
            this.endereco.bairro,
            this.endereco.cidade,
            this.endereco.estado,
            this.endereco.pais,
            this.endereco.telefone,
            null, null,
            this.idAutor
        ]
    }

    static fromJson(json: any): Musico {
        return Object.assign(new this(), {
            ...json,
            _endereco: Endereco.fromJson(json._endereco)
        })
    }
}

export class Banda extends Autor {
    private _tipo = 'b';
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
    private _membros: Set<Musico> = new Set();
    public get membros(): Set<Musico> {
        return this._membros;
    }
    public set membros(value: Set<Musico>) {
        this._membros = value;
    }

    static fromFormData(formData: FormData, musicos: Musico[]) {
        const banda = Object.assign(new this(), super.fromFormData(formData));
        const membroIdSet = new Set(String(formData.get('bMembros') || '')
            .split(',')
            .filter(v => v != '')
            .map(v => Number(v)));
        banda.descricao = String(formData.get('bDescricao') || '');
        banda.dataFormacao = new Date(String(formData.get('bDataFormacao') || ''));
        banda.estilos = new Set(String(formData.get('bEstilos') || '').split(',').filter(v => v != ''))
        banda.membros = new Set(musicos.filter(m => membroIdSet.has(m.idAutor || -1)));
        return banda;
    }

    toFormData() {
        return {
            id: this.idAutor,
            nome: this.nome,
            tipo: 'b',
            mEnderecoNumero: '',
            mEnderecoComplemento: '',
            mEnderecoRua: '',
            mEnderecoBairro: '',
            mEnderecoCidade: '',
            mEnderecoEstado: '',
            mEnderecoPais: '',
            mEnderecoTelefone: '',
            bDataFormacao: formatDate(this.dataFormacao, 'YYYY-mm-dd'),
            bDescricao: this.descricao,
            bEstilos: Array.from(this.estilos).join(','),
            bMembros: Array.from(this.membros).map(m => m.idAutor).join(',')
        }
    }

    static fromPostgresQuery(result: any) {
        const banda = new this(result.id_a);
        banda.nome = result.nome;
        banda.descricao = result.b_descricao;
        banda.dataFormacao = new Date(result.b_data_formacao);
        banda.estilos = result.estilos;
        banda.membros = result.membros;
        return banda;
    }

    toPostgresSqlValues(): unknown[] {
        return [
            this.nome,
            'b',
            null, null, null, null, null, null, null, null,
            this.dataFormacao.toUTCString(),
            this.descricao,
            this.idAutor
        ]
    }

    static fromJson(json: any, musicos: Musico[]): Autor {
        const membroIds = new Set(json._membros)
        return Object.assign(new this(), {
            ...json,
            _dataFormacao: new Date(json._dataFormacao),
            _estilos: new Set(json._estilos),
            _membros: new Set(musicos.filter(m => membroIds.has(m.idAutor)))
        })
    }

    toJson() {
        return {
            ...JSON.parse(JSON.stringify(this)),
            _estilos: Array.from(this.estilos),
            _membros: Array.from(this.membros).map(m => m.idAutor)
        };
    }
}
