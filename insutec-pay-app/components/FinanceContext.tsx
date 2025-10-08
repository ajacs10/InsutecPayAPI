import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';



// --- CONFIGURAÇÃO ---
const SALDO_STORAGE_KEY = '@insutecpay_saldo';
const COMPROVATIVOS_STORAGE_KEY = '@insutecpay_comprovativos';

const DUMMY_SALDO_INICIAL = 5000000000.00;
const DUMMY_COMPROVATIVOS_INICIAIS: any[] = [];

// --- TIPAGEM ---
type Comprovativo = {
    id: string;
    valor: number;
    tipo: 'Crédito' | 'Débito';
    descricao: string;
    data: string;
    pdfPath?: string;
};

type FinanceContextType = {
    saldo: number;
    isLoading: boolean;
    comprovativos: Comprovativo[];
    updateSaldo: (valor: number) => Promise<void>;
    addComprovativo: (comprovativo: Comprovativo) => Promise<void>;
    resetSaldo: () => Promise<void>;
    processarPagamento: (valor: number, descricao: string) => Promise<boolean>;
};

// Valor padrão do Contexto
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// --- HOOK PERSONALIZADO ---
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

    // Função para solicitar permissão de armazenamento
    const requestStoragePermission = async (): Promise<boolean> => {
        // A permissão só é necessária em Android
        if (Platform.OS !== 'android') return true; 

        try {
            const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
            const result = await request(permission);
            if (result === RESULTS.GRANTED) {
                console.log('[FinanceContext] Permissão de armazenamento concedida.');
                return true;
            } else {
                Alert.alert(
                    'Permissão Necessária',
                    'Para gerar o comprovativo em PDF, permita o acesso ao armazenamento.',
                    [{ text: 'OK' }]
                );
                return false;
            }
        } catch (error) {
            console.error('[FinanceContext] Erro ao solicitar permissão:', error);
            Alert.alert('Erro', 'Não foi possível verificar a permissão de armazenamento.');
            return false;
        }
    };

    // Função para carregar o saldo e comprovativos
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

    // Função para atualizar e persistir o saldo
    const updateSaldo = useCallback(async (novoValor: number) => {
        try {
            setSaldo(novoValor);
            await AsyncStorage.setItem(SALDO_STORAGE_KEY, novoValor.toString());
        } catch (error) {
            console.error('[FinanceContext] Erro ao salvar novo saldo:', error);
        }
    }, []);

    // Função para adicionar comprovativo
    const addComprovativo = useCallback(async (comprovativo: Comprovativo) => {
        try {
            setComprovativos(prev => {
                const newComprovativos = [comprovativo, ...prev]; // Adicionar mais recente primeiro
                AsyncStorage.setItem(COMPROVATIVOS_STORAGE_KEY, JSON.stringify(newComprovativos));
                return newComprovativos;
            });
        } catch (error) {
            console.error('[FinanceContext] Erro ao adicionar comprovativo:', error);
        }
    }, []);

    // Função para processar o pagamento e gerar PDF (mobile-only)
    const processarPagamento = useCallback(async (valor: number, descricao: string): Promise<boolean> => {
        if (saldo < valor) {
            console.error('[FinanceContext] Saldo insuficiente para processar pagamento.');
            Alert.alert('Erro', 'Saldo insuficiente para processar o pagamento.');
            return false;
        }

        try {
            const novoSaldo = saldo - valor;
            await updateSaldo(novoSaldo);

            const idTransacao = Date.now().toString();
            let pdfPath: string | undefined;

            // 💡 Usar RNFS e RNHTMLtoPDF APENAS se não for web (e se o require funcionar)
            if (Platform.OS !== 'web' && RNFS && RNHTMLtoPDF) {
                const hasPermission = await requestStoragePermission();
                if (!hasPermission) return false;

                // Formatação simples para HTML
                const formatCurrency = (v: number) => v.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });

                const htmlContent = `
                    <html>
                        <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                            <h1 style="color: #1a4a6d;">Comprovativo de Pagamento - InsutecPay</h1>
                            <p style="font-size: 14px; color: #666;">Transação concluída com sucesso.</p>
                            <h2 style="color: #2ecc71; font-size: 28px;">${formatCurrency(valor)}</h2>
                            <p><strong>Descrição:</strong> ${descricao}</p>
                            <p><strong>ID da Transação:</strong> ${idTransacao}</p>
                            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-AO')}</p>
                            <p><strong>Tipo:</strong> Débito</p>
                            <hr style="margin-top: 20px; border-color: #ddd;">
                            <p><strong>Novo Saldo:</strong> ${formatCurrency(novoSaldo)}</p>
                        </body>
                    </html>
                `;

                // 💡 Usar RNFS.default e RNHTMLtoPDF.default
                const options = {
                    html: htmlContent,
                    fileName: `comprovativo_${idTransacao}`,
                    // Direcionar para DocumentDirectoryPath é mais seguro do que External Storage (apenas Android)
                    directory: `${RNFS.default.DocumentDirectoryPath}/Comprovativos`, 
                };

                // Criar diretório e gerar PDF
                await RNFS.default.mkdir(options.directory);
                const file = await RNHTMLtoPDF.default.pdf(options);
                pdfPath = file.filePath;
            }

            const novoComprovativo: Comprovativo = {
                id: idTransacao,
                valor,
                tipo: 'Débito',
                descricao,
                data: new Date().toISOString(),
                pdfPath,
            };
            await addComprovativo(novoComprovativo);

            console.log(`[FinanceContext] Pagamento de ${valor} processado. Novo saldo: ${novoSaldo}, PDF gerado: ${pdfPath || 'N/A (web)'}`);
            return true;
        } catch (error) {
            console.error('[FinanceContext] Erro ao processar pagamento ou gerar PDF:', error);
            Alert.alert('Erro', 'Não foi possível processar o pagamento ou gerar o comprovativo.');
            return false;
        }
    }, [saldo, updateSaldo, addComprovativo]);

    // Função para resetar o saldo
    const resetSaldo = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(SALDO_STORAGE_KEY);
            await AsyncStorage.removeItem(COMPROVATIVOS_STORAGE_KEY);
            console.log('[FinanceContext] AsyncStorage Saldo e Comprovativos limpos. Recarregando com DUMMY_SALDO_INICIAL.');
            await loadData();
        } catch (error) {
            console.error('[FinanceContext] Erro ao resetar dados:', error);
        }
    }, [loadData]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const contextValue = {
        saldo,
        isLoading,
        comprovativos,
        updateSaldo,
        addComprovativo,
        resetSaldo,
        processarPagamento,
    };

    if (isLoading) {
        return null; // Não renderizar nada enquanto carrega
    }

    return (
        <FinanceContext.Provider value={contextValue}>
            {children}
        </FinanceContext.Provider>
    );
};
