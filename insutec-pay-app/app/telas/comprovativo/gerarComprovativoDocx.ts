// app/telas/comprovativo/gerarComprovativoDocx.ts
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

// === MODELO OFICIAL FARMHOUSE (100% FIEL) ===
const MODELO_OFICIAL = `
						 
						FarmHouse INSTUTEC
						Instituto Superior Politécnico de Ciencia e tecnología  
						Av. 21 de Janeiro, Monte Bento, Luanda 
						Luanda 
						NIF: 5417148261 

					        -------------------------------------------------------------------------------------------------

					        Fatura/Recibo                                                             FR-A-{{ANO}}/{{NUMERO}} 
								
					        DUPLICADO                                                                       {{DATA}} {{HORA}} 

					        Nome: {{NOME_ESTUDANTE}} 
								
						NIF: {{NIF_ESTUDANTE}} 
								
						Morada: {{MORADA}} 
								
						Est. nº {{NUM_ESTUDANTE}} - Curso: {{CURSO}}                               ({{ANO}}ºAno - {{TURNO}}) 

						Ano Letivo {{ANO_LECTIVO}} 

						Descrição                                                                             Total 

						Qte.          Preço Unit.                   Desc.%   Total 
						--------------------------------------------------------------------------------------------------- 
						{{SERVICO}}                                                                    {{VALOR}}     
								
						{{QT}}       {{VALOR}}                          0                                 0  
								 
						{{TIPOSERVICO}} 
						---------------------------------------------------------------------------------------------------
						Total (Kwanzas)                             {{VALOR}} 

						Taxa%                                         Base                                     IVA     
						---------------------------------------------------------------------------------------------------- 
						0                                          {{VALOR}}                                   0,00 
						---------------------------------------------------------------------------------------------------- 

						*Isento nos termos da alínea I)
						do nº1 do artigo 12.º do CIVA 
						-----------------------------------------------------------------------------------------------------
						Os bens/serviços foram colocados à disposição do adquirente na data do documento. 
						GG2M-Processado por programa validado n.º 412/AGT/2023-SIGA 
						Não serão efetuados reembolsos. 

						Via: Carteira Insutec Pay 
						Data: {{DATA}} 
						Montante: {{VALOR}} Kz 
`.trim();

const OUTPUT_DIR = `${FileSystem.documentDirectory}recibos/`;

// === FUNÇÃO PARA FORMATAR DATA/HORA EM LUANDA (UTC+1) ===
const getLuandaDateTime = () => {
  const now = new Date();
  const luandaOffset = 1 * 60; // UTC+1
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const luandaTime = new Date(utc + luandaOffset * 60000);

  const data = luandaTime.toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const hora = luandaTime.toLocaleTimeString('pt-AO', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { data, hora };
};

export const gerarRecibo = async (dados: any, formato: 'pdf' | 'txt' | 'docx') => {
  try {
    // === DATA E HORA DE LUANDA ===
    const { data, hora } = getLuandaDateTime();

    // === DADOS PRÉ-PREENCHIDOS ===
    const dadosCompletos = {
      ...dados,
      ANO: new Date().getFullYear(),
      ANO_LECTIVO: '2025/2026',
      DATA: dados.DATA || data,
      HORA: dados.HORA || hora,
    };

    // === PREENCHER MODELO ===
    let content = MODELO_OFICIAL;
    Object.keys(dadosCompletos).forEach(key => {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), dadosCompletos[key] || '');
    });

    const fileName = `recibo_${dadosCompletos.NUM_ESTUDANTE || 'aluno'}_${Date.now()}`;
    let fileUri = '';

    // === WEB: DOWNLOAD AUTOMÁTICO ===
    if (Platform.OS === 'web') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.${formato === 'pdf' ? 'txt' : 'txt'}`;
      link.click();
      URL.revokeObjectURL(url);
      Alert.alert('Baixado!', `Recibo ${formato.toUpperCase()} salvo!`);
      return;
    }

    // === MOBILE: CRIAR PASTA ===
    await FileSystem.makeDirectoryAsync(OUTPUT_DIR, { intermediates: true });

    // === GERAR POR FORMATO ===
    if (formato === 'txt' || formato === 'docx') {
      fileUri = `${OUTPUT_DIR}${fileName}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    if (formato === 'pdf') {
      const logoUri = Image.resolveAssetSource(require('../../../assets/images/logo.png')).uri;
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Courier New', monospace; margin: 20px; font-size: 10px; white-space: pre; line-height: 1.3; }
    .logo { width: 60px; height: 60px; display: block; margin: 0 auto 10px; }
    pre { margin: 0; font-family: inherit; }
  </style>
</head>
<body>
  <img src="${logoUri}" class="logo" />
  <pre>${content}</pre>
</body>
</html>`;
      const { uri } = await Print.printToFileAsync({ html });
      fileUri = `${OUTPUT_DIR}${fileName}.pdf`;
      await FileSystem.copyAsync({ from: uri, to: fileUri });
    }

    // === SALVAR NA GALERIA ===
    if (['pdf', 'txt'].includes(formato)) {
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (perm.granted) {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('Insutec Pay', asset, false);
        Alert.alert('Salvo!', `${formato.toUpperCase()} na galeria!`);
      }
    }

    // === COMPARTILHAR ===
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: formato === 'pdf' ? 'application/pdf' : 'text/plain',
        dialogTitle: `Recibo ${formato.toUpperCase()}`,
      });
    } else {
      Alert.alert('Salvo!', `Arquivo: ${fileUri}`);
    }
  } catch (error) {
    console.error('Erro ao gerar recibo:', error);
    Alert.alert('Erro', `Falha ao gerar ${formato.toUpperCase()}.`);
  }
};
