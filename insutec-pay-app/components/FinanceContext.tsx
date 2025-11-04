// components/FinanceContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Comprovativo {
  id: string;
  valor: number;
  descricao: string;
  data: string;
  tipo_servico: string;
  metodo_pagamento: string;
  estudante_alvo_id: string;
  meses_selecionados?: string;
  valor_propina?: string;
  valor_multas?: string;
}

interface FinanceContextType {
  saldo: number;
  comprovativos: Comprovativo[];
  isLoading: boolean;
  processarPagamento: (
    valor: number,
    descricao: string,
    transacaoId: string,
    metodo: string,
    tipo_servico: string,
    estudante_id: string,
    meses?: string,
    valor_propina?: string,
    valor_multas?: string
  ) => Promise<boolean>;
  adicionarSaldo: (valor: number) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [saldo, setSaldo] = useState(0);
  const [comprovativos, setComprovativos] = useState<Comprovativo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [saldoStr, compStr] = await Promise.all([
        AsyncStorage.getItem('@InsutecPay:saldo'),
        AsyncStorage.getItem('@InsutecPay:comprovativos'),
      ]);

      setSaldo(saldoStr ? parseFloat(saldoStr) : 50000);
      setComprovativos(compStr ? JSON.parse(compStr) : []);
    } catch (error) {
      console.error('Erro ao carregar finanças:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const salvarSaldo = async (novoSaldo: number) => {
    await AsyncStorage.setItem('@InsutecPay:saldo', novoSaldo.toString());
    setSaldo(novoSaldo);
  };

  const salvarComprovativo = async (comp: Comprovativo) => {
    const novos = [comp, ...comprovativos];
    await AsyncStorage.setItem('@InsutecPay:comprovativos', JSON.stringify(novos));
    setComprovativos(novos);
  };

  const processarPagamento = async (
    valor: number,
    descricao: string,
    transacaoId: string,
    metodo: string,
    tipo_servico: string,
    estudante_id: string,
    meses?: string,
    valor_propina?: string,
    valor_multas?: string
  ): Promise<boolean> => {
    try {
      if (valor > saldo) return false;

      const novoSaldo = saldo - valor;
      await salvarSaldo(novoSaldo);

      const comprovativo: Comprovativo = {
        id: transacaoId,
        valor,
        descricao,
        data: new Date().toISOString(),
        tipo_servico,
        metodo_pagamento: metodo,
        estudante_alvo_id: estudante_id,
        meses_selecionados: meses,
        valor_propina,
        valor_multas,
      };

      await salvarComprovativo(comprovativo);
      return true;
    } catch (error) {
      console.error('Erro no pagamento:', error);
      return false;
    }
  };

  const adicionarSaldo = async (valor: number) => {
    const novo = saldo + valor;
    await salvarSaldo(novo);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <FinanceContext.Provider value={{ saldo, comprovativos, isLoading, processarPagamento, adicionarSaldo }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance deve ser usado dentro de FinanceProvider');
  return context;
};
