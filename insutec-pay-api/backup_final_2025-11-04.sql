--
-- PostgreSQL database dump
--

\restrict zhekEDRu3xMdshskmVzHrrz6H7jxI2DBWPb5aZa5jDbrCJbKabE4PMZhbNsymsU

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg12+1)
-- Dumped by pg_dump version 17.6 (Debian 17.6-0+deb13u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: ajacs
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO ajacs;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: ajacs
--

COMMENT ON SCHEMA public IS '';


--
-- Name: log_alunos_changes(); Type: FUNCTION; Schema: public; Owner: ajacs
--

CREATE FUNCTION public.log_alunos_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  usuario_atual INTEGER := NULL;
  acao TEXT;
  detalhes JSONB := '{}'::jsonb;
  ip_valido TEXT := NULL;
BEGIN
  -- Detecta ação
  IF TG_OP = 'INSERT' THEN
    acao := 'CRIACAO_ALUNO';
    detalhes := detalhes || jsonb_build_object(
      'nr_estudante', NEW.nr_estudante,
      'nome', NEW.nome,
      'curso', NEW.curso
    );
  ELSIF TG_OP = 'UPDATE' THEN
    acao := 'ATUALIZACAO_ALUNO';
    IF OLD.curso IS DISTINCT FROM NEW.curso THEN
      detalhes := detalhes || jsonb_build_object(
        'curso_antigo', OLD.curso,
        'curso_novo', NEW.curso
      );
    END IF;
    IF OLD.nome IS DISTINCT FROM NEW.nome THEN
      detalhes := detalhes || jsonb_build_object('nome_alterado', true);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    acao := 'EXCLUSAO_ALUNO';
    detalhes := jsonb_build_object(
      'nr_estudante', OLD.nr_estudante,
      'nome', OLD.nome
    );
  END IF;

  -- Pega usuário logado (se existir)
  BEGIN
    usuario_atual := current_setting('app.current_user_id')::INTEGER;
  EXCEPTION WHEN OTHERS THEN
    usuario_atual := NULL;
  END;

  -- Pega IP e valida (só se for número válido)
  BEGIN
    ip_valido := current_setting('app.client_ip');
    IF ip_valido !~ '^(\d{1,3}\.){3}\d{1,3}$' THEN
      ip_valido := NULL;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    ip_valido := NULL;
  END;

  -- Insere log
  INSERT INTO logs (
    usuario_id, acao, alvo_tipo, alvo_id, detalhes, ip_address, data_acao
  ) VALUES (
    usuario_atual,
    acao,
    'ALUNO',
    COALESCE(NEW.id, OLD.id),
    detalhes,
    ip_valido,
    NOW()
  );

  RETURN COALESCE(NEW, OLD);
END;
$_$;


ALTER FUNCTION public.log_alunos_changes() OWNER TO ajacs;

--
-- Name: validar_nr_estudante(); Type: FUNCTION; Schema: public; Owner: ajacs
--

CREATE FUNCTION public.validar_nr_estudante() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  prefixo TEXT;
  ano_entrada INTEGER;
BEGIN
  -- Só valida se não for NULL
  IF NEW.nr_estudante IS NULL THEN RETURN NEW; END IF;

  -- Garante 6 dígitos
  IF LENGTH(NEW.nr_estudante) != 6 THEN
    RAISE EXCEPTION 'Número de estudante deve ter exatamente 6 dígitos: %', NEW.nr_estudante;
  END IF;

  -- Só números
  IF NEW.nr_estudante !~ '^[0-9]{6}$' THEN
    RAISE EXCEPTION 'Número de estudante só pode conter dígitos: %', NEW.nr_estudante;
  END IF;

  -- Extrai os 2 primeiros dígitos como ano (22)
  prefixo := LEFT(NEW.nr_estudante, 2);
  IF prefixo != '22' THEN
    RAISE EXCEPTION 'Número de estudante deve começar com 22: %', NEW.nr_estudante;
  END IF;

  RETURN NEW;
END;
$_$;


ALTER FUNCTION public.validar_nr_estudante() OWNER TO ajacs;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alunos; Type: TABLE; Schema: public; Owner: ajacs
--

CREATE TABLE public.alunos (
    id integer NOT NULL,
    nr_estudante character varying(10) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nome character varying(255) NOT NULL,
    curso character varying(100),
    ano_academico integer,
    data_registo timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id integer,
    CONSTRAINT chk_nr_estudante_numerico CHECK (((nr_estudante)::text ~ '^[0-9]{6,10}$'::text))
);


ALTER TABLE public.alunos OWNER TO ajacs;

--
-- Name: alunos_id_seq; Type: SEQUENCE; Schema: public; Owner: ajacs
--

CREATE SEQUENCE public.alunos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alunos_id_seq OWNER TO ajacs;

--
-- Name: alunos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ajacs
--

ALTER SEQUENCE public.alunos_id_seq OWNED BY public.alunos.id;


--
-- Name: emolumentos; Type: TABLE; Schema: public; Owner: ajacs
--

CREATE TABLE public.emolumentos (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    descricao character varying(255) NOT NULL,
    valor_base numeric(10,2) NOT NULL,
    tipo character varying(50)
);


ALTER TABLE public.emolumentos OWNER TO ajacs;

--
-- Name: emolumentos_id_seq; Type: SEQUENCE; Schema: public; Owner: ajacs
--

CREATE SEQUENCE public.emolumentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emolumentos_id_seq OWNER TO ajacs;

--
-- Name: emolumentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ajacs
--

ALTER SEQUENCE public.emolumentos_id_seq OWNED BY public.emolumentos.id;


--
-- Name: logs; Type: TABLE; Schema: public; Owner: ajacs
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    usuario_id integer,
    acao character varying(100) NOT NULL,
    alvo_tipo character varying(50),
    alvo_id integer,
    detalhes jsonb,
    ip_address character varying(45),
    data_acao timestamp without time zone DEFAULT now()
);


