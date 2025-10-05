// app/telas/servicos/Propina.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 💡 Assumindo que você usa os estilos base do seu projeto
// Para simplificar, definirei estilos básicos aqui.
const COLORS = {
    primary: '#39FF14',
    background: '#0D0D0D', 
    textLight: '#FAFAFA',
};

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
    }
});


export default function PropinaScreen() {
    const params = useLocalSearchParams();
    const serviceName = params.servico ? JSON.parse(params.servico as string).nome : 'Propina';

    return (
        <SafeAreaView style={basicStyles.safeArea}>
            <Stack.Screen 
                options={{ 
                    title: serviceName, 
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.primary,
                    headerTitleStyle: { fontWeight: 'bold' }
                }} 
            />
            <View style={basicStyles.container}>
                <Ionicons name="wallet-outline" size={80} color={COLORS.primary} style={{ marginBottom: 20 }}/>
                <Text style={basicStyles.title}>{serviceName}</Text>
                <Text style={basicStyles.subtitle}>
                    Esta é a tela de pagamento e gestão de Propina. Aqui você poderá ver o histórico, o valor pendente e efetuar o pagamento.
                </Text>
                
                <TouchableOpacity style={basicStyles.button} onPress={() => { /* Lógica de pagamento */ }}>
                    <Text style={basicStyles.buttonText}>Ver Pendências</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
