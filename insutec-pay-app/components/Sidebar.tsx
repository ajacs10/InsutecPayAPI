// app/telas/servicos/sidebar.tsx
import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    Platform 
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Definição de Cores
const COLORS = {
    primary: '#39FF14',
    background: '#0D0D0D', 
    textLight: '#FAFAFA',
    menuBackground: '#2A2A2A',
    menuItemBorder: '#444444',
};

// --- ESTILOS BÁSICOS ---
const basicStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Estilos do Menu Flutuante
    menuContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 50 : 0,
        right: 10,
        width: 200,
        backgroundColor: COLORS.menuBackground,
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 100,
    },
    menuItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.menuItemBorder,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        color: COLORS.textLight,
        fontSize: 16,
        marginLeft: 10,
    },
    lastMenuItem: {
        borderBottomWidth: 0,
    },
});

// --- COMPONENTE DO MENU DE OPÇÕES ---
interface MenuOptionProps {
    onClose: () => void;
}

const MenuOptions: React.FC<MenuOptionProps> = ({ onClose }) => {
    // CORREÇÃO: Todos os hooks primeiro
    const handleAction = useCallback((action: string) => {
        console.log(`Ação: ${action}`);
        onClose();
        
        // Aqui você adicionaria a lógica de navegação real
        switch (action) {
            case 'Histórico':
                // router.push('/telas/historico/ServicoHistorico');
                break;
            case 'Regulamento':
                // router.push('/telas/regulamento/RegulamentoScreen');
                break;
            case 'Ajuda':
                // router.push('/telas/ajuda/AjudaScreen');
                break;
            default:
                break;
        }
    }, [onClose]);

    // AGORA o return
    return (
        <View style={basicStyles.menuContainer}>
            <TouchableOpacity 
                style={basicStyles.menuItem} 
                onPress={() => handleAction('Histórico')}
            >
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={basicStyles.menuItemText}>Ver Histórico</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={basicStyles.menuItem} 
                onPress={() => handleAction('Regulamento')}
            >
                <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
                <Text style={basicStyles.menuItemText}>Ver Regulamento</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[basicStyles.menuItem, basicStyles.lastMenuItem]} 
                onPress={() => handleAction('Ajuda')}
            >
                <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
                <Text style={basicStyles.menuItemText}>Ajuda</Text>
            </TouchableOpacity>
        </View>
    );
};

// --- TELA PRINCIPAL ---
export default function PropinaScreen() {
    // CORREÇÃO: TODOS OS HOOKS PRIMEIRO - SEM RETORNOS ANTECIPADOS
    const params = useLocalSearchParams();
    const [showMenu, setShowMenu] = useState(false);

    // Processar parâmetros após hooks
    const serviceName = params.servico ? JSON.parse(params.servico as string).nome : 'Propina';

    const toggleMenu = useCallback(() => {
        setShowMenu(prev => !prev);
    }, []);

    // HeaderRight component
    const HeaderRight = useCallback(() => (
        <TouchableOpacity onPress={toggleMenu} style={{ paddingHorizontal: 10 }}>
            <Ionicons 
                name="ellipsis-vertical" 
                size={24} 
                color={COLORS.primary} 
            />
        </TouchableOpacity>
    ), [toggleMenu]);

    // AGORA o return principal
    return (
        <SafeAreaView style={basicStyles.safeArea}>
            <Stack.Screen 
                options={{ 
                    title: serviceName, 
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.primary,
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerRight: HeaderRight,
                }} 
            />
            
            {/* Menu condicional - SEMPRE depois de todos os hooks */}
            {showMenu && <MenuOptions onClose={toggleMenu} />}

            <View style={basicStyles.container}>
                <Ionicons name="wallet-outline" size={80} color={COLORS.primary} style={{ marginBottom: 20 }}/>
                <Text style={basicStyles.title}>{serviceName}</Text>
                <Text style={basicStyles.subtitle}>
                    Esta é a tela de pagamento e gestão de Propina. Aqui você poderá ver o histórico, o valor pendente e efetuar o pagamento.
                </Text>
                
                <TouchableOpacity style={basicStyles.button} onPress={() => { 
                    console.log('Ver pendências clicado');
                    // Lógica de pagamento 
                }}>
                    <Text style={basicStyles.buttonText}>Ver Pendências</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
