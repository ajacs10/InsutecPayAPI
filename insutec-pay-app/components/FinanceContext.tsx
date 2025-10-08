// components/FinanceContext.tsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { addNotificacao } from '../src/api/InsutecPayAPI';
import { useAuth } from './AuthContext';
import { Notificacao, Recibo } from '../src/types';
import { formatCurrency } from '../src/utils/formatters';

interface FinanceContextType {
  saldo: number;
  recibos: Recibo[];
  processarPagamento: (valor: number, descricao: string, id_transacao_unica: string, metodo_pagamento: string) => Promise<boolean>;
  adicionarRecibo: (recibo: Recibo) => void;
  carregarRecibos: () => Promise<void>;
  recarregarSaldo: (valor: number) => void;
  atualizarSaldo: (novoSaldo: number) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { aluno } = useAuth();
  const [saldo, setSaldo] = useState<number>(450000); // Saldo inicial
  const [recibos, setRecibos] = useState<Recibo[]>([
    {
      id: '1',
      title: 'Propina - Novembro 2025',
      description: 'Serviço: Mensalidade regular',
      date: '2025-11-01T00:00:00Z',
      total: 75000.00,
      status: 'PENDENTE',
      type: 'Serviço',
      details: [
        { label: 'Data Limite', value: '2025-11-10' }, 
        { label: 'Referência', value: 'PROPINA2511' }
      ],
    },
    {
      id: '2',
      title: 'Reconfirmação de Matrícula',
      description: 'Serviço: Reconfirmação Anual',
      date: '2025-09-15T00:00:00Z',
      total: 15000.00,
      status: 'VENCIDO',
      type: 'Serviço',
      details: [
        { label: 'Data Limite', value: '2025-09-30' }, 
        { label: 'Referência', value: 'RECONF25' }
      ],
    },
    {
      id: '3',
      title: 'Compra de Livros Didáticos',
      description: 'Transação: Livraria Universitária',
      date: '2025-10-01T00:00:00Z',
      total: 45000.00,
      status: 'PAGO',
      type: 'Externo',
      details: [
        { label: 'Método', value: 'Cartão 5678' }, 
        { label: 'Moeda', value: 'AOA' }
      ],
      saldo_anterior: 495000,
      saldo_atual: 450000,
    },
  ]);

  // Função para carregar recibos da API
  const carregarRecibos = useCallback(async (): Promise<void> => {
    try {
      // Aqui você implementaria a chamada real para a API
      // const recibosDaAPI = await obterRecibos();
      // setRecibos(recibosDaAPI);
      console.log('[FinanceContext] Carregando recibos...');
    } catch (error) {
      console.error('[FinanceContext] Erro ao carregar recibos:', error);
    }
  }, []);

  // Função para recarregar saldo
  const recarregarSaldo = useCallback((valor: number) => {
    if (valor <= 0) {
      Alert.alert('Erro', 'Valor de recarga deve ser positivo.');
      return;
    }
    
    setSaldo(prevSaldo => {
      const novoSaldo = prevSaldo + valor;
      
      // Adicionar notificação de recarga
      if (aluno?.id) {
        const novaNotificacao: Notificacao = {
          id: Date.now().toString(),
          aluno_id: aluno.id,
          tipo: 'INFORMATIVA',
          titulo: 'Recarga de Saldo',
          mensagem: `Recarga de ${formatCurrency(valor)} realizada com sucesso. Saldo atual: ${formatCurrency(novoSaldo)}.`,
          data: new Date().toISOString(),
          lida: false,
          acao_link: '/telas/financeiro/CarteiraScreen',
        };

        addNotificacao(novaNotificacao).catch((error) => {
          console.error('[FinanceContext] Erro ao adicionar notificação de recarga:', error);
        });
      }

      console.log(`[FinanceContext] Saldo recarregado: ${formatCurrency(prevSaldo)} -> ${formatCurrency(novoSaldo)}`);
      return novoSaldo;
    });
  }, [aluno?.id]);

