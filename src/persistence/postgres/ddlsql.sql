create table autores (
	id_a serial not null primary key,
	nome varchar(50) not null,
	tipo char not null, -- m: musico, a: artista
	m_endereco_numero int,
	m_endereco_complemento varchar(10),
	m_endereco_rua varchar(75),
	m_endereco_bairro varchar(75),
	m_endereco_cidade varchar(75),
	m_endereco_estado varchar(75),
	m_endereco_pais varchar(75),
	m_endereco_telefone varchar(25),
	b_data_formacao date,
	b_descricao varchar(255)
);

create table estilos_bandas(
	id_a int not null,
	estilo varchar(10),
	primary key (id_a, estilo),
	foreign key (id_a) references autores on delete cascade
);

create table membro_banda(
	musico int not null,
	banda int not null,
	primary key(musico, banda),
	foreign key (musico) references autores(id_a) on delete cascade,
	foreign key (banda) references autores(id_a) on delete cascade
);

create table instrumentos(
	id_i serial not null primary key,
	nome varchar(25) not null,
	tipo varchar(25) not null, 
	marca varchar(25)
);

create table instrumento_musico(
	id_a int not null,
	id_i int not null,
	primary key(id_a, id_i),
	foreign key (id_a) references autores on delete cascade,
	foreign key (id_i) references instrumentos on delete cascade
);

create table produtores (
	id_p serial not null primary key,
	nome varchar(50),
	endereco_numero int,
	endereco_complemento varchar(10),
	endereco_rua varchar(75),
	endereco_bairro varchar(75),
	endereco_cidade varchar(75),
	endereco_estado varchar(75),
	endereco_pais varchar(75),
	endereco_telefone varchar(25)
);

create table discos (
	id_d serial not null primary key,
	titulo varchar(40) not null,
	data date not null,
	formato varchar(50) not null,
	imagem_capa bytea,
	id_a int not null,
	id_p int not null,
	foreign key (id_a) references autores,
	foreign key (id_p) references produtores
);

create table musicas (
	id_m serial not null primary key,
	titulo varchar(40) not null,
	data_lancamento date,
	audio bytea
);

create table generos_musicas (
	id_m int not null,
	genero varchar(10) not null,
	primary key (id_m, genero),
	foreign key (id_m) references musicas on delete cascade
);

create table albuns (
	id_a serial primary key,
	nome varchar(40) not null,
	descricao varchar(255),
	data_lancamento date,
	imagem bytea
);

create table musicas_album(
	id_m int,
	id_a int,
	primary key (id_m, id_a),
	foreign key (id_m) references musicas on delete cascade,
	foreign key (id_a) references albuns
);

create table autor_musicas (
	id_a int,
	id_m int,
	primary key(id_a, id_m),
	foreign key (id_a) references autores,
	foreign key (id_m) references musicas on delete cascade
);

create table musicas_disco (
	id_d int,
	id_m int,
	primary key (id_d, id_m),
	foreign key (id_d) references discos on delete cascade,
	foreign key (id_m) references musicas on delete cascade
);