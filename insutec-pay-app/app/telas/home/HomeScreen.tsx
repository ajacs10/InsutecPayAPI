import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    FlatList,
    Animated,
    StatusBar,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
// 🛑 CORREÇÃO: Usamos 'signOut' do AuthContext e renomeamos para 'logout'
import { useAuth } from '../../../components/AuthContext'; 
import { useTheme } from '../ThemeContext/ThemeContext';
// Certifique-se de que este caminho está correto:
import { styles } from '../../../styles/_HomeStyles.ts'; 
import { formatCurrency } from '../../../src/utils/formatters';
import { getTransacoesRecentes, PagamentoTransacao } from '../../../src/api/InsutecPayAPI';

// Logo da universidade
const UNIVERSITY_LOGO = require('../../../assets/images/logo.png');

// Interface para serviços
interface Servico {
    id: string;
    nome: string;
    valor?: number;
    pendente: boolean;
    icon: string;
    anos?: { [key: number]: number };
    isSpecial?: boolean;
}

// Lista de serviços disponíveis
const SERVICOS: Servico[] = [
    { id: '1', nome: 'Propina', pendente: false, icon: 'money', anos: { 1: 45550, 2: 45550, 3: 45550, 4: 45550 } },
    { id: '2', nome: 'Reconfirmação de Matrícula', valor: 15000, pendente: false, icon: 'check-circle' },
    { id: '3', nome: 'Folha de Prova', valor: 200, pendente: false, icon: 'file-text' },
    { id: '4', nome: 'Declaração com Notas', valor: 15000, pendente: false, icon: 'file-text-o' },
    { id: '5', nome: 'Declaração sem Notas', valor: 10000, pendente: false, icon: 'file' },
    { id: '6', nome: 'Perfil', pendente: false, icon: 'user' },
    { id: '7', nome: 'Logout', pendente: false, icon: 'sign-out' },
];

// Componente Auxiliar: Cartão de Serviço
const ServicoCard: React.FC<{ servico: Servico; onPress: () => void }> = ({ servico, onPress }) => {
    const { isDarkMode } = useTheme();

    return (
        // ✅ CORREÇÃO: Usamos o styles.card para um melhor layout no menu lateral.
        <TouchableOpacity
            style={[styles.card(isDarkMode), { marginBottom: 8, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12 }]} 
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityLabel={`Ação ${servico.nome}`}
        >
            <FontAwesome name={servico.icon} size={20} color={styles.cardTitle(isDarkMode).color} style={{ marginRight: 10 }} />
            <Text style={styles.cardTitle(isDarkMode)}>{servico.nome}</Text>
        </TouchableOpacity>
    );
};

