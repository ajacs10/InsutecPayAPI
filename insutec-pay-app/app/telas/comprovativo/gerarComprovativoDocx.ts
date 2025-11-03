// app/telas/comprovativo/gerarComprovativoDocx.ts
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

const OUTPUT_DIR = `${FileSystem.documentDirectory}recibos/`;

export const gerarRecibo = async (dados: any, formato: 'docx' | 'pdf' | 'txt') => {
  try {
    await FileSystem.makeDirectoryAsync(OUTPUT_DIR, { intermediates: true });

    const fileName = `recibo_${dados.NUM_ESTUDANTE || 'aluno'}_${Date.now()}`;
    let fileUri = '';

    // 1. Ler e preencher o modelo .docx (base para todos os formatos)
    const modeloUri = require('../../../assets/recibo.docx');
    const tempDocx = `${FileSystem.documentDirectory}temp.docx`;
    await FileSystem.copyAsync({ from: modeloUri, to: tempDocx });

    let content = await FileSystem.readAsStringAsync(tempDocx, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Substituir todos os {{campos}}
    Object.keys(dados).forEach(key => {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), dados[key] || '');
    });

    // 2. Gerar por formato
    if (formato === 'docx') {
      fileUri = `${OUTPUT_DIR}${fileName}.docx`;
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
    body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; line-height: 1.4; }
    .header { text-align: center; margin-bottom: 15px; }
    .logo { width: 60px; height: 60px; }
    .divider { border-top: 1px solid #000; margin: 8px 0; }
    .info { margin: 5px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    .table th, .table td { border: 1px solid #000; padding: 4px; text-align: left; font-size: 10px; }
    .table th { background-color: #f0f0f0; }
    .footer { font-size: 9px; margin-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUri}" class="logo" />
    <div><strong>FarmHouse INSTUTEC</strong></div>
    <div>Instituto Superior Politécnico de Ciencia e tecnología</div>
    <div>Av. 21 de Janeiro, Monte Bento, Luanda • Luanda • NIF: 5417148261</div>
  </div>

  <div style="text-align: center;">
    <strong>Fatura/Recibo</strong> FR-A-${dados.ANO}/${dados.NUMERO}<br>
    <strong>DUPLICADO</strong> ${dados.DATA} ${dados.HORA}
  </div>

  <div class="info">
    <div><strong>Nome:</strong> ${dados.NOME_ESTUDANTE}</div>
    <div><strong>NIF:</strong> ${dados.NIF_ESTUDANTE}</div>
    <div><strong>Morada:</strong> ${dados.MORADA}</div>
    <div><strong>Est. nº:</strong> ${dados.NUM_ESTUDANTE} - Curso: ${dados.CURSO} (${dados.ANO}ºAno - ${dados.TURNO})</div>
  </div>

  <div style="text-align: center; margin: 10px 0;"><strong>Ano Letivo ${dados.ANO_LECTIVO}</strong></div>

  <div style="display: flex; justify-content: space-between;">
    <div><strong>Descrição</strong></div>
    <div><strong>Total</strong></div>
  </div>

  <table class="table">
    <tr>
      <th>Qte.</th>
      <th>Preço Unit.</th>
      <th>Desc.%</th>
      <th>Total</th>
    </tr>
    <tr>
      <td>${dados.QT}</td>
      <td>${dados.VALOR}</td>
      <td>0</td>
      <td>${dados.VALOR}</td>
    </tr>
  </table>

  <div>${dados.SERVICO}</div>
  <div>${dados.TIPOSERVICO}</div>

  <div style="text-align: right; margin: 10px 0;">
    <strong>Total (Kwanzas): ${dados.VALOR}</strong>
  </div>

  <table class="table">
    <tr><th>Taxa%</th><th>Base</th><th>IVA</th></tr>
    <tr><td>0</td><td>${dados.VALOR}</td><td>0,00</td></tr>
  </table>

  <div class="info" style="font-size: 9px; margin-top: 15px;">
    *Isento nos termos da alínea I)<br>
    do nº1 do artigo 12.º do CIVA
  </div>

  <div class="info" style="font-size: 9px;">
    Os bens/serviços foram colocados à disposição do adquirente na data do documento.<br>
    GG2M-Processado por programa validado n.º 412/AGT/2023-SIGA<br>
    Não serão efetuados reembolsos.
  </div>

  <div class="info" style="margin-top: 10px;">
    <div><strong>Via:</strong> Carteira Insutec Pay</div>
    <div><strong>Data:</strong> ${dados.DATA}</div>
    <div><strong>Montante:</strong> ${dados.VALOR} Kz</div>
  </div>

</body>
</html>`;
      const { uri } = await Print.printToFileAsync({ html });
      fileUri = `${OUTPUT_DIR}${fileName}.pdf`;
      await FileSystem.copyAsync({ from: uri, to: fileUri });
    }

    if (formato === 'txt') {
      content = `
FarmHouse INSTUTEC - RECIBO
================================================================================
Fatura/Recibo: FR-A-${dados.ANO}/${dados.NUMERO}      DUPLICADO: ${dados.DATA} ${dados.HORA}
--------------------------------------------------------------------------------
Nome: ${dados.NOME_ESTUDANTE}
NIF: ${dados.NIF_ESTUDANTE}
Morada: ${dados.MORADA}
Est. nº: ${dados.NUM_ESTUDANTE} - Curso: ${dados.CURSO} (${dados.ANO}ºAno - ${dados.TURNO})
Ano Letivo: ${dados.ANO_LECTIVO}
--------------------------------------------------------------------------------
Descrição: ${dados.SERVICO} (${dados.TIPOSERVICO})
Qte: ${dados.QT}    Preço Unit: ${dados.VALOR}    Desc: 0    Total: ${dados.VALOR}
--------------------------------------------------------------------------------
Total (Kwanzas): ${dados.VALOR}
Taxa%: 0    Base: ${dados.VALOR}    IVA: 0,00
--------------------------------------------------------------------------------
*Isento nos termos da alínea I) do nº1 do artigo 12.º do CIVA
Processado por programa validado n.º 412/AGT/2023-SIGA
--------------------------------------------------------------------------------
Via: Carteira Insutec Pay    Data: ${dados.DATA}    Montante: ${dados.VALOR} Kz
      `.trim();
      fileUri = `${OUTPUT_DIR}${fileName}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    // 3. Salvar na galeria (iOS/Android)
    if (Platform.OS !== 'web' && ['pdf', 'docx'].includes(formato)) {
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (perm.granted) {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('Insutec Pay', asset, false);
        Alert.alert('Salvo!', `${formato.toUpperCase()} salvo na galeria!`);
      }
    }

    // 4. Compartilhar
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType:
          formato === 'pdf'
            ? 'application/pdf'
            : formato === 'docx'
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : 'text/plain',
        dialogTitle: `Recibo ${formato.toUpperCase()}`,
      });
    } else {
      Alert.alert('Salvo!', `Arquivo: ${fileUri}`);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Erro', `Falha ao gerar ${formato.toUpperCase()}.`);
  }
};
