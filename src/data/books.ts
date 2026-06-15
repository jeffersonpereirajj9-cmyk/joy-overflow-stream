export type Category = {
  slug: string;
  name: string;
  description: string;
  gradient: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string; // category slug
  rating: number;
  cover: string; // gradient classes
  accent: string; // accent color for cover overlay
  synopsis: string;
  tags?: ("trending" | "new" | "top" | "favorites")[];
  epubUrl?: string;
};

export const categories: Category[] = [
  { slug: "romance", name: "Romance", description: "Histórias para se apaixonar", gradient: "from-pink-500 via-rose-500 to-pink-700" },
  { slug: "dark-romance", name: "Dark Romance", description: "Paixões intensas e proibidas", gradient: "from-rose-900 via-black to-pink-900" },
  { slug: "mafia-romance", name: "Máfia Romance", description: "Poder, perigo e desejo", gradient: "from-zinc-900 via-red-950 to-black" },
  { slug: "bilionarios", name: "Bilionários", description: "Luxo e romance", gradient: "from-amber-700 via-yellow-600 to-rose-700" },
  { slug: "fantasia-romantica", name: "Fantasia Romântica", description: "Reinos, magia e amor", gradient: "from-purple-700 via-pink-700 to-rose-900" },
];

export const books: Book[] = [
  {
    id: "1", title: "Coração de Veludo", author: "Helena Costa", category: "romance",
    rating: 4.8, cover: "from-pink-400 via-rose-500 to-pink-700", accent: "rose",
    synopsis: "Quando Marina conhece Daniel em uma noite chuvosa em Paris, ela não imagina que aquele encontro mudaria sua vida para sempre. Uma história de amor que atravessa continentes e cura feridas que ela nem sabia que tinha.",
    tags: ["top", "favorites"],
  },
  {
    id: "2", title: "Promessas ao Anoitecer", author: "Sofia Reis", category: "romance",
    rating: 4.6, cover: "from-rose-300 via-pink-500 to-rose-700", accent: "pink",
    synopsis: "Em uma pequena cidade litorânea, dois corações feridos descobrem que segundas chances existem — e que o amor pode florescer onde menos se espera.",
    tags: ["new"],
  },
  {
    id: "3", title: "Sombras do Desejo", author: "Larissa Vale", category: "dark-romance",
    rating: 4.9, cover: "from-rose-950 via-black to-pink-950", accent: "rose",
    synopsis: "Ele é tudo que ela jurou evitar. Ela é a única coisa que ele nunca poderá ter. Uma obsessão que arde lenta e queima por dentro.",
    tags: ["trending", "top"],
  },
  {
    id: "4", title: "Pecado Dourado", author: "Beatriz Lemos", category: "dark-romance",
    rating: 4.7, cover: "from-amber-900 via-rose-950 to-black", accent: "amber",
    synopsis: "Uma noite. Um segredo. Uma escolha impossível entre o certo e tudo o que ela mais deseja.",
    tags: ["trending"],
  },
  {
    id: "5", title: "O Capo", author: "Camila Andrade", category: "mafia-romance",
    rating: 4.8, cover: "from-zinc-800 via-red-900 to-black", accent: "red",
    synopsis: "Salvatore Bianchi controla Nápoles com mão de ferro. Mas quando Aurora entra em sua vida, ele descobre que a única coisa mais perigosa que seus inimigos é o próprio coração.",
    tags: ["top", "trending"],
  },
  {
    id: "6", title: "A Noiva do Don", author: "Marina Rios", category: "mafia-romance",
    rating: 4.5, cover: "from-stone-800 via-rose-950 to-black", accent: "stone",
    synopsis: "Casada à força com o homem mais temido da família, ela jurou ódio eterno. Mas o destino tem outros planos.",
    tags: ["new"],
  },
  {
    id: "7", title: "Bilhão de Razões", author: "Júlia Monteiro", category: "bilionarios",
    rating: 4.4, cover: "from-yellow-500 via-amber-600 to-rose-700", accent: "amber",
    synopsis: "Alexander Sterling tem tudo: jatos, ilhas, impérios. Mas falta a única coisa que dinheiro não compra — e ela acabou de entrar pela porta como sua nova assistente.",
    tags: ["favorites"],
  },
  {
    id: "8", title: "Contrato de Luxo", author: "Renata Alves", category: "bilionarios",
    rating: 4.6, cover: "from-amber-400 via-yellow-600 to-rose-600", accent: "yellow",
    synopsis: "Um acordo de seis meses. Uma fortuna em jogo. E sentimentos que nenhum contrato pode controlar.",
    tags: ["trending", "new"],
  },
  {
    id: "9", title: "Rainha das Sombras", author: "Isabela Cruz", category: "fantasia-romantica",
    rating: 4.9, cover: "from-purple-700 via-pink-700 to-rose-900", accent: "purple",
    synopsis: "Em um reino onde a magia foi proibida, a herdeira do trono descobre que seu maior inimigo é também o único capaz de salvá-la.",
    tags: ["top", "favorites"],
  },
  {
    id: "10", title: "Coroa de Espinhos", author: "Tatiana Lopes", category: "fantasia-romantica",
    rating: 4.7, cover: "from-fuchsia-700 via-rose-700 to-purple-900", accent: "fuchsia",
    synopsis: "Uma profecia. Dois reinos em guerra. E um amor que pode reescrever o destino.",
    tags: ["new", "trending"],
  },
  {
    id: "11", title: "Quando o Inverno Chega", author: "Ana Vitória", category: "romance",
    rating: 4.3, cover: "from-pink-200 via-rose-400 to-pink-600", accent: "pink",
    synopsis: "Uma cabana isolada. Uma tempestade de neve. E o reencontro que nenhum dos dois estava preparado para ter.",
    tags: ["favorites"],
  },
  {
    id: "12", title: "Veneno Doce", author: "Carolina Pires", category: "dark-romance",
    rating: 4.8, cover: "from-rose-800 via-pink-900 to-black", accent: "rose",
    synopsis: "Ele é o vilão da história dela. E ela está prestes a descobrir que adora ser destruída.",
    tags: ["top"],
  },
];

