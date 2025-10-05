--
-- PostgreSQL database dump
--

\restrict ypvMKwq6ghXZOx2TMTKYNyVoM1OuUeMqwudlZWC3Wh80A6sjt8HVlikClw22yZ5

-- Dumped from database version 17.6 (Debian 17.6-0+deb13u1)
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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alunos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alunos (
    id integer NOT NULL,
    nr_estudante character varying(20) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nome character varying(255) NOT NULL,
    curso character varying(100),
    ano_academico integer,
    data_registo timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: alunos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alunos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: alunos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alunos_id_seq OWNED BY public.alunos.id;


--
-- Name: emolumentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emolumentos (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    descricao character varying(255) NOT NULL,
    valor_base numeric(10,2) NOT NULL,
    tipo character varying(50)
);



--
-- Name: emolumentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emolumentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: emolumentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emolumentos_id_seq OWNED BY public.emolumentos.id;


--
-- Name: pagamentos_servicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagamentos_servicos (
    transacao_id integer NOT NULL,
    servico_devido_id integer NOT NULL,
    valor_liquidado numeric(10,2) NOT NULL
);



--
-- Name: servicos_academicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicos_academicos (
    id integer NOT NULL,
    aluno_id integer,
    tipo character varying(50),
    descricao character varying(255),
    valor_base numeric(10,2),
    mes character varying(20),
    esta_pago boolean DEFAULT false
);



--
-- Name: servicos_academicos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicos_academicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: servicos_academicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicos_academicos_id_seq OWNED BY public.servicos_academicos.id;


--
-- Name: servicos_devidos; Type: TABLE; Schema: public; Owner: postgres
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



--
-- Name: servicos_devidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicos_devidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: servicos_devidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicos_devidos_id_seq OWNED BY public.servicos_devidos.id;


--
-- Name: transacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transacoes (
    id integer NOT NULL,
    id_transacao_unica character varying(50) NOT NULL,
    pagador_aluno_id integer,
    valor_total_pago numeric(10,2) NOT NULL,
    valor_multa numeric(10,2) DEFAULT 0.00,
    status character varying(20) NOT NULL,
    caminho_documento character varying(255),
    data_transacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: transacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: transacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transacoes_id_seq OWNED BY public.transacoes.id;


--
-- Name: alunos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos ALTER COLUMN id SET DEFAULT nextval('public.alunos_id_seq'::regclass);


--
-- Name: emolumentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emolumentos ALTER COLUMN id SET DEFAULT nextval('public.emolumentos_id_seq'::regclass);


--
-- Name: servicos_academicos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos_academicos ALTER COLUMN id SET DEFAULT nextval('public.servicos_academicos_id_seq'::regclass);


--
-- Name: servicos_devidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos_devidos ALTER COLUMN id SET DEFAULT nextval('public.servicos_devidos_id_seq'::regclass);


--
-- Name: transacoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes ALTER COLUMN id SET DEFAULT nextval('public.transacoes_id_seq'::regclass);


--
-- Data for Name: alunos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alunos (id, nr_estudante, password_hash, nome, curso, ano_academico, data_registo) FROM stdin;
3	220432	$2b$10$dtguDrF1juXXHQkkM00LIeOoy7KqUCcfA9tZ/F8xLqSM/9wBQBx.W	Ana Sobrinho	\N	\N	2025-10-04 14:22:25.225469
\.


--
-- Data for Name: emolumentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emolumentos (id, codigo, descricao, valor_base, tipo) FROM stdin;
\.


--
-- Data for Name: pagamentos_servicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagamentos_servicos (transacao_id, servico_devido_id, valor_liquidado) FROM stdin;
\.


--
-- Data for Name: servicos_academicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicos_academicos (id, aluno_id, tipo, descricao, valor_base, mes, esta_pago) FROM stdin;
1	1	Propina	Propina Mensal (Ref. em Atraso)	35000.00	Setembro/2025	f
\.


--
-- Data for Name: servicos_devidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicos_devidos (id, aluno_id, emolumento_id, referencia, valor_devido, mes_referencia, data_vencimento, esta_pago, data_liquidacao) FROM stdin;
\.


--
-- Data for Name: transacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transacoes (id, id_transacao_unica, pagador_aluno_id, valor_total_pago, valor_multa, status, caminho_documento, data_transacao) FROM stdin;
\.


--
-- Name: alunos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alunos_id_seq', 3, true);


--
-- Name: emolumentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emolumentos_id_seq', 1, false);


--
-- Name: servicos_academicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicos_academicos_id_seq', 1, true);


--
-- Name: servicos_devidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicos_devidos_id_seq', 1, false);


--
-- Name: transacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transacoes_id_seq', 1, false);


--
-- Name: alunos alunos_nr_estudante_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_nr_estudante_key UNIQUE (nr_estudante);


--
-- Name: alunos alunos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_pkey PRIMARY KEY (id);


--
-- Name: emolumentos emolumentos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emolumentos
    ADD CONSTRAINT emolumentos_codigo_key UNIQUE (codigo);


--
-- Name: emolumentos emolumentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emolumentos
    ADD CONSTRAINT emolumentos_pkey PRIMARY KEY (id);


--
-- Name: pagamentos_servicos pagamentos_servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos_servicos
    ADD CONSTRAINT pagamentos_servicos_pkey PRIMARY KEY (transacao_id, servico_devido_id);


--
-- Name: servicos_academicos servicos_academicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos_academicos
    ADD CONSTRAINT servicos_academicos_pkey PRIMARY KEY (id);


--
-- Name: servicos_devidos servicos_devidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos_devidos
    ADD CONSTRAINT servicos_devidos_pkey PRIMARY KEY (id);


--
-- Name: servicos_devidos servicos_devidos_referencia_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos_devidos
    ADD CONSTRAINT servicos_devidos_referencia_key UNIQUE (referencia);


--
-- Name: transacoes transacoes_id_transacao_unica_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_transacao_unica_key UNIQUE (id_transacao_unica);


--
-- Name: transacoes transacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pkey PRIMARY KEY (id);


--
-- Name: pagamentos_servicos pagamentos_servicos_servico_devido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos_servicos
    ADD CONSTRAINT pagamentos_servicos_servico_devido_id_fkey FOREIGN KEY (servico_devido_id) REFERENCES public.servicos_devidos(id) ON DELETE RESTRICT;


--
-- Name: pagamentos_servicos pagamentos_servicos_transacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos_servicos
    ADD CONSTRAINT pagamentos_servicos_transacao_id_fkey FOREIGN KEY (transacao_id) REFERENCES public.transacoes(id) ON DELETE CASCADE;


--
-- Name: servicos_devidos servicos_devidos_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos_devidos
    ADD CONSTRAINT servicos_devidos_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.alunos(id) ON DELETE CASCADE;


--
-- Name: servicos_devidos servicos_devidos_emolumento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos_devidos
    ADD CONSTRAINT servicos_devidos_emolumento_id_fkey FOREIGN KEY (emolumento_id) REFERENCES public.emolumentos(id);


--
-- Name: transacoes transacoes_pagador_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pagador_aluno_id_fkey FOREIGN KEY (pagador_aluno_id) REFERENCES public.alunos(id) ON DELETE SET NULL;


--
-- Name: TABLE alunos; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.alunos TO ajacs;


--
-- Name: SEQUENCE alunos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.alunos_id_seq TO ajacs;


--
-- PostgreSQL database dump complete
--

\unrestrict ypvMKwq6ghXZOx2TMTKYNyVoM1OuUeMqwudlZWC3Wh80A6sjt8HVlikClw22yZ5

