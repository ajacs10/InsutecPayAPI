// app/telas/admin/EmolumentosScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { styles, COLORS } from '../../../styles/Admin.styles';

export default function EmolumentosScreen() {
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');

  const handleSave = () => {
    if (!tipo || !valor) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    Alert.alert('Sucesso', `Emolumento "${tipo}" criado com valor ${valor} Kz`);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Emolumento</Text>

      <TextInput
        style={styles.input}
        placeholder="Tipo (ex: Propina, Declaração)"
        value={tipo}
        onChangeText={setTipo}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor em Kz"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