// Componente Auxiliar: Cartão de Status
interface StatusCardProps {
    total: number;
    loading: boolean;
    nextDueDate?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ total, loading, nextDueDate }) => {
    const { isDarkMode } = useTheme();

    return (
        <View style={[styles.card(isDarkMode), styles.cardSuccess(isDarkMode), { padding: 16, marginBottom: 20 }]}>
            <View style={styles.cardHeader(isDarkMode)}>
                <Text style={styles.cardTitle(isDarkMode)}>Status Financeiro</Text>
                <FontAwesome name="check-circle" size={20} color={styles.cardSuccess(isDarkMode).borderLeftColor} />
            </View>
            {loading ? (
                <ActivityIndicator size="small" color={styles.cardTitle(isDarkMode).color} style={{ marginVertical: 10 }} />
            ) : (
                <>
                    <Text style={[styles.totalPendencyValue(isDarkMode), { fontSize: 28, fontWeight: 'bold', marginVertical: 8 }]}>{formatCurrency(total)}</Text>
                    
                    {total === 0 ? (
                        <Text style={[styles.cardSubtitle(isDarkMode), { fontSize: 12, marginTop: 6 }]}>
                            Sem dívidas pendentes. Explore os serviços!
                        </Text>
                    ) : (
                        <Text style={[styles.cardDetailSmall(isDarkMode), { fontSize: 12, marginTop: 6 }]}>
                            Próximo vencimento: **{nextDueDate}**
                        </Text>
                    )}
                    
                    <TouchableOpacity
                        style={[styles.payButton(isDarkMode), { paddingVertical: 10, marginTop: 15, opacity: total > 0 ? 1 : 0.5 }]}
                        onPress={() => total > 0 && router.push('/telas/dividas/DividasScreen')}
                        activeOpacity={0.8}
                        disabled={total === 0}
                        accessibilityLabel={total > 0 ? 'Pagar agora' : 'Sem pendências'}
                    >
                        <Text style={[styles.payButtonText(isDarkMode), { fontSize: 16 }]}>
                            {total > 0 ? 'Pagar Agora' : 'Ver Serviços'}
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

// Componente Auxiliar: Item de Transação Recente
interface RecentTransactionItemProps {
    item: PagamentoTransacao;
}

const RecentTransactionItem: React.FC<RecentTransactionItemProps> = ({ item }) => {
    const { isDarkMode } = useTheme();
    let statusColor = styles.listItemValue(isDarkMode).color;
    let statusIcon = 'clock-o';

    if (item.status === 'PAGO') {
        statusColor = styles.cardSuccess(isDarkMode).borderLeftColor;
        statusIcon = 'check-circle';
    } else if (item.status === 'CANCELADO' || item.status === 'ERRO') {
        statusColor = styles.payButton(isDarkMode).backgroundColor;
        statusIcon = 'times-circle';
    }

    return (
        <TouchableOpacity
            style={[styles.listItem(isDarkMode), { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: styles.cardSubtitle(isDarkMode).color }]}
            onPress={() => router.push(`/telas/transacao/${item.id_transacao_unica}`)}
            activeOpacity={0.7}
            accessibilityLabel={`Detalhes da transação ${item.descricao}`}
        >
            <View style={[styles.listItemIconContainer(isDarkMode), { backgroundColor: statusColor, width: 32, height: 32 }]}>
                <FontAwesome name={statusIcon} size={16} color={styles.card(isDarkMode).backgroundColor} />
            </View>
            <View style={styles.listItemTextContainer(isDarkMode)}>
                <Text style={[styles.listItemTitle(isDarkMode), { fontSize: 14 }]} numberOfLines={1}>
                    {item.descricao}
                </Text>
                <Text style={[styles.listItemSubtitle(isDarkMode), { fontSize: 11, marginTop: 4 }]}>
                    {new Date(item.data_transacao || Date.now()).toLocaleDateString('pt-PT')}
                </Text>
            </View>
            <View style={styles.listItemValueContainer(isDarkMode)}>
                <Text style={[styles.listItemValue(isDarkMode), { fontSize: 14, color: statusColor }]}>
                    {formatCurrency(item.valor)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// Ecrã Principal (Dashboard)
export default function HomeScreen() {
    // 🛑 CORREÇÃO FINAL: Renomeamos signOut para logout aqui para evitar o erro anterior.
    const { aluno, signOut: logout } = useAuth(); 
    const { isDarkMode } = useTheme();
    const [dívidaTotal, setDívidaTotal] = useState(0);
    const [transacoesRecentes, setTransacoesRecentes] = useState<PagamentoTransacao[]>([]);
    const [loadingDívida, setLoadingDívida] = useState(false);
    const [loadingTransacoes, setLoadingTransacoes] = useState(true);
    const [nextDueDate, setNextDueDate] = useState<string | undefined>(undefined);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarWidth = useRef(new Animated.Value(0)).current;

    const alunoId = aluno?.id;

    // Estado para data e hora
    const [currentTime, setCurrentTime] = useState<string>('02:34 PM WAT');

    // Atualiza a data e hora em tempo real
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Africa/Luanda',
            };
            // Simplificamos a formatação da hora para apenas hora e minuto
            setCurrentTime(now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })); 
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Função para carregar Dívidas e Transações
    const loadData = useCallback(async () => {
        if (!alunoId) return;

        // 🛑 CORREÇÃO: Simulação da Dívida e Carregamento (substituir por API real)
        setLoadingDívida(true);
        // Simular o carregamento
        await new Promise(resolve => setTimeout(resolve, 800)); 

        try {
            // SIMULAÇÃO DE DADOS (Remover isto quando ligar à API de dívidas)
            setDívidaTotal(45550 * 2); 
            setNextDueDate('31 de Julho de 2025');

            // Carregar Transações Recentes (API Real - Ajustar para usar o URL ngrok/API pública)
            setLoadingTransacoes(true);
            const recentes = await getTransacoesRecentes(alunoId);
            setTransacoesRecentes(recentes.slice(0, 3));
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
            setDívidaTotal(0);
            setTransacoesRecentes([]);
        } finally {
            setLoadingDívida(false);
            setLoadingTransacoes(false);
        }
    }, [alunoId]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const firstName = aluno?.nome?.split(' ')[0] || 'Usuário';

    // Função para navegar ou executar ação ao selecionar um serviço
    const handleServicoPress = (servico: Servico) => {
        setIsSidebarOpen(false);
        // Animação para fechar a sidebar
        Animated.timing(sidebarWidth, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start(() => {
            // Lógica executada APÓS o fecho da sidebar
            if (servico.nome === 'Logout') {
                logout(); // Usa o 'logout' renomeado
                router.replace('/telas/login/LoginScreen');
            } else if (servico.nome === 'Perfil') {
                router.push('/telas/perfil/PerfilScreen');
            } else {
                router.push({
                    pathname: '/telas/ServicoPagamento/ServicoPagamentoScreen',
                    params: { servico: JSON.stringify([servico]) }, // ✅ Envia como array
                });
            }
        });
    };

    // Animação do menu lateral
    const toggleSidebar = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
            Animated.timing(sidebarWidth, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else {
            setIsSidebarOpen(true);
            Animated.timing(sidebarWidth, {
                toValue: 300,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    return (
        <View style={styles.safeArea(isDarkMode)}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={styles.safeArea(isDarkMode).backgroundColor} />

            {/* Header */}
            <View style={[styles.header(isDarkMode), { paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 4 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={UNIVERSITY_LOGO}
                        style={{ width: 40, height: 40, marginRight: 12 }}
                        resizeMode="contain"
                        accessibilityLabel="Logo da Universidade Insutec"
                    />
                    <View>
                        <Text style={[styles.cardTitle(isDarkMode), { fontSize: 18, fontWeight: '600' }]}>InsutecPay</Text>
                        <Text style={[styles.cardSubtitle(isDarkMode), { fontSize: 13, marginTop: 2 }]}>
                            Bem-vindo(a), <Text style={{ fontWeight: '700' }}>{firstName}</Text>
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.cardDetailSmall(isDarkMode), { fontSize: 12, marginRight: 12 }]}>{currentTime}</Text>
                    <TouchableOpacity onPress={toggleSidebar} style={{ padding: 8 }}>
                        <FontAwesome name="bars" size={24} color={styles.cardTitle(isDarkMode).color} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sidebar (Menu Lateral) */}
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: sidebarWidth,
                    backgroundColor: styles.safeArea(isDarkMode).backgroundColor,
                    paddingTop: 60, // Ajuste para descer abaixo do header
                    zIndex: 34,
                    elevation: 30,
                    shadowColor: '#000',
                    shadowOffset: { width: -3, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                }}
            >
                <FlatList
                    data={SERVICOS}
                    renderItem={({ item }) => (
                        <ServicoCard servico={item} onPress={() => handleServicoPress(item)} />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
                />
            </Animated.View>

            {/* Overlay */}
            {isSidebarOpen && (
                <TouchableOpacity
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5 }}
                    onPress={toggleSidebar}
                    activeOpacity={1}
                />
            )}

            {/* Conteúdo Principal */}
            <ScrollView contentContainerStyle={styles.contentContainer(isDarkMode)}>
                {/* Status Financeiro */}
                <StatusCard total={dívidaTotal} loading={loadingDívida} nextDueDate={nextDueDate} />

                {/* Ações Rápidas */}
                <View style={styles.sectionContainer(isDarkMode)}>
                    <Text style={styles.sectionTitle(isDarkMode)}>Ações Rápidas</Text>
                    <View style={styles.accessList(isDarkMode)}>
                        {/* Cartão Pagar */}
                        <TouchableOpacity
                            style={[styles.card(isDarkMode), { marginBottom: 8, paddingVertical: 8 }]}
                            onPress={() => router.push('/telas/dividas/DividasScreen')}
                            activeOpacity={0.8}
                            accessibilityLabel="Pagar"
                        >
                            <View style={[styles.header(isDarkMode), { width: 40, height: 40 }]}>
                                <FontAwesome name="money" size={20} color={styles.cardTitle(isDarkMode).color} />
                            </View>
                            <Text style={styles.cardTitle(isDarkMode)}>Pagar</Text>
                        </TouchableOpacity>
                        
                        {/* Cartão Histórico */}
                        <TouchableOpacity
                            style={[styles.card(isDarkMode), { marginBottom: 8, paddingVertical: 8 }]}
                            onPress={() => router.push('/telas/historico/HistoricoScreen')}
                            activeOpacity={0.8}
                            accessibilityLabel="Ver histórico"
                        >
                            <View style={[styles.header(isDarkMode), { width: 40, height: 40 }]}>
                                <FontAwesome name="history" size={20} color={styles.cardTitle(isDarkMode).color} />
                            </View>
                            <Text style={styles.cardTitle(isDarkMode)}>Histórico</Text>
                        </TouchableOpacity>

                        {/* Cartão Notificações */}
                        <TouchableOpacity
                            style={[styles.card(isDarkMode), { paddingVertical: 8 }]}
                            onPress={() => router.push('/telas/notificacoes/NotificacoesScreen')}
                            activeOpacity={0.8}
                            accessibilityLabel="Ver notificações"
                        >
                            <View style={[styles.header(isDarkMode), { width: 40, height: 40 }]}>
                                <FontAwesome name="bell" size={20} color={styles.cardTitle(isDarkMode).color} />
                            </View>
                            <Text style={styles.cardTitle(isDarkMode)}>Notificações</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Transações Recentes */}
                <View style={styles.sectionContainer(isDarkMode)}>
                    <Text style={styles.sectionTitle(isDarkMode)}>Transações Recentes</Text>
                    {loadingTransacoes ? (
                        <ActivityIndicator size="large" color={styles.cardTitle(isDarkMode).color} style={{ marginVertical: 12 }} />
                    ) : transacoesRecentes.length > 0 ? (
                        transacoesRecentes.map((item) => (
                            <RecentTransactionItem key={item.id_transacao_unica} item={item} />
                        ))
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome name="file-text-o" size={32} color={styles.cardSubtitle(isDarkMode).color} style={{ marginBottom: 10 }} />
                            <Text style={styles.cardSubtitle(isDarkMode)}>Nenhuma transação recente encontrada.</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.viewAllButton(isDarkMode)}
                        onPress={() => router.push('/telas/historico/HistoricoScreen')}
                        accessibilityLabel="Ver todas as transações"
                    >
                        <Text style={styles.viewAllText(isDarkMode)}>Ver Todas as Transações</Text>
                    </TouchableOpacity>
                </View>

                {/* Botão Sair (Logout) no rodapé */}
                <TouchableOpacity
                    style={styles.logoutButton(isDarkMode)}
                    onPress={() => {
                        logout();
                        router.replace('/telas/login/LoginScreen');
                    }}
                    activeOpacity={0.8}
                    accessibilityLabel="Sair do aplicativo"
                >
                    <Text style={styles.logoutText(isDarkMode)}>Sair</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* FAB (Floating Action Button) */}
            {dívidaTotal > 0 && (
                <TouchableOpacity
                    style={styles.fab(isDarkMode)}
                    onPress={() => router.push('/telas/dividas/DividasScreen')}
                    activeOpacity={0.8}
                    accessibilityLabel="Pagar"
                >
                    <FontAwesome name="money" size={24} style={styles.fabIcon(isDarkMode)} />
                </TouchableOpacity>
            )}
        </View>
    );
}