ALTER TABLE public.logs OWNER TO ajacs;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: ajacs
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_id_seq OWNER TO ajacs;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ajacs
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- Name: pagamentos_servicos; Type: TABLE; Schema: public; Owner: ajacs
--

CREATE TABLE public.pagamentos_servicos (
    transacao_id integer NOT NULL,
    servico_devido_id integer NOT NULL,
    valor_liquidado numeric(10,2) NOT NULL,
    multa_aplicada numeric(10,2) DEFAULT 0.00
);


ALTER TABLE public.pagamentos_servicos OWNER TO ajacs;

--
-- Name: servicos_devidos; Type: TABLE; Schema: public; Owner: ajacs
--

CREATE TABLE public.servicos_devidos (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    emolumento_id integer NOT NULL,
    referencia character varying(50) NOT NULL,
    valor_devido numeric(10,2) NOT NULL,
    mes_referencia character varying(20),
    data_vencimento date NOT NULL,
    esta_pago boolean DEFAULT false,
    data_liquidacao timestamp without time zone
);


ALTER TABLE public.servicos_devidos OWNER TO ajacs;

--
-- Name: servicos_devidos_id_seq; Type: SEQUENCE; Schema: public; Owner: ajacs
--

CREATE SEQUENCE public.servicos_devidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicos_devidos_id_seq OWNER TO ajacs;

--
-- Name: servicos_devidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ajacs
--

ALTER SEQUENCE public.servicos_devidos_id_seq OWNED BY public.servicos_devidos.id;


--
-- Name: transacoes; Type: TABLE; Schema: public; Owner: ajacs
--

CREATE TABLE public.transacoes (
    id integer NOT NULL,
    id_transacao_unica character varying(50) NOT NULL,
    pagador_aluno_id integer,
    valor_total_pago numeric(10,2) NOT NULL,
    valor_multa numeric(10,2) DEFAULT 0.00,
    status character varying(20) NOT NULL,
    caminho_documento character varying(255),
    data_transacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    data_confirmacao timestamp without time zone
);


ALTER TABLE public.transacoes OWNER TO ajacs;

--
-- Name: transacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: ajacs
--

CREATE SEQUENCE public.transacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transacoes_id_seq OWNER TO ajacs;

--
-- Name: transacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ajacs
--

