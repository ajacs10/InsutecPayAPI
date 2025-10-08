import React, { useMemo } from 'react';
import { 
    View, Text, ScrollView, TouchableOpacity, SafeAreaView, 
    ActivityIndicator, Alert, Dimensions, Share, Platform, StyleSheet
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFinance } from '../../../components/FinanceContext';
import ConditionalPdfViewer from '../../../components/ConditionalPdfViewer'; 

// Estilos para React Native
const COLORS = {
    primary: '#1a4a6d',
    white: '#fff',
    textDark: '#333',
    darkBackground: '#1c1c1c',
    lightBackground: '#f5f5f5',
    secondary: '#2ecc71',
    error: '#e74c3c',
};

// ... (Restante dos estilos e funções utilitárias)

const sharedStyles = {
    container: (isDark: boolean) => ({
        flex: 1,
        backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground,
    }),
};

const comprovativoStyles = {
    card: {
        padding: 25,
        marginHorizontal: 20,
        marginTop: 30,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    iconContainer: (status: 'PAGO' | 'PENDENTE' | 'CANCELADO') => ({
        alignSelf: 'center',
        marginBottom: 15,
        padding: 15,
        borderRadius: 50,
        backgroundColor: status === 'PAGO' ? COLORS.secondary : status === 'CANCELADO' ? COLORS.error : COLORS.primary,
    }),
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: COLORS.primary, marginBottom: 5 },
    subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 20 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    detailLabel: { fontSize: 15, color: '#666' },
    detailValue: { fontSize: 15, fontWeight: '600', color: COLORS.textDark, maxWidth: '60%', textAlign: 'right' },
    totalRow: { paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    totalLabel: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
    totalValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginHorizontal: 5 },
    button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center', flex: 1, marginHorizontal: 5, height: 50, justifyContent: 'center' },
    secondaryButton: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    buttonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
    secondaryButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
};

const { height } = Dimensions.get('window');

const formatCurrency = (value: number | null | undefined) =>
    (value || 0).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 });

const formatDateTime = (date: string) => new Date(date).toLocaleString('pt-AO', { dateStyle: 'short', timeStyle: 'short' });

const useColorScheme = () => ({ colorScheme: 'light' });

export default function ComprovativoScreen() {
    const router = useRouter();
    const { id, pdfPath } = useLocalSearchParams() as { id: string; pdfPath?: string };
    const { comprovativos, isLoading: isFinanceLoading } = useFinance();
    const isDarkMode = useColorScheme().colorScheme === 'dark';

    const comprovativo = useMemo(() => {
        return comprovativos.find(c => c.id === id);
    }, [id, comprovativos]);

    const handleShare = async () => {
        const sharePath = comprovativo?.pdfPath || pdfPath;
        if (!sharePath) {
            Alert.alert('Erro', 'Caminho do PDF não encontrado.');
            return;
        }
        if (Platform.OS === 'web') {
            Alert.alert('Erro', 'Compartilhamento de PDF não suportado na web. Baixe o PDF manualmente.');
            return;
        }
        try {
            await Share.share({
                url: `file://${sharePath}`, 
                message: `Comprovativo de Pagamento - ID: ${id}`,
            });
        } catch (error) {
            console.error('Erro ao compartilhar PDF:', error);
            Alert.alert('Erro', 'Não foi possível compartilhar o comprovativo.');
        }
    };

    if (isFinanceLoading || !comprovativo) {
        return (
            <SafeAreaView style={[sharedStyles.container(isDarkMode), { justifyContent: 'center', alignItems: 'center', minHeight: height }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 15, fontSize: 16, color: isDarkMode ? COLORS.white : COLORS.textDark, fontWeight: '500' }}>
                    {isFinanceLoading ? 'Aguardando dados da base de dados...' : (id ? `Buscando comprovativo ${id}...` : 'Nenhum ID de transação fornecido.')}
                </Text>
            </SafeAreaView>
        );
    }

    const iconName = comprovativo.tipo === 'Débito' ? 'close-circle' : 'checkmark-circle';
    const primaryColor = comprovativo.tipo === 'Débito' ? COLORS.primary : COLORS.secondary;
    
    const sourcePath = comprovativo?.pdfPath || pdfPath;
    const source = sourcePath ? { uri: sourcePath, cache: true } : null;


    return (
        <SafeAreaView style={sharedStyles.container(isDarkMode)}>
            <Stack.Screen options={{ title: 'Comprovativo de Pagamento' }} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                
                {/* Visualizador de PDF Condicional */}
                <View style={{ height: 400, margin: 20 }}>
                    <ConditionalPdfViewer 
                        source={source} 
                        style={{ flex: 1, width: '100%', height: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}
                    />
                </View>

                {/* Detalhes da Transação em React Native */}
                <View style={comprovativoStyles.card}>
                    <View style={comprovativoStyles.iconContainer(comprovativo.tipo === 'Débito' ? 'PENDENTE' : 'PAGO')}>
                        <Ionicons name={iconName} size={40} color={COLORS.white} />
                    </View>
                    <Text style={[comprovativoStyles.title, { color: primaryColor }]}>Comprovativo de Pagamento</Text>
                    <Text style={comprovativoStyles.subtitle}>
                        Tipo: <Text style={{ fontWeight: 'bold', color: primaryColor }}>{comprovativo.tipo}</Text>
                    </Text>
                    <View>
                        <View style={comprovativoStyles.detailRow}>
                            <Text style={comprovativoStyles.detailLabel}>Data e Hora</Text>
                            <Text style={comprovativoStyles.detailValue}>{formatDateTime(comprovativo.data)}</Text>
                        </View>
                        <View style={comprovativoStyles.detailRow}>
                            <Text style={comprovativoStyles.detailLabel}>Descrição</Text>
                            <Text style={comprovativoStyles.detailValue}>{comprovativo.descricao}</Text>
                        </View>
                        <View style={comprovativoStyles.detailRow}>
                            <Text style={comprovativoStyles.detailLabel}>Valor</Text>
                            <Text style={comprovativoStyles.detailValue}>{formatCurrency(comprovativo.valor)}</Text>
                        </View>
                        <View style={comprovativoStyles.detailRow}>
                            <Text style={comprovativoStyles.detailLabel}>ID da Transação</Text>
                            <Text style={comprovativoStyles.detailValue}>{comprovativo.id}</Text>
                        </View>
                        <View style={[comprovativoStyles.totalRow, { borderBottomWidth: 0 }]}>
                            <Text style={comprovativoStyles.totalLabel}>TOTAL PAGO</Text>
                            <Text style={comprovativoStyles.totalValue}>{formatCurrency(comprovativo.valor)}</Text>
                        </View>
                    </View>
                    <View style={comprovativoStyles.buttonContainer}>
                        <TouchableOpacity style={comprovativoStyles.secondaryButton} onPress={handleShare}>
                            <Feather name="share-2" size={18} color={COLORS.primary} />
                            <Text style={comprovativoStyles.secondaryButtonText}>Compartilhar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[comprovativoStyles.button, { backgroundColor: primaryColor }]}
                            onPress={() => router.replace('/(tabs)')}
                        >
                            <Text style={comprovativoStyles.buttonText}>Voltar ao Início</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
