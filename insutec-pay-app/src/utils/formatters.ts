/**
 * Formata um número para a moeda de Angola (AOA - Kwanza).
 * @param amount O valor numérico a ser formatado.
 */
export const formatCurrency = (amount: number): string => {
    // Se o valor for nulo ou indefinido, devolve 0,00
    if (amount === null || amount === undefined) {
        amount = 0;
    }

    // Formata o valor com duas casas decimais e substitui o símbolo da moeda por "Kz"
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA', // Código da Moeda Kwanza
        minimumFractionDigits: 2,
    }).format(amount).replace('Kz', '').trim() + 'Kz';
};
