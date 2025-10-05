// src/constants/services.ts

// Interface para serviços
export interface Servico {
    id: string;
    nome: string;
    descricao: string; // Adicionado: Essencial para a exibição nos cards de destaque
    valor?: number;
    pendente: boolean;
    icon: string;
    anos?: { [key: number]: number };
    isSpecial?: boolean; // Para serviços como 'Perfil' e 'Logout'
}

// Lista Mestra de serviços disponíveis (Inclui todos os serviços e itens de menu)
export const SERVICOS: Servico[] = [
    { id: '1', nome: 'Propina', descricao: 'Pagamento de Mensalidades', pendente: false, icon: 'money', anos: { 1: 45550, 2: 45550, 3: 45550, 4: 45550 } },
    { id: '2', nome: 'Reconfirmação de Matrícula', descricao: 'Confirmação Anual de Vaga', valor: 15000, pendente: false, icon: 'check-circle' },
    { id: '3', nome: 'Folha de Prova', descricao: 'Pedido de Folha de Exame', valor: 200, pendente: false, icon: 'file-text' },
    { id: '4', nome: 'Declaração com Notas', descricao: 'Documento Oficial com Histórico', valor: 15000, pendente: false, icon: 'file-text-o' },
    { id: '5', nome: 'Declaração sem Notas', descricao: 'Documento Oficial de Inscrição', valor: 10000, pendente: false, icon: 'file' },
    // Serviços Especiais (não são pagáveis, mas são itens de menu/navegação)
    { id: '6', nome: 'Perfil', descricao: 'Ver e editar o seu perfil', pendente: false, icon: 'user', isSpecial: true },
    { id: '7', nome: 'Logout', descricao: 'Terminar a sessão', pendente: false, icon: 'sign-out', isSpecial: true },
    { id: '8', nome: 'Pagar Agora', descricao: 'Ver todas as dívidas pendentes', pendente: false, icon: 'shopping-cart', isSpecial: true },
];

// 1. Serviços Pagáveis (exclui "Perfil" e "Logout")
export const SERVICOS_PAGAVEIS: Servico[] = SERVICOS.filter(servico => !servico.isSpecial);

// 2. Serviços em Destaque (Cards na Home - limitar a 3 ou 4)
// 💥 CORREÇÃO PRINCIPAL: Exportar esta constante
export const SERVICOS_DESTAQUE: Servico[] = [
    SERVICOS.find(s => s.nome === 'Propina')!,
    SERVICOS.find(s => s.nome === 'Declaração com Notas')!,
    SERVICOS.find(s => s.nome === 'Reconfirmação de Matrícula')!,
];

// 3. Itens do Menu Lateral (inclui Pagáveis + Especiais)
// 💥 CORREÇÃO: Exportar esta constante
export const SERVICOS_MENU_LATERAL: Servico[] = SERVICOS.filter(s => s.nome !== 'Pagar Agora'); 
// O 'Pagar Agora' é geralmente um botão separado, não um item do menu lateral

// Nota: Adicionei a propriedade 'descricao' à interface e aos objetos, pois é usada no ServiceCard do HomeScreen.