export const sampleChapter = `Capítulo 1 — O Encontro

A chuva caía suave sobre as ruas de paralelepípedos do quarteirão antigo, transformando cada lâmpada amarela em um borrão de ouro líquido. Marina apertou o casaco contra o corpo e acelerou o passo, os saltos ecoando como pequenos batimentos no silêncio da madrugada.

Foi ali, naquele instante exato em que ela virou a esquina, que tudo mudou.

Ele estava parado debaixo do toldo de um café fechado, mãos no bolso, olhar perdido em algum ponto além da rua molhada. Não havia nada de extraordinário em sua aparência — terno escuro, cabelo despenteado pela chuva, uma cicatriz fina no canto do queixo. Mas havia algo nele. Uma gravidade silenciosa, como se o mundo precisasse fazer um pequeno desvio para passar ao seu redor.

Os olhos se encontraram. Por um segundo, dois. Talvez três.

— Você vai se molhar — disse ele, finalmente, com uma voz baixa e levemente rouca, em um português marcado por um sotaque que ela não conseguiu identificar.

Marina percebeu, então, que havia parado de andar.

— Eu já estou molhada — respondeu, surpresa com a firmeza da própria voz.

Ele sorriu. Não foi um sorriso bonito, exatamente. Foi um sorriso de quem aprendeu cedo que sorrir era uma forma de manter as pessoas a uma distância segura. Mas, por algum motivo, naquela noite, com aquela chuva, em frente àquele café fechado, foi o sorriso mais perigoso que Marina já havia visto na vida.

— Aceita um café? — ele perguntou. — Conheço um lugar aberto.

Ela deveria ter dito não. Toda mulher que cresceu na cidade sabia que não se aceita um café às três da manhã de um estranho debaixo de um toldo. Toda mulher sabia.

— Aceito — disse ela.

E foi assim que tudo começou.

Capítulo 2 — Café da Madrugada

O lugar ficava a duas quadras dali, numa rua que Marina nunca havia notado, apesar de morar no bairro há quase cinco anos. Uma porta estreita, pintada de verde-escuro, com uma pequena placa de latão onde se lia apenas: Aberto.

Lá dentro, o tempo parecia ter desistido de passar. Mesas pequenas com toalhas brancas. Um piano de cauda no fundo, silencioso. Um homem mais velho atrás do balcão, secando copos com uma paciência infinita, que apenas inclinou a cabeça ao vê-los entrar.

— Daniel — disse o homem, em tom de saudação.

— Antônio — respondeu ele.

Marina percebeu, então, três coisas ao mesmo tempo. Primeiro, que ele se chamava Daniel. Segundo, que era frequentador habitual daquele lugar. Terceiro, que estava prestes a fazer algo de que talvez se arrependesse pelo resto da vida.

E, naquele momento, ela não se importou.`;