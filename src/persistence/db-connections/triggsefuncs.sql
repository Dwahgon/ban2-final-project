-- 1: Validação do tipo do autor
create or replace function verificar_tipo_autor() returns trigger as
$$
begin
	if (new.tipo = 'm' and (
		new.m_endereco_numero is null or
		new.m_endereco_complemento is null or
		new.m_endereco_rua is null or
		new.m_endereco_bairro is null or
		new.m_endereco_cidade is null or
		new.m_endereco_estado is null or
		new.m_endereco_pais is null or
		new.m_endereco_telefone is null or

		new.b_data_formacao is not null or
		new.b_descricao is not null
	)) then
		raise exception 'Autor do tipo músico (type="m") não pode ter valores nulos nos campos iniciando com "m" e não pode ter campos não nulos nos campos iniciando com "b"';
	elsif (new.tipo = 'b' and (
		new.m_endereco_numero is not null or
		new.m_endereco_complemento is not null or
		new.m_endereco_rua is not null or
		new.m_endereco_bairro is not null or
		new.m_endereco_cidade is not null or
		new.m_endereco_estado is not null or
		new.m_endereco_pais is not null or
		new.m_endereco_telefone is not null or

		new.b_data_formacao is null or
		new.b_descricao is null
	)) then
		raise exception 'Autor do tipo banda (type="b") não pode ter valores nulos nos campos iniciando com "b" e não pode ter campos não nulos nos campos iniciando com "m"';
	elsif (new.tipo not in ('m', 'b')) then
		raise exception 'Tipo de autor inválido. Valores válidos de tipo são "m" (músico) ou "b" (banda)';
	end if;

	return new;
end
$$ language plpgsql;
create or replace trigger verificar_tipo_autor before insert or update on autores for each row execute procedure verificar_tipo_autor();

--2: Validação e formatação de telefones
create or replace function formatar_e_validar_telefone(telefone varchar(15)) returns varchar(15) as
$$
declare
	digitos_telefone varchar(15);
begin
	select regexp_replace(telefone, '\D', '', 'g') into digitos_telefone;
	if (length(digitos_telefone) = 10) then
		return '(' || substring(digitos_telefone, 1, 2) || ') ' || substring(digitos_telefone, 3, 4) || '-' || substring(digitos_telefone, 7, 4);
	elsif (length(digitos_telefone) = 11) then
		return '(' || substring(digitos_telefone, 1, 2) || ') ' || substring(digitos_telefone, 3, 5) || '-' || substring(digitos_telefone, 8, 4);
	end if;
	raise exception 'Telefone só pode ter entre 10 e 11 digitos';
end
$$ language plpgsql;

create or replace function verificar_telefone_autor() returns trigger as
$$
begin
	if (new.tipo = 'm' and new.m_endereco_telefone is not null) then
		select formatar_e_validar_telefone(new.m_endereco_telefone) into new.m_endereco_telefone;
	end if;
	return new;
end
$$ language plpgsql;
create or replace trigger verificar_telefone_autor before insert or update on autores for each row execute procedure verificar_telefone_autor();

create or replace function verificar_telefone_produtor() returns trigger as
$$
begin
	if (new.endereco_telefone is not null) then
		select formatar_e_validar_telefone(new.endereco_telefone) into new.endereco_telefone;
	end if;
	return new;
end
$$ language plpgsql;
create or replace trigger verificar_telefone_produtor before insert or update on produtores for each row execute procedure verificar_telefone_produtor();

--3: Validação do tipo de autores em relações
create or replace function validar_id_a_tipo_musico() returns trigger as
$$
begin
	if ((select tipo from autores where id_a=new.id_a) = 'b') then
		raise exception 'Autor referenciado por "id_a" deve ser do tipo "m" (músico)';
	end if;
	return new;
end
$$ language plpgsql;