  // Função para atualizar saldo diretamente
  const atualizarSaldo = useCallback((novoSaldo: number) => {
    if (novoSaldo < 0) {
      console.warn('[FinanceContext] Tentativa de definir saldo negativo, definindo como 0');
      setSaldo(0);
      return;
    }
    setSaldo(novoSaldo);
    console.log(`[FinanceContext] Saldo atualizado para: ${formatCurrency(novoSaldo)}`);
  }, []);

  const processarPagamento = useCallback(
    async (valor: number, descricao: string, id_transacao_unica: string, metodo_pagamento: string): Promise<boolean> => {
      console.log('[FinanceContext] Iniciando processamento de pagamento:', {
        valor: formatCurrency(valor),
        descricao,
        id_transacao_unica,
        metodo_pagamento,
        saldo_atual: formatCurrency(saldo)
      });

      if (valor <= 0) {
        Alert.alert('Erro', 'Valor do pagamento deve ser positivo.');
        return false;
      }

      if (saldo < valor) {
        Alert.alert('Erro', 'Saldo insuficiente para realizar o pagamento.');
        return false;
      }

      if (!aluno?.id) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return false;
      }

      try {
        const saldoAnterior = saldo;
        const novoSaldo = saldo - valor;
        
        // Atualizar saldo
        setSaldo(novoSaldo);

        // Criar novo recibo
        const novoRecibo: Recibo = {
          id: id_transacao_unica,
          title: descricao,
          description: `Pagamento: ${descricao}`,
          date: new Date().toISOString(),
          total: valor,
          status: 'PAGO',
          type: 'Serviço',
          details: [
            { label: 'Referência', value: id_transacao_unica },
            { label: 'Método', value: metodo_pagamento },
            { label: 'Moeda', value: 'AOA' },
            { label: 'Data', value: new Date().toLocaleDateString('pt-AO') },
          ],
          saldo_anterior: saldoAnterior,
          saldo_atual: novoSaldo,
        };

        // Adicionar recibo à lista
        setRecibos((prevRecibos) => [novoRecibo, ...prevRecibos]);

        // Adicionar notificação
        const novaNotificacao: Notificacao = {
          id: Date.now().toString(),
          aluno_id: aluno.id,
          tipo: 'INFORMATIVA',
          titulo: 'Pagamento Concluído',
          mensagem: `Pagamento de ${formatCurrency(valor)} para ${descricao} foi concluído com sucesso. Saldo atual: ${formatCurrency(novoSaldo)}.`,
          data: new Date().toISOString(),
          lida: false,
          acao_link: `/telas/transacao/${id_transacao_unica}`,
        };

        // Usar a função corrigida da API
        await addNotificacao(novaNotificacao);

        console.log('[FinanceContext] Pagamento processado com sucesso:', {
          transacao: id_transacao_unica,
          valor: formatCurrency(valor),
          saldo_anterior: formatCurrency(saldoAnterior),
          saldo_atual: formatCurrency(novoSaldo)
        });

        return true;

      } catch (error) {
        console.error('[FinanceContext] Erro ao processar pagamento:', error);
        
        // Reverter o saldo em caso de erro
        setSaldo(saldo);
        
        Alert.alert(
          'Erro no Pagamento', 
          'Ocorreu um erro ao processar o pagamento. Seu saldo não foi debitado. Por favor, tente novamente.'
        );
        return false;
      }
    },
    [saldo, aluno]
  );

  const adicionarRecibo = useCallback((recibo: Recibo) => {
    setRecibos((prev) => [recibo, ...prev]);
    console.log('[FinanceContext] Novo recibo adicionado:', recibo.id);
  }, []);

  // Valor do contexto memoizado para otimização
  const contextValue = useMemo((): FinanceContextType => ({
    saldo,
    recibos,
    processarPagamento,
    adicionarRecibo,
    carregarRecibos,
    recarregarSaldo,
    atualizarSaldo,
  }), [
    saldo, 
    recibos, 
    processarPagamento, 
    adicionarRecibo, 
    carregarRecibos,
    recarregarSaldo,
    atualizarSaldo
  ]);

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
};
