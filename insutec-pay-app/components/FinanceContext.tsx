import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// --- CONFIGURAÇÃO ---
const SALDO_STORAGE_KEY = '@insutecpay_saldo';
const COMPROVATIVOS_STORAGE_KEY = '@insutecpay_comprovativos';

const DUMMY_SALDO_INICIAL = 5000000000.00;
const DUMMY_COMPROVATIVOS_INICIAIS: any[] = [];

type Comprovativo = {
    id: string;
    valor: number;
    tipo: 'Crédito' | 'Débito';
    descricao: string;
    data: string;
    pdfPath?: string;
    metodo_pagamento?: string;
    tipo_servico?: string;
    estudante_alvo_id?: string;
};

type FinanceContextType = {
    saldo: number;
    isLoading: boolean;
    comprovativos: Comprovativo[];
    updateSaldo: (valor: number) => Promise<void>;
    addComprovativo: (comprovativo: Comprovativo) => Promise<void>;
    resetSaldo: () => Promise<void>;
    processarPagamento: (
        valor: number, 
        descricao: string, 
        id_transacao_unica?: string, 
        metodo_pagamento?: string, 
        tipo_servico?: string, 
        estudante_alvo_id?: string
    ) => Promise<boolean>;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};

// --- PROVIDER ---
export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [saldo, setSaldo] = useState<number>(0);
    const [comprovativos, setComprovativos] = useState<Comprovativo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const storedSaldo = await AsyncStorage.getItem(SALDO_STORAGE_KEY);
            const storedComprovativos = await AsyncStorage.getItem(COMPROVATIVOS_STORAGE_KEY);

            if (storedSaldo !== null) {
                setSaldo(parseFloat(storedSaldo));
            } else {
                await AsyncStorage.setItem(SALDO_STORAGE_KEY, DUMMY_SALDO_INICIAL.toString());
                setSaldo(DUMMY_SALDO_INICIAL);
            }

            if (storedComprovativos !== null) {
                setComprovativos(JSON.parse(storedComprovativos));
            } else {
                setComprovativos(DUMMY_COMPROVATIVOS_INICIAIS);
            }
        } catch (error) {
            console.error('[FinanceContext] Erro ao carregar dados:', error);
            setSaldo(DUMMY_SALDO_INICIAL);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateSaldo = useCallback(async (novoValor: number) => {
        try {
            setSaldo(novoValor);
            await AsyncStorage.setItem(SALDO_STORAGE_KEY, novoValor.toString());
        } catch (error) {
            console.error('[FinanceContext] Erro ao salvar novo saldo:', error);
        }
    }, []);

    const addComprovativo = useCallback(async (comprovativo: Comprovativo) => {
        try {
            setComprovativos(prev => {
                const newComprovativos = [comprovativo, ...prev];
                AsyncStorage.setItem(COMPROVATIVOS_STORAGE_KEY, JSON.stringify(newComprovativos));
                return newComprovativos;
            });
        } catch (error) {
            console.error('[FinanceContext] Erro ao adicionar comprovativo:', error);
        }
    }, []);

    // CORREÇÃO: Geração de PDF simplificada sem StorageAccessFramework
    const generateComprovativoContent = (
        idTransacao: string,
        descricao: string,
        valor: number,
        metodo_pagamento?: string,
        tipo_servico?: string,
        estudante_alvo_id?: string,
        saldoAnterior?: number,
        saldoAtual?: number
    ): string => {
        const currentDate = new Date().toLocaleString('pt-AO');
        const formatCurrency = (v: number) => v.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });

        return `
COMPROVATIVO DE PAGAMENTO - INSUTEC PAY
========================================

ID da Transação: ${idTransacao}
Data/Hora: ${currentDate}
Status: PAGO

DETALHES DO PAGAMENTO:
----------------------
Serviço: ${tipo_servico || 'Serviço Académico'}
Descrição: ${descricao}
${estudante_alvo_id ? `Estudante: ${estudante_alvo_id}` : ''}

INFORMAÇÕES FINANCEIRAS:
------------------------
Valor do Pagamento: ${formatCurrency(valor)}
Método de Pagamento: ${metodo_pagamento || 'Cartão Atlântico Universitário+'}
${saldoAnterior ? `Saldo Anterior: ${formatCurrency(saldoAnterior)}` : ''}
${saldoAtual ? `Saldo Atual: ${formatCurrency(saldoAtual)}` : ''}

========================================
Este é um comprovativo eletrónico gerado
automaticamente pelo sistema InsutecPay.

Data de emissão: ${currentDate}
Transação ID: ${idTransacao}
========================================
        `.trim();
    };

    const processarPagamento = useCallback(async (
        valor: number, 
        descricao: string, 
        id_transacao_unica?: string, 
        metodo_pagamento?: string, 
        tipo_servico?: string, 
        estudante_alvo_id?: string
    ): Promise<boolean> => {
        console.log(`[FinanceContext] Processando pagamento: ${valor}, saldo atual: ${saldo}`);
        
        if (saldo < valor) {
            console.error('[FinanceContext] Saldo insuficiente para processar pagamento.');
            Alert.alert('Erro', 'Saldo insuficiente para processar o pagamento.');
            return false;
        }

        try {
            const saldoAnterior = saldo;
            const novoSaldo = saldo - valor;
            await updateSaldo(novoSaldo);

            const idTransacao = id_transacao_unica || `TX-${Date.now()}`;
            let pdfPath: string | undefined;

            // CORREÇÃO: Geração de arquivo simplificada sem permissões complexas
            if (Platform.OS !== 'web') {
                try {
                    // Usando documentDirectory que não requer permissões especiais
                    const directory = `${FileSystem.documentDirectory}comprovativos/`;
                    
                    // Verifica se o diretório existe, se não, cria
                    const dirInfo = await FileSystem.getInfoAsync(directory);
                    if (!dirInfo.exists) {
                        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
                    }

                    const fileName = `comprovativo_${idTransacao}.txt`;
                    const filePath = `${directory}${fileName}`;
                    
                    const comprovativoContent = generateComprovativoContent(
                        idTransacao,
                        descricao,
                        valor,
                        metodo_pagamento,
                        tipo_servico,
                        estudante_alvo_id,
                        saldoAnterior,
                        novoSaldo
                    );

                    await FileSystem.writeAsStringAsync(filePath, comprovativoContent, {
                        encoding: FileSystem.EncodingType.UTF8
                    });
                    
                    pdfPath = filePath;
                    console.log(`✅ Comprovativo salvo em: ${pdfPath}`);
                    
                } catch (pdfError) {
                    console.log('📝 Comprovativo não gerado (continuação normal):', pdfError);
                    // Não bloqueia o pagamento se o arquivo falhar
                }
            } else {
                console.log('🌐 Ambiente web: comprovativo não salvo localmente');
            }

            const novoComprovativo: Comprovativo = {
                id: idTransacao,
                valor,
                tipo: 'Débito',
                descricao,
                data: new Date().toISOString(),
                pdfPath,
                metodo_pagamento,
                tipo_servico,
                estudante_alvo_id
            };

            await addComprovativo(novoComprovativo);

            console.log(`[FinanceContext] ✅ Pagamento de ${valor} processado com SUCESSO. Novo saldo: ${novoSaldo}`);
            return true;

        } catch (error) {
            console.error('[FinanceContext] ❌ Erro crítico ao processar pagamento:', error);
            Alert.alert('Erro', 'Não foi possível processar o pagamento. Tente novamente.');
            return false;
        }
    }, [saldo, updateSaldo, addComprovativo]);

    const resetSaldo = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(SALDO_STORAGE_KEY);
            await AsyncStorage.removeItem(COMPROVATIVOS_STORAGE_KEY);
            console.log('[FinanceContext] AsyncStorage limpo. Recarregando dados...');
            await loadData();
        } catch (error) {
            console.error('[FinanceContext] Erro ao resetar dados:', error);
        }
    }, [loadData]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const contextValue: FinanceContextType = {
        saldo,
        isLoading,
        comprovativos,
        updateSaldo,
        addComprovativo,
        resetSaldo,
        processarPagamento,
    };

    return (
        <FinanceContext.Provider value={contextValue}>
            {children}
        </FinanceContext.Provider>
    );
};
