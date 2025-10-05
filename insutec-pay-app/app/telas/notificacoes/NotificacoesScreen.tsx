// telas/notificacoes/NotificacoesScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import { useAuth } from '../../../components/AuthContext';
// 👇️ CORREÇÃO FEITA AQUI: Alterado de '../../src/api/InsutecPayAPI' para '../../../src/api/InsutecPayAPI'
import { getNotificacoes, Notificacao } from '../../../src/api/InsutecPayAPI';
// O caminho de estilos foi corrigido na etapa anterior.
// Em NotificacoesScreen.tsx (Linha 18)
import { styles, COLORS } from '../../../styles/_Notificacoes.styles.ts';

// ====================================================================
// Componente individual para renderizar uma notificação
// ====================================================================

interface NotificacaoItemProps {
    item: Notificacao;
    onMarkAsRead: (id: number) => void;
}

const NotificacaoItem: React.FC<NotificacaoItemProps> = ({ item, onMarkAsRead }) => {
    // 1. Definição Visual por Tipo
    let iconName: keyof typeof FontAwesome.glyphMap;
    let iconColor: string;

    switch (item.tipo) {
        case 'URGENTE':
            iconName = 'exclamation-circle';
            iconColor = COLORS.error;
            break;
        case 'AVISO':
            iconName = 'info-circle';
            iconColor = COLORS.warning;
            break;
        case 'INFORMATIVA':
        default:
            iconName = 'bell-o';
            iconColor = COLORS.primary;
            break;
    }
    
    // 2. Lógica de Ação
    const handleAction = () => {
        if (item.acao_link) {
            // Caminho limpo do Expo Router
            router.push(item.acao_link as any); 
        }
        onMarkAsRead(item.id);
    };

    // 3. Formatação da Data
    const timeAgo = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 24) return `${diffInHours}h atrás`;
        if (diffInHours < 48) return 'Ontem';
        return past.toLocaleDateString('pt-PT');
    };

    return (
        <View style={[
            styles.itemContainer, 
            !item.lida && styles.itemUnread // Estilo diferente se não for lida
        ]}>
            <FontAwesome name={iconName} size={24} color={iconColor} style={styles.itemIcon} />
            
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.titulo}</Text>
                <Text style={styles.itemMessage} numberOfLines={2}>{item.mensagem}</Text>
                <Text style={styles.itemDate}>{timeAgo(item.data)}</Text>
            </View>

            {/* Ação ou Botão de Lida */}
            {item.acao_link ? (
                <TouchableOpacity style={styles.itemActionButton} onPress={handleAction}>
                    <Text style={styles.itemActionButtonText}>Ver</Text>
                    <FontAwesome name="chevron-right" size={12} color={COLORS.primary} style={{ marginLeft: 5 }} />
                </TouchableOpacity>
            ) : !item.lida ? (
                <TouchableOpacity style={styles.itemMarkReadButton} onPress={() => onMarkAsRead(item.id)}>
                    <FontAwesome name="check" size={14} color={COLORS.success} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

// ====================================================================
// Ecrã Principal (Notificações)
// ====================================================================

export default function NotificacoesScreen() {
    const { aluno } = useAuth();
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(false);
    const alunoId = aluno?.id;

    // Função para carregar dados
    const fetchNotificacoes = useCallback(async () => {
        if (!alunoId) return;

        setLoading(true);
        try {
            const result = await getNotificacoes(alunoId);
            setNotificacoes(result);
        } catch (err: any) {
            console.error("Erro ao buscar notificações:", err);
            // Poderíamos mostrar um erro no ecrã, mas mantemos o estado limpo
        } finally {
            setLoading(false);
        }
    }, [alunoId]);
    
    // Função para simular marcar como lida
    const handleMarkAsRead = (id: number) => {
        // Em uma aplicação real, aqui haveria uma chamada à API para marcar
        setNotificacoes(prev => 
            prev.map(n => n.id === id ? { ...n, lida: true } : n)
        );
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotificacoes();
        }, [fetchNotificacoes])
    );
    
    // Filtros de exibição (Exemplo: apenas não lidas)
    const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

    if (loading && notificacoes.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.subText }}>A carregar os seus alertas...</Text>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>
                Caixa de Entrada 
                {notificacoesNaoLidas > 0 && 
                    <Text style={styles.badgeText}> ({notificacoesNaoLidas} Novas)</Text>
                }
            </Text>
            
            <FlatList
                data={notificacoes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NotificacaoItem item={item} onMarkAsRead={handleMarkAsRead} />
                )}
                contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="bell-o" size={60} color={COLORS.subText} />
                        <Text style={styles.emptyText}>Sem novas notificações. Tudo limpo!</Text>
                    </View>
                )}
                // Implementação do pull-to-refresh
                onRefresh={fetchNotificacoes}
                refreshing={loading}
            />
        </View>
    );
}
