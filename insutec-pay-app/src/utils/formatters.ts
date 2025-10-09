// src/utils/formatters.ts

/**
 * Formata um número para a moeda de Angola (AOA - Kwanza).
 * O formato pretendido é '1.234.567,89 Kz'.
 * @param amount O valor numérico ou string a ser formatado.
 */
export const formatCurrency = (amount: number | string | null | undefined): string => {
    let numericAmount: number;

    // 1. Trata null, undefined, ou strings inválidas, definindo o valor como 0
    if (amount === null || amount === undefined || (typeof amount === 'string' && isNaN(parseFloat(amount)))) {
        numericAmount = 0;
    } else if (typeof amount === 'string') {
        numericAmount = parseFloat(amount);
    } else {
        numericAmount = amount;
    }

    // Se o valor for NaN após a conversão, volta para 0
    if (isNaN(numericAmount)) {
        numericAmount = 0;
    }

    // 2. Formatação Intl.NumberFormat
    const formatted = new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA', // Kwanza Angolano
        minimumFractionDigits: 2,
    }).format(numericAmount);

    // 3. Ajuste de Símbolo (Remove o símbolo nativo 'AOA' e adiciona 'Kz' com espaço no final)
    // A formatação 'pt-AO' muitas vezes já usa 'Kz'. Vamos simplificar e garantir ' Kz' no final.
    const currencySymbol = 'Kz';
    const amountWithoutSymbol = formatted
        .replace(currencySymbol, '') // Remove o Kz que possa ter vindo
        .replace('AOA', '') // Remove AOA se veio por defeito
        .trim();

    // 4. Concatena o valor e o símbolo com um espaço.
    return `${amountWithoutSymbol} ${currencySymbol}`;
};


/**
 * Formata uma string de data ISO 8601 (ou objeto Date) para um formato legível, incluindo hora.
 * Ex: 06/Out/2025 17:35:00
 * @param dateString A string de data (e hora) ou objeto Date.
 */
export const formatDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) {
        return 'Data Indisponível';
    }

    let dateObject: Date;

    if (typeof dateString === 'string') {
        // Tentativa de parsing. O construtor do Date lida bem com a maioria das strings ISO
        dateObject = new Date(dateString);
    } else {
        dateObject = dateString;
    }

    if (isNaN(dateObject.getTime())) {
        return 'Data Inválida';
    }

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short', // Ex: Jan, Fev, Mar, Out
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Usa formato 24 horas
        timeZone: 'Africa/Luanda', // Fuso horário de Angola
    };

    const formattedDate = new Intl.DateTimeFormat('pt-AO', options).format(dateObject);

    // Ajusta o formato para o padrão "DD/Mês/AAAA HH:MM:SS" (sem vírgulas ou AM/PM)
    // Ex: "09/out/2025, 12:33:00" (saída pt-AO) -> "09/out/2025 12:33:00"
    return formattedDate
        .replace(/, /g, ' ') // Remove vírgula e espaço após a data (se existir)
        .replace(/\s+/g, ' ') // Remove espaços duplicados
        .trim();
};
