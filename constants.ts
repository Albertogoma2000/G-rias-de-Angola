import { SlangItem, Category } from './types';

export const CATEGORIES: Category[] = ['Todas', 'Saudações', 'Rua', 'Juventude', 'Cotidiano', 'Família', 'Música', 'Humor', 'Internet'];

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
  },
  {
    id: '16',
    term: 'Kamba diami',
    definition: 'Meu amigo, meu companheiro.',
    example: 'Aquele é o meu kamba diami de longa data.',
    category: 'Rua',
    origin: 'Luanda',
    synonyms: ['Meu amigo']
  },
  {
    id: '17',
    term: 'Mô mambo',
    definition: 'Minha coisa, meu objeto ou meu assunto pessoal.',
    example: 'Não mexe aí, esse é mô mambo.',
    category: 'Cotidiano'
  },
  {
    id: '18',
    term: 'Mô kit',
    definition: 'Minha namorada, companheira ou "bae".',
    example: 'Vou sair com mô kit hoje à noite.',
    category: 'Juventude'
  },
  {
    id: '19',
    term: 'Cubico',
    definition: 'Casa, lar, residência.',
    example: 'Vamos lá no meu cubico relaxar um pouco.',
    category: 'Cotidiano',
    synonyms: ['Mbangi', 'Casa']
  },
  {
    id: '20',
    term: 'Tuchu',
    definition: 'Quarto, aposento privado.',
    example: 'Vou ficar no tuchu a descansar.',
    category: 'Cotidiano',
    synonyms: ['Palé']
  },
  {
    id: '21',
    term: 'Tropúkuna',
    definition: 'Amigo muito íntimo, comparsa ou parceiro de confiança.',
    example: 'Nós somos tropúkuna desde o tempo da escola.',
    category: 'Rua'
  },
  {
    id: '22',
    term: 'Mamoite',
    definition: 'Mãe, progenitora.',
    example: 'A minha mamoite cozinha o melhor funge da banda.',
    category: 'Família'
  },
  {
    id: '23',
    term: 'Papoite',
    definition: 'Pai, progenitor.',
    example: 'O meu papoite é um kota com muita visão.',
    category: 'Família'
  },
  {
    id: '24',
    term: 'Ndenge',
    definition: 'Criança, menino mais novo ou o irmão caçula.',
    example: 'Aquele ndenge é muito esperto.',
    category: 'Família',
    synonyms: ['Cassule', 'Puto']
  },
  {
    id: '25',
    term: 'Pops',
    definition: 'Carro, veículo automóvel.',
    example: 'O pops dele está sempre a brilhar.',
    category: 'Cotidiano',
    origin: 'Juventude'
  },
  {
    id: '26',
    term: 'Ngunga',
    definition: 'Igreja, local de culto.',
    example: 'Domingo é dia de ir na ngunga.',
    category: 'Cotidiano',
    synonyms: ['Nguelé']
  },
  {
    id: '27',
    term: 'Buchu',
    definition: 'Pão.',
    example: 'Traz um buchu quente da padaria para o pequeno almoço.',
    category: 'Cotidiano'
  },
  {
    id: '28',
    term: 'Yoga',
    definition: 'Alguém grande, importante ou de grande estatura física.',
    example: 'Aquele moço é um yoga, tem que se respeitar.',
    category: 'Rua'
  },
  {
    id: '29',
    term: 'Mambo gato',
    definition: 'Coisa ruim, situação desagradável ou azar.',
    example: 'O exame foi um mambo gato, muito difícil.',
    category: 'Cotidiano'
  },
  {
    id: '30',
    term: 'Bibi',
    definition: 'Camisa, vestuário superior.',
    example: 'Gostei da tua bibi nova, onde compraste?',
    category: 'Cotidiano'
  },
  {
    id: '31',
    term: 'Pila Doce',
    definition: 'Calção muito curto, estilo "hot pants".',
    example: 'Ela está a bangar com aquele pila doce.',
    category: 'Juventude',
    synonyms: ['Parti Cama']
  },
  {
    id: '32',
    term: 'Bater na Rocha',
    definition: 'Fracassar, não ter sucesso, encontrar um obstáculo insuperável.',
    example: 'Tentei falar com ela, mas bati na rocha.',
    category: 'Rua'
  },
  {
    id: '33',
    term: 'As Tropas',
    definition: 'Olá Pessoal / E aí malta.',
    example: 'As tropas, como é que vocês estão?',
    category: 'Saudações',
    origin: 'Geral'
  },
  {
    id: '34',
    term: 'Do Babulo',
    definition: 'Tranquilo? / Está tudo bem?',
    example: 'E aí kamba, do babulo ou houve maka?',
    category: 'Saudações',
    origin: 'Geral'
  },
  {
    id: '35',
    term: 'É como',
    definition: 'Como estais / Como vai isso?',
    example: 'É como, meu kota? Tudo em ordem?',
    category: 'Saudações',
    origin: 'Geral'
  },
  {
    id: '36',
    term: 'Mekie',
    definition: 'Como vai / Olá / Qual é a dica?',
    example: 'Mekie, kamba! Há quanto tempo!',
    category: 'Saudações',
    origin: 'Geral',
    synonyms: ['Mekie-mé']
  }
];

export const SUBSCRIPTION_PRICE = "$5.00";
export const TRIAL_DAYS = 7;