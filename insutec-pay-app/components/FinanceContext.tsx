// components/FinanceContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Chaves
const SALDO_KEY = '@insutecpay_saldo';
const COMPROVATIVOS_KEY = '@insutecpay_comprovativos';
const DUMMY_SALDO = 500000.0;

// Tipos
export type Comprovativo = {
  id: string;
  valor: number;
  tipo: 'Débito' | 'Crédito';
  descricao: string;
  data: string;
  pdfPath?: string;
  metodo_pagamento?: string;
  tipo_servico?: string;
  estudante_alvo_id?: string;
  qrCode?: string;
  meses_selecionados?: string;
  valor_propina?: string;
  valor_multas?: string;
  saldoAnterior?: number;
  saldoAtual?: number;
  mensagem_sucesso?: string;
};

type ServicoTipo =
  | 'PROPINA'
  | 'DECLARACAO_NOTA'
  | 'DECLARACAO_SEM_NOTA'
  | 'FOLHA_PROVA'
  | 'OUTRO';

const MENSAGENS_SUCESSO: Record<ServicoTipo, string> = {
  PROPINA: 'Propina paga com sucesso! Comprovativo disponível.',
  DECLARACAO_NOTA: 'Declaração com nota emitida! Baixe seu PDF.',
  DECLARACAO_SEM_NOTA: 'Declaração sem nota gerada com sucesso!',
  FOLHA_PROVA: 'Folha de prova liberada! Acesse agora.',
  OUTRO: 'Pagamento realizado com sucesso!',
};

type FinanceContextType = {
  saldo: number;
  isLoading: boolean;
  comprovativos: Comprovativo[];
  processarPagamento: (
    valor: number,
    descricao: string,
    id: string,
    metodo?: string,
    servico?: ServicoTipo,
    estudante?: string,
    meses?: string,
    propina?: string,
    multas?: string
  ) => Promise<boolean>;
  creditar: (valor: number) => Promise<void>;
  reset: () => Promise<void>;
};

// Contexto
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance deve ser usado dentro de FinanceProvider');
  return ctx;
};

// Provider
export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [saldo, setSaldo] = useState<number>(0);
  const [comprovativos, setComprovativos] = useState<Comprovativo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const load = async () => {
    try {
      const [saldoStr, compStr] = await Promise.all([
        AsyncStorage.getItem(SALDO_KEY),
        AsyncStorage.getItem(COMPROVATIVOS_KEY),
      ]);
      setSaldo(saldoStr ? parseFloat(saldoStr) : DUMMY_SALDO);
      setComprovativos(compStr ? JSON.parse(compStr) : []);
    } catch (e) {
      console.error('Erro ao carregar finanças:', e);
      setSaldo(DUMMY_SALDO);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSaldo = async (v: number) => {
    setSaldo(v);
    await AsyncStorage.setItem(SALDO_KEY, v.toFixed(2));
  };

  const saveComprovativos = async (lista: Comprovativo[]) => {
    setComprovativos(lista);
    await AsyncStorage.setItem(COMPROVATIVOS_KEY, JSON.stringify(lista));
  };

  const generateTxt = (
    id: string,
    desc: string,
    valor: number,
    metodo: string,
    servico: string,
    estudante: string,
    saldoAnt: number,
    saldoAt: number,
    meses?: string,
    propina?: string,
    multas?: string
  ): string => {
    const data = new Date().toLocaleString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const f = (v: number) =>
      v.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 });

    return `
COMPROVATIVO INSUTEC PAY
════════════════════════════════════════
ID: ${id}
Data: ${data}
Serviço: ${servico}
Descrição: ${desc}
Estudante: ${estudante || '—'}
${meses ? `Meses: ${meses}` : ''}
----------------------------------------
Valor: ${f(valor)}
${propina ? `Propina: ${f(parseFloat(propina))}` : ''}
${multas && parseFloat(multas) > 0 ? `Multa: + ${f(parseFloat(multas))}` : ''}
Método: ${metodo}
----------------------------------------
Saldo Anterior: ${f(saldoAnt)}
Saldo Atual: ${f(saldoAt)}
════════════════════════════════════════
Emissão: ${new Date().toLocaleString('pt-AO')}
    `.trim();
  };

  const processarPagamento = async (
    valor: number,
    descricao: string,
    id: string,
    metodo = 'Carteira Digital',
    servico: ServicoTipo = 'OUTRO',
    estudante = '',
    meses = '',
    propina = '',
    multas = ''
  ): Promise<boolean> => {
    if (saldo < valor) {
      Alert.alert('Saldo Insuficiente', `Você precisa de ${formatCurrency(valor)}`);
      return false;
    }

    const saldoAnt = saldo;
    const novoSaldo = saldo - valor;

    await saveSaldo(novoSaldo);

    const qrData = JSON.stringify({ id, valor, data: new Date().toISOString(), estudante, servico, metodo });
    let pdfPath: string | undefined;

    if (Platform.OS !== 'web') {
      try {
        const dir = `${FileSystem.documentDirectory}comprovativos/`;
        const info = await FileSystem.getInfoAsync(dir);
        if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

        const filePath = `${dir}${id}.txt`;
        const txt = generateTxt(id, descricao, valor, metodo, servico, estudante, saldoAnt, novoSaldo, meses, propina, multas);
        await FileSystem.writeAsStringAsync(filePath, txt, { encoding: FileSystem.EncodingType.UTF8 });
        pdfPath = filePath;
      } catch (e) {
        console.warn('Falha ao gerar TXT:', e);
      }
    }

    const comprovativo: Comprovativo = {
      id,
      valor,
      tipo: 'Débito',
      descricao,
      data: new Date().toISOString(),
      pdfPath,
      metodo_pagamento: metodo,
      tipo_servico: servico,
      estudante_alvo_id: estudante,
      qrCode: qrData,
      meses_selecionados: meses,
      valor_propina: propina,
      valor_multas: multas,
      saldoAnterior: saldoAnt,
      saldoAtual: novoSaldo,
      mensagem_sucesso: MENSAGENS_SUCESSO[servico],
    };

    await saveComprovativos([comprovativo, ...comprovativos]);
    return true;
  };

  const creditar = async (valor: number) => {
    if (valor <= 0) return;
    await saveSaldo(saldo + valor);
  };

  const reset = async () => {
    await AsyncStorage.multiRemove([SALDO_KEY, COMPROVATIVOS_KEY]);
    setSaldo(DUMMY_SALDO);
    setComprovativos([]);
    Alert.alert('Reset', 'Dados financeiros resetados.');
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <FinanceContext.Provider
      value={{ saldo, isLoading, comprovativos, processarPagamento, creditar, reset }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 });