create or replace function validar_tipo_autor_id_a() returns trigger as
$$
begin
	if ((select tipo from autores where id_a=new.id_a) <> TG_ARGV[0]) then
		raise exception 'Autor referenciado por "id_a" deve ser do tipo "%"', TG_ARGV[0];
	end if;
	return new;
end
$$ language plpgsql;

create or replace trigger validar_tipo_autor_estilos_bandas 
	before insert or update on estilos_bandas 
	for each row execute procedure validar_tipo_autor_id_a('b');
create or replace trigger validar_tipo_autor_instrumento_musico
	before insert or update on instrumento_musico 
	for each row execute procedure validar_tipo_autor_id_a('m');

create or replace function validar_tipo_autor_membro_banda() returns trigger as
$$
begin
	if ((select tipo from autores where id_a=new.musico) = 'b') then
		raise exception 'Campo musico deve referenciar um autor com tipo "m"';
	end if;
	if ((select tipo from autores where id_a=new.banda) = 'm') then
		raise exception 'Campo banda deve referenciar um autor com tipo "b"';
	end if;
	return new;
end
$$ language plpgsql;
create or replace trigger validar_tipo_autor_membro_banda before insert or update on membro_banda for each row execute procedure validar_tipo_autor_membro_banda();


--4 garantir integridade de relações n-m com relação obrigatória
create or replace function insert_valid_musica(
	titulo varchar(40),
	id_album int,
	id_autor int,
	data_lancamento date default null,
	audio bytea default null
) returns void as
$$
declare
	id_musica int;
begin
	insert into musicas(titulo, data_lancamento, audio) values (titulo, data_lancamento, audio) returning id_m into id_musica;
	insert into musicas_album(id_a, id_m) values(id_album, id_musica);
	insert into autor_musicas(id_a, id_m) values(id_autor, id_musica);
end
$$ language plpgsql;

create or replace function validate_music_with_album() returns trigger as
$$
begin
	if (select count(id_m) from musicas_album where id_m = old.id_m and exists(select 1 from musicas where id_m = old.id_m)) then
		if (TG_OP = 'UPDATE' and old.id_m<>new.id_m) then
			raise exception 'Não foi possível mudar a música deste album pois a música ficará sem album.';
		elsif (TG_OP = 'DELETE') then
			raise exception 'Não foi possível desassociar o album da música pois a música ficará sem album';
		end if;
	end if;
	if (TG_OP = 'DELETE') then
		return old;
	end if;
	return new;
end
$$ language plpgsql;
create or replace trigger validate_music_with_album before update or delete on musicas_album for each row execute procedure validate_music_with_album();

create or replace function validate_music_with_autor() returns trigger as
$$
begin
	if (select count(id_m) from autor_musicas where id_m = old.id_m and exists(select 1 from musicas where id_m = old.id_m)) then
		if (TG_OP = 'UPDATE' and old.id_m<>new.id_m) then
			raise exception 'Não foi possível mudar a música deste autor pois a música ficará sem autor.';
		elsif (TG_OP = 'DELETE') then
			raise exception 'Não foi possível desassociar o autor da música pois a música ficará sem autor';
		end if;
	end if;
	if (TG_OP = 'DELETE') then
		return old;
	end if;
	return new;
end
$$ language plpgsql;
create or replace trigger validate_music_with_autor before update or delete on autor_musicas for each row execute procedure validate_music_with_autor();

-- 5 Remover relações quando converte banda para músico
create or replace function remove_relations_bandas_on_autor_conversion() returns trigger as
$$
begin
	if (OLD.tipo <> NEW.tipo and NEW.tipo='m') then
		delete from estilos_bandas where id_a=NEW.id_a;
		delete from membro_banda where banda=NEW.id_a;
	end if;
	return new;
end
$$ language plpgsql;
create or replace trigger remove_relations_bandas_on_autor_conversion before update on autores for each row execute procedure remove_relations_bandas_on_autor_conversion();