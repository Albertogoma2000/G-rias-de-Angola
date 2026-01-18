import { SlangItem, Category } from './types';

export const CATEGORIES: Category[] = ['Todas', 'Rua', 'Juventude', 'Cotidiano', 'Música', 'Humor', 'Internet'];

export const INITIAL_SLANG_DATA: SlangItem[] = [
  {
    id: '1',
    term: 'Mambo',
    definition: 'Coisa, assunto, situação ou objeto indefinido.',
    example: 'Aquele mambo que me contaste ontem é verdade?',
    category: 'Cotidiano',
    origin: 'Luanda',
    synonyms: ['Cena', 'Assunto']
  },
  {
    id: '2',
    term: 'Bwé',
    definition: 'Muito, em grande quantidade.',
    example: 'A festa estava bwé de fixe!',
    category: 'Juventude',
    origin: 'Geral',
    synonyms: ['Muito', 'Bastante']
  },
  {
    id: '3',
    term: 'Kamba',
    definition: 'Amigo, companheiro próximo.',
    example: 'Esse é meu kamba de infância.',
    category: 'Rua',
    origin: 'Luanda',
    synonyms: ['Amigo', 'Sócio', 'Pitéu']
  },
  {
    id: '4',
    term: 'Bater a bota',
    definition: 'Morrer ou ir embora de algum lugar.',
    example: 'Se não comeres, vais bater a bota.',
    category: 'Rua',
    origin: 'Geral'
  },
  {
    id: '5',
    term: 'Ginguba',
    definition: 'Amendoim.',
    example: 'Compra ali um pacote de ginguba para nós.',
    category: 'Cotidiano',
    origin: 'Nacional'
  },
  {
    id: '6',
    term: 'Pala',
    definition: 'Fome ou Problema/Confusão (depende do contexto).',
    example: 'Estou com uma pala que não aguento.',
    category: 'Rua',
    origin: 'Luanda'
  },
  {
    id: '7',
    term: 'Catanar',
    definition: 'Conseguir algo com esforço ou astúcia; desenrascar.',
    example: 'Vou tentar catanar boleia para o centro.',
    category: 'Juventude',
    origin: 'Sul de Angola'
  },
  {
    id: '8',
    term: 'Dica',
    definition: 'Conversa, assunto, ou conselho.',
    example: 'Qual é a dica de hoje?',
    category: 'Juventude',
    origin: 'Luanda'
  },
  {
    id: '9',
    term: 'Kota',
    definition: 'Pessoa mais velha, respeitável; pai ou mãe.',
    example: 'O meu kota não me deixa sair hoje.',
    category: 'Família',
    origin: 'Geral'
  },
  {
    id: '10',
    term: 'Wé',
    definition: 'Interjeição usada para chamar atenção ou expressar espanto (Tu).',
    example: 'Wé, não faz isso!',
    category: 'Rua',
    origin: 'Luanda'
  },
  {
    id: '11',
    term: 'Nuvens',
    definition: 'Estar distraído, fora da realidade.',
    example: 'Tu vives nas nuvens, acorda para a vida.',
    category: 'Humor',
    origin: 'Geral'
  },
  {
    id: '12',
    term: 'Bangar',
    definition: 'Ostentar, mostrar que tem dinheiro ou estilo, vaidade.',
    example: 'Ele gosta muito de bangar com o carro novo.',
    category: 'Juventude',
    origin: 'Luanda'
  },
  {
    id: '13',
    term: 'Maka',
    definition: 'Problema, confusão, situação difícil.',
    example: 'Houve muita maka no trânsito hoje.',
    category: 'Cotidiano',
    origin: 'Geral (Kimbundu)'
  },
  {
    id: '14',
    term: 'Xuxuado',
    definition: 'Algo de má qualidade, falso ou em mau estado.',
    example: 'Esse telefone que compraste é xuxuado.',
    category: 'Rua',
    origin: 'Luanda'
  },
  {
    id: '15',
    term: 'Arrocha',
    definition: 'Festa animada, dança ou confusão.',
    example: 'O arrocha ontem foi até de manhã.',
    category: 'Música',
    origin: 'Benguela'
  }
];

export const SUBSCRIPTION_PRICE = "$3.00";
export const TRIAL_DAYS = 7;
