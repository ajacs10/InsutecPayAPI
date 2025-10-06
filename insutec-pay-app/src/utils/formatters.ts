// src/utils/formatters.ts

/**
 * Formata um número para a moeda de Angola (AOA - Kwanza).
 * @param amount O valor numérico a ser formatado.
 */
export const formatCurrency = (amount: number | string): string => {
    let numericAmount: number;

    // Converte string para número se necessário
    if (typeof amount === 'string') {
        numericAmount = parseFloat(amount);
    } else if (typeof amount === 'number') {
        numericAmount = amount;
    } else {
        numericAmount = 0;
    }

    // Se o valor for NaN (resultante de uma string inválida), devolve 0,00
    if (isNaN(numericAmount) || numericAmount === null || numericAmount === undefined) {
        numericAmount = 0;
    }

    // Formata o valor com duas casas decimais e substitui o símbolo da moeda por "Kz"
    // Nota: O locale 'pt-AO' já deve produzir o símbolo 'Kz', mas a sua solução .replace('Kz', '').trim() + 'Kz' garante que fique no final, como pretendido.
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA', // Código da Moeda Kwanza
        minimumFractionDigits: 2,
    }).format(numericAmount)
      .replace('AOA', '').replace('Kz', '').trim() + ' Kz'; 
    // Ajustado para garantir que "Kz" fique separado por espaço no final.
};


/**
 * Formata uma string de data ISO 8601 (ou objeto Date) para um formato legível, incluindo hora.
 * Ex: 06/Out/2025 17:35:00
 * @param dateString A string de data (e hora) ou objeto Date.
 */
export const formatDate = (dateString: string | Date): string => {
    if (!dateString) {
        return 'Data Indisponível';
    }

    let dateObject: Date;

    if (typeof dateString === 'string') {
        dateObject = new Date(dateString);
    } else {
        dateObject = dateString;
    }

    if (isNaN(dateObject.getTime())) {
        return 'Data Inválida';
    }

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Usa formato 24 horas
        timeZone: 'Africa/Luanda', // Garante o fuso horário correto (Angola)
    };

    // Usa 'pt-PT' ou 'pt-AO' para formato português, mas 'pt-AO' pode ser mais específico
    const formattedDate = new Intl.DateTimeFormat('pt-AO', options).format(dateObject);

    // Ajusta o formato para remover vírgulas e garantir barras se necessário
    return formattedDate.replace(/, /g, ' ').replace(/:/g, ':');
};