ALTER SEQUENCE public.transacoes_id_seq OWNED BY public.transacoes.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: ajacs
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    tipo_usuario character varying(20) NOT NULL,
    nome_completo character varying(255) NOT NULL,
    email character varying(255),
    senha_hash text NOT NULL,
    data_criacao timestamp without time zone DEFAULT now(),
    ultimo_acesso timestamp without time zone,
    CONSTRAINT usuarios_tipo_usuario_check CHECK (((tipo_usuario)::text = ANY ((ARRAY['ALUNO'::character varying, 'ADMIN'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO ajacs;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: ajacs
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO ajacs;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ajacs
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: alunos id; Type: DEFAULT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.alunos ALTER COLUMN id SET DEFAULT nextval('public.alunos_id_seq'::regclass);


--
-- Name: emolumentos id; Type: DEFAULT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.emolumentos ALTER COLUMN id SET DEFAULT nextval('public.emolumentos_id_seq'::regclass);


--
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Name: servicos_devidos id; Type: DEFAULT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.servicos_devidos ALTER COLUMN id SET DEFAULT nextval('public.servicos_devidos_id_seq'::regclass);


--
-- Name: transacoes id; Type: DEFAULT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.transacoes ALTER COLUMN id SET DEFAULT nextval('public.transacoes_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: alunos; Type: TABLE DATA; Schema: public; Owner: ajacs
--

COPY public.alunos (id, nr_estudante, password_hash, nome, curso, ano_academico, data_registo, usuario_id) FROM stdin;
3	223010	$2b$10$ekTwoxDJsfXqwXRZvSeIweDGAgsMuCfD4NCcGOGUPAASdSKZCRkra	Joaquim João	Engenharia Informática	2	2025-11-04 09:09:43.827432	3
4	220205	$2b$10$ekTwoxDJsfXqwXRZvSeIweDGAgsMuCfD4NCcGOGUPAASdSKZCRkra	Diolinda Guilherme	Engenharia Informática	1	2025-11-04 09:09:43.827432	4
2	220432	$2b$10$ekTwoxDJsfXqwXRZvSeIweDGAgsMuCfD4NCcGOGUPAASdSKZCRkra	Ana Juliana da Costa Sobrinho	Engenharia Informática Avançada	3	2025-11-04 09:09:43.827432	2
\.


--
-- Data for Name: emolumentos; Type: TABLE DATA; Schema: public; Owner: ajacs
--

COPY public.emolumentos (id, codigo, descricao, valor_base, tipo) FROM stdin;
\.


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: ajacs
--

COPY public.logs (id, usuario_id, acao, alvo_tipo, alvo_id, detalhes, ip_address, data_acao) FROM stdin;
3	\N	ATUALIZACAO_ALUNO	ALUNO	2	{"curso_novo": "Engenharia Informática Avançada", "curso_antigo": "Engenharia Informática"}	\N	2025-11-04 09:15:36.247496
\.


--
-- Data for Name: pagamentos_servicos; Type: TABLE DATA; Schema: public; Owner: ajacs
--

COPY public.pagamentos_servicos (transacao_id, servico_devido_id, valor_liquidado, multa_aplicada) FROM stdin;
\.


--
-- Data for Name: servicos_devidos; Type: TABLE DATA; Schema: public; Owner: ajacs
--

COPY public.servicos_devidos (id, aluno_id, emolumento_id, referencia, valor_devido, mes_referencia, data_vencimento, esta_pago, data_liquidacao) FROM stdin;
\.


--
-- Data for Name: transacoes; Type: TABLE DATA; Schema: public; Owner: ajacs
--

COPY public.transacoes (id, id_transacao_unica, pagador_aluno_id, valor_total_pago, valor_multa, status, caminho_documento, data_transacao, data_confirmacao) FROM stdin;
1	MATRICULA-2025-001	\N	0.00	0.00	CONCLUIDO	/comprovativos/matricula_2025.pdf	2025-11-04 09:12:32.873183	\N
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: ajacs
--

COPY public.usuarios (id, tipo_usuario, nome_completo, email, senha_hash, data_criacao, ultimo_acesso) FROM stdin;
2	ALUNO	Ana Juliana da Costa Sobrinho	ajacs@aluno.insutec.ao	$2b$10$ekTwoxDJsfXqwXRZvSeIweDGAgsMuCfD4NCcGOGUPAASdSKZCRkra	2025-11-04 09:09:43.827432	\N
3	ALUNO	Joaquim João	joaquim.joao@insutec.ao	$2b$10$ekTwoxDJsfXqwXRZvSeIweDGAgsMuCfD4NCcGOGUPAASdSKZCRkra	2025-11-04 09:09:43.827432	\N
4	ALUNO	Diolinda Guilherme	diolinda.guilherme@aluno.insutec.ao	$2b$10$ekTwoxDJsfXqwXRZvSeIweDGAgsMuCfD4NCcGOGUPAASdSKZCRkra	2025-11-04 09:09:43.827432	\N
1	ADMIN	Ana Juliana Avelino	admin@insutec.ao	$2b$10$ekTwoxDJsfXqwXRZvSeIweDGAgsMuCfD4NCcGOGUPAASdSKZCRkra	2025-11-04 09:20:25.622706	\N
\.


--
-- Name: alunos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ajacs
--

SELECT pg_catalog.setval('public.alunos_id_seq', 4, true);


--
-- Name: emolumentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ajacs
--

SELECT pg_catalog.setval('public.emolumentos_id_seq', 1, false);


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ajacs
--

SELECT pg_catalog.setval('public.logs_id_seq', 4, true);


--
-- Name: servicos_devidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ajacs
--

SELECT pg_catalog.setval('public.servicos_devidos_id_seq', 1, false);


--
-- Name: transacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ajacs
--

SELECT pg_catalog.setval('public.transacoes_id_seq', 1, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ajacs
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- Name: alunos alunos_nr_estudante_key; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_nr_estudante_key UNIQUE (nr_estudante);


--
-- Name: alunos alunos_pkey; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_pkey PRIMARY KEY (id);


--
-- Name: alunos alunos_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_usuario_id_key UNIQUE (usuario_id);


--
-- Name: emolumentos emolumentos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.emolumentos
    ADD CONSTRAINT emolumentos_codigo_key UNIQUE (codigo);


--
-- Name: emolumentos emolumentos_pkey; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.emolumentos
    ADD CONSTRAINT emolumentos_pkey PRIMARY KEY (id);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: pagamentos_servicos pagamentos_servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.pagamentos_servicos
    ADD CONSTRAINT pagamentos_servicos_pkey PRIMARY KEY (transacao_id, servico_devido_id);


--
-- Name: servicos_devidos servicos_devidos_pkey; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.servicos_devidos
    ADD CONSTRAINT servicos_devidos_pkey PRIMARY KEY (id);


--
-- Name: servicos_devidos servicos_devidos_referencia_key; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.servicos_devidos
    ADD CONSTRAINT servicos_devidos_referencia_key UNIQUE (referencia);


--
-- Name: transacoes transacoes_id_transacao_unica_key; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_transacao_unica_key UNIQUE (id_transacao_unica);


--
-- Name: transacoes transacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_servicos_devidos_pendentes; Type: INDEX; Schema: public; Owner: ajacs
--

CREATE INDEX idx_servicos_devidos_pendentes ON public.servicos_devidos USING btree (aluno_id) WHERE (esta_pago = false);


--
-- Name: idx_transacoes_aluno; Type: INDEX; Schema: public; Owner: ajacs
--

CREATE INDEX idx_transacoes_aluno ON public.transacoes USING btree (pagador_aluno_id);


--
-- Name: alunos trg_log_alunos; Type: TRIGGER; Schema: public; Owner: ajacs
--

CREATE TRIGGER trg_log_alunos AFTER INSERT OR DELETE OR UPDATE ON public.alunos FOR EACH ROW EXECUTE FUNCTION public.log_alunos_changes();


--
-- Name: alunos trg_validar_nr_estudante; Type: TRIGGER; Schema: public; Owner: ajacs
--

CREATE TRIGGER trg_validar_nr_estudante BEFORE INSERT OR UPDATE ON public.alunos FOR EACH ROW EXECUTE FUNCTION public.validar_nr_estudante();


--
-- Name: alunos fk_alunos_usuario; Type: FK CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT fk_alunos_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: logs logs_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: pagamentos_servicos pagamentos_servicos_servico_devido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.pagamentos_servicos
    ADD CONSTRAINT pagamentos_servicos_servico_devido_id_fkey FOREIGN KEY (servico_devido_id) REFERENCES public.servicos_devidos(id) ON DELETE RESTRICT;


--
-- Name: pagamentos_servicos pagamentos_servicos_transacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.pagamentos_servicos
    ADD CONSTRAINT pagamentos_servicos_transacao_id_fkey FOREIGN KEY (transacao_id) REFERENCES public.transacoes(id) ON DELETE CASCADE;


--
-- Name: servicos_devidos servicos_devidos_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.servicos_devidos
    ADD CONSTRAINT servicos_devidos_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.alunos(id) ON DELETE CASCADE;


--
-- Name: servicos_devidos servicos_devidos_emolumento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.servicos_devidos
    ADD CONSTRAINT servicos_devidos_emolumento_id_fkey FOREIGN KEY (emolumento_id) REFERENCES public.emolumentos(id);


--
-- Name: transacoes transacoes_pagador_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ajacs
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pagador_aluno_id_fkey FOREIGN KEY (pagador_aluno_id) REFERENCES public.alunos(id) ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ajacs
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO ajacs;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO ajacs;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO ajacs;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO ajacs;


--
-- PostgreSQL database dump complete
--

\unrestrict zhekEDRu3xMdshskmVzHrrz6H7jxI2DBWPb5aZa5jDbrCJbKabE4PMZhbNsymsU

