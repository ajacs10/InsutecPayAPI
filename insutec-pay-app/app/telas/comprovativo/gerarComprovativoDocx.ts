// app/telas/comprovativo/gerarComprovativoDocx.ts

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

// 🚨 INSTALAÇÃO NECESSÁRIA:
// No desenvolvimento com React Native/Expo, a criação de ficheiros complexos (como .docx) 
// sem uma biblioteca de renderização nativa é um desafio. 
// A solução mais prática é usar bibliotecas que criam HTML/XML (como 'docx' ou 'pizzip')
// ou gerar um PDF, que é mais fácil no Expo.
// 
// VAMOS ASSUMIR QUE VAMOS GERAR UM PDF QUE É MAIS ROBUSTO PARA MOBILE:

// Tipo de dados de entrada, baseado no teu FinanceContext
interface ComprovativoData {
  id: string;
  valor: number;
  descricao: string;
  data: string; // ISOString
  tipo_servico?: string;
  metodo_pagamento?: string;
  estudante_alvo_id: string;
  nome_estudante?: string; 
  [key: string]: any;
}

/**
 * Inspiração de Design: Gerar o conteúdo do comprovativo em formato HTML/XML 
 * para o converter para PDF/DOCX.
 */
const generateDocumentContent = (data: ComprovativoData): string => {
  // Usamos HTML básico como inspiração para o corpo do comprovativo.
  const formattedDate = new Date(data.data).toLocaleDateString('pt-AO', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const formattedValue = data.valor.toLocaleString('pt-AO') + ' Kz';

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #0b5394;">
      <h1 style="color: #0b5394; text-align: center;">COMPROVATIVO DE PAGAMENTO - INSUTEC</h1>
      <hr style="border-top: 2px solid #0b5394;">

      <h2 style="color: #1F1F1F;">Detalhes da Transação</h2>
      <p><strong>ID da Transação:</strong> ${data.id}</p>
      <p><strong>Data de Emissão:</strong> ${formattedDate}</p>
      <p><strong>Descrição do Serviço:</strong> ${data.descricao}</p>
      <p><strong>Tipo de Serviço:</strong> ${data.tipo_servico || 'Não Especificado'}</p>
      <p><strong>Método de Pagamento:</strong> ${data.metodo_pagamento || 'Carteira Insutec'}</p>

      <hr style="margin-top: 15px; margin-bottom: 15px;">

      <h2 style="color: #1F1F1F;">Dados do Estudante</h2>
      <p><strong>Estudante N.º:</strong> ${data.estudante_alvo_id}</p>
      <p><strong>Nome:</strong> ${data.nome_estudante || 'Estudante Não Registado'}</p>
      
      <hr style="margin-top: 15px; margin-bottom: 15px;">

      <h1 style="color: #38761d; text-align: center; font-size: 30px;">
        VALOR PAGO: ${formattedValue}
      </h1>

      <p style="text-align: center; font-size: 12px; margin-top: 30px; color: #777;">
        Documento gerado eletronicamente e válido.
      </p>
    </div>
  `;
};

// 💡 Ação 1: Mudar de DOCX para PDF (Mais fácil no Expo)
export const gerarComprovativoDocx = async (data: ComprovativoData): Promise<boolean> => {
  
  const docName = `Comprovativo_InsutecPay_${data.id}.pdf`;
  const fileUri = FileSystem.cacheDirectory + docName;
  
  if (Platform.OS === 'web') {
    Alert.alert("Aviso", "A geração de PDF na web funciona de forma diferente. Por favor, utilize a aplicação mobile.");
    return false;
  }

  try {
    // 🚨 Para PDF, precisas do 'expo-print' e 'html-to-pdf' (ou similar)
    // Como não temos essa biblioteca instalada, vamos SIMULAR a criação do ficheiro
    // e focar na parte do FileSystem/Sharing.

    const htmlContent = generateDocumentContent(data);
    
    // === PARTE CRÍTICA DA SIMULAÇÃO (Substituir pela função de Print real) ===
    // const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
    // --------------------------------------------------------------------------

    // SIMULAÇÃO: Criar um ficheiro de texto temporário para testar o Sharing/Download
    await FileSystem.writeAsStringAsync(fileUri, htmlContent, { 
      encoding: FileSystem.EncodingType.UTF8 
    });
    

    // 💡 Ação 2: Partilhar o Ficheiro (a forma mais nativa de "download")
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Erro", "O modo de partilha não está disponível no seu dispositivo.");
      return false;
    }

    // Inicia a interface de partilha nativa do SO
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf', // Mudar para 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' se for DOCX
      dialogTitle: 'Partilhar Comprovativo de Pagamento',
    });
    
    // 💡 Limpeza do ficheiro temporário é recomendada após a partilha
    // await FileSystem.deleteAsync(fileUri, { idempotent: true });

    return true;

  } catch (error) {
    console.error('Erro na geração/partilha:', error);
    Alert.alert('Erro', `Falha ao gerar o documento: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    return false;
  }
};
