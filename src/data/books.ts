import aBabaEpub from "@/assets/epubs/a-baba.epub.asset.json";
import autobiografiaEpub from "@/assets/epubs/autobiografia.epub.asset.json";
import amigaGenialEpub from "@/assets/epubs/amiga-genial.epub.asset.json";
import cemDiasEpub from "@/assets/epubs/100-dias.epub.asset.json";
import compatibilidadeEpub from "@/assets/epubs/988-compatibilidade.epub.asset.json";
import hipoteseEpub from "@/assets/epubs/hipotese-do-amor.epub.asset.json";
import guardaCostasEpub from "@/assets/epubs/guarda-costas.epub.asset.json";
import florestaEpub from "@/assets/epubs/floresta-pigmeus.epub.asset.json";
import filhaCubanaEpub from "@/assets/epubs/filha-cubana.epub.asset.json";
import destruidoraEpub from "@/assets/epubs/destruidora-casamentos.epub.asset.json";
import aCoroaEpub from "@/assets/epubs/a-coroa.epub.asset.json";
import condessaEpub from "@/assets/epubs/condessa-ensanguentada.epub.asset.json";
import cincoPassosEpub from "@/assets/epubs/cinco-passos.epub.asset.json";
import casaEspiritosEpub from "@/assets/epubs/casa-espiritos.epub.asset.json";
import aCarneEpub from "@/assets/epubs/a-carne.epub.asset.json";

import amadaImortalMobi from "@/assets/mobis/amada-imortal.mobi.asset.json";
import amanhecerMobi from "@/assets/mobis/amanhecer.mobi.asset.json";
import amanteEternoMobi from "@/assets/mobis/amante-eterno.mobi.asset.json";
import amanteFantasiaMobi from "@/assets/mobis/amante-fantasia.mobi.asset.json";
import amanteLibertadaMobi from "@/assets/mobis/amante-libertada.mobi.asset.json";
import amanteLibertoMobi from "@/assets/mobis/amante-liberto.mobi.asset.json";
import amanteSombrioMobi from "@/assets/mobis/amante-sombrio.mobi.asset.json";
import amorCruelMobi from "@/assets/mobis/amor-cruel.mobi.asset.json";

import driveCatalogJson from "./drive-catalog.json";

import cover1 from "@/assets/covers/1.jpg";
import cover2 from "@/assets/covers/2.jpg";
import cover3 from "@/assets/covers/3.jpg";
import cover4 from "@/assets/covers/4.jpg";
import cover5 from "@/assets/covers/5.jpg";
import cover6 from "@/assets/covers/6.jpg";
import cover7 from "@/assets/covers/7.jpg";
import cover8 from "@/assets/covers/8.jpg";
import cover9 from "@/assets/covers/9.jpg";
import cover10 from "@/assets/covers/10.jpg";
import cover11 from "@/assets/covers/11.jpg";
import cover12 from "@/assets/covers/12.jpg";
import cover13 from "@/assets/covers/13.jpg";
import cover14 from "@/assets/covers/14.jpg";
import cover15 from "@/assets/covers/15.jpg";
import cover16 from "@/assets/covers/16.jpg";
import cover17 from "@/assets/covers/17.jpg";
import cover18 from "@/assets/covers/18.jpg";
import cover19 from "@/assets/covers/19.jpg";
import cover20 from "@/assets/covers/20.jpg";
import cover21 from "@/assets/covers/21.jpg";
import cover22 from "@/assets/covers/22.jpg";
import cover23 from "@/assets/covers/23.jpg";
import cover24 from "@/assets/covers/24.jpg";
import cover25 from "@/assets/covers/25.jpg";
import cover26 from "@/assets/covers/26.jpg";
import cover27 from "@/assets/covers/27.jpg";

const COVERS: Record<string, string> = {
  "1": cover1, "2": cover2, "3": cover3, "4": cover4, "5": cover5,
  "6": cover6, "7": cover7, "8": cover8, "9": cover9, "10": cover10,
  "11": cover11, "12": cover12, "13": cover13, "14": cover14, "15": cover15,
  "16": cover16, "17": cover17,
  "18": cover18, "19": cover19, "20": cover20, "21": cover21, "22": cover22,
  "23": cover23, "24": cover24, "25": cover25, "26": cover26, "27": cover27,
};

export const coverFor = (id: string): string | undefined => COVERS[id];

export type Category = {
  slug: string;
  name: string;
  description: string;
  gradient: string;
  image?: string;
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
  mobiUrl?: string;
};

const CATEGORY_VISUALS: Record<string, { cover: string; accent: string }> = {
  romance: { cover: "from-pink-400 via-rose-500 to-pink-700", accent: "rose" },
  "dark-romance": { cover: "from-rose-950 via-black to-pink-950", accent: "rose" },
  "mafia-romance": { cover: "from-zinc-900 via-red-950 to-black", accent: "red" },
  bilionarios: { cover: "from-amber-700 via-yellow-600 to-rose-700", accent: "amber" },
  "fantasia-romantica": { cover: "from-purple-700 via-pink-700 to-rose-900", accent: "purple" },
};

type DriveCatalogEntry = {
  id: string;
  name: string;
  size: number;
  title: string;
  author: string;
  category: string;
  synopsis: string;
  rating: number;
  tags: ("trending" | "new" | "top" | "favorites")[];
};

const driveBooks: Book[] = (driveCatalogJson as DriveCatalogEntry[]).map((b) => {
  const visuals = CATEGORY_VISUALS[b.category] ?? CATEGORY_VISUALS.romance;
  return {
    id: `drv-${b.id}`,
    title: b.title,
    author: b.author,
    category: b.category,
    rating: b.rating,
    cover: visuals.cover,
    accent: visuals.accent,
    synopsis: b.synopsis,
    tags: b.tags,
    mobiUrl: `/api/drive/${b.id}?name=${encodeURIComponent(b.name)}`,
  };
});

import romanceImage from "@/assets/categories/romance.png.asset.json";

export const categories: Category[] = [
  { slug: "romance", name: "Romance", description: "Histórias para se apaixonar", gradient: "from-pink-500 via-rose-500 to-pink-700", image: romanceImage.url },
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
  {
    id: "13", title: "A Babá", author: "Lana Ferguson", category: "romance",
    rating: 4.7, cover: "from-rose-400 via-pink-600 to-rose-900", accent: "rose",
    synopsis: "Quando Cassie aceita o emprego dos sonhos como babá em uma mansão de luxo, ela não imagina que o pai solteiro encantador será também sua maior tentação — e seu maior segredo.",
    tags: ["new", "trending"],
    epubUrl: aBabaEpub.url,
  },
  {
    id: "14", title: "A Autobiografia da Minha Mãe", author: "Jamaica Kincaid", category: "romance",
    rating: 4.5, cover: "from-pink-300 via-rose-500 to-pink-800", accent: "pink",
    synopsis: "A história intensa e poética de Xuela Claudette Richardson, uma mulher caribenha que reconstrói a própria identidade a partir das ausências, dos desejos e das paixões que moldaram sua vida.",
    tags: ["favorites"],
    epubUrl: autobiografiaEpub.url,
  },
  {
    id: "15", title: "A Amiga Genial", author: "Elena Ferrante", category: "romance",
    rating: 4.9, cover: "from-rose-500 via-pink-700 to-rose-950", accent: "rose",
    synopsis: "Em uma Nápoles do pós-guerra, Lila e Elena constroem uma amizade que atravessa décadas — uma história sobre amor, rivalidade e a força inexplicável que une duas mulheres para sempre.",
    tags: ["top", "favorites"],
    epubUrl: amigaGenialEpub.url,
  },
  {
    id: "16", title: "100 Dias Depois do Fim", author: "V.O. Allyn", category: "romance",
    rating: 4.6, cover: "from-pink-400 via-rose-600 to-pink-900", accent: "rose",
    synopsis: "Cem dias depois do fim do mundo como ela conhecia, Liv descobre que sobreviver é só o começo — e que o amor pode florescer mesmo entre as ruínas.",
    tags: ["new"],
    epubUrl: cemDiasEpub.url,
  },
  {
    id: "17", title: "98% de Compatibilidade", author: "Lyla Mars", category: "romance",
    rating: 4.8, cover: "from-rose-300 via-pink-500 to-rose-800", accent: "pink",
    synopsis: "Um algoritmo promete encontrar o par perfeito com 98% de compatibilidade. Mas e se o destino tiver outros planos — e o homem certo for justamente quem o sistema rejeitou?",
    tags: ["trending", "favorites"],
    epubUrl: compatibilidadeEpub.url,
  },
  {
    id: "18", title: "A Hipótese do Amor", author: "Ali Hazelwood", category: "romance",
    rating: 4.8, cover: "from-pink-300 via-rose-400 to-pink-600", accent: "pink",
    synopsis: "Olive Smith, uma PhD em biologia, finge namorar o temido professor Adam Carlsen para convencer a melhor amiga de que está bem. O problema? O fingimento pode estar deixando de ser fingimento.",
    tags: ["trending", "top"],
    epubUrl: hipoteseEpub.url,
  },
  {
    id: "19", title: "A Guarda-Costas", author: "Katherine Center", category: "romance",
    rating: 4.6, cover: "from-pink-600 via-rose-700 to-black", accent: "pink",
    synopsis: "Hannah é uma guarda-costas durona contratada para proteger um ator famoso. A missão fingir ser sua namorada deveria ser fácil — até o coração dela esquecer que tudo é só fachada.",
    tags: ["new"],
    epubUrl: guardaCostasEpub.url,
  },
  {
    id: "20", title: "A Floresta dos Pigmeus", author: "Isabel Allende", category: "romance",
    rating: 4.5, cover: "from-emerald-700 via-rose-700 to-rose-950", accent: "rose",
    synopsis: "Alex e Nadia embarcam em uma aventura pela floresta africana, onde descobrem segredos ancestrais, mistérios mágicos e uma amizade que floresce em meio ao perigo.",
    tags: ["favorites"],
    epubUrl: florestaEpub.url,
  },
  {
    id: "21", title: "A Filha Cubana", author: "Soraya Lane", category: "romance",
    rating: 4.6, cover: "from-amber-400 via-rose-500 to-rose-800", accent: "amber",
    synopsis: "Em meio aos perfumes e sons de Havana, uma jovem descobre o diário da avó e, com ele, uma história de amor proibido que mudará para sempre a forma como entende suas próprias raízes.",
    tags: ["new", "favorites"],
    epubUrl: filhaCubanaEpub.url,
  },
  {
    id: "22", title: "A Destruidora de Casamentos", author: "Mia Sosa", category: "romance",
    rating: 4.7, cover: "from-pink-200 via-rose-400 to-pink-600", accent: "pink",
    synopsis: "Wedding planner perfeccionista, Carolina arruína sem querer o casamento do próprio cunhado. Para consertar o estrago, terá que trabalhar lado a lado com o homem que mais detesta — e que talvez seja exatamente quem ela precisa.",
    tags: ["trending"],
    epubUrl: destruidoraEpub.url,
  },
  {
    id: "23", title: "A Coroa", author: "Kiera Cass", category: "romance",
    rating: 4.7, cover: "from-pink-300 via-pink-500 to-rose-700", accent: "pink",
    synopsis: "A princesa Eadlyn precisa escolher entre seis pretendentes para suceder ao trono. Mas governar um reino e governar o próprio coração podem ser duas coisas impossíveis ao mesmo tempo.",
    tags: ["top", "favorites"],
    epubUrl: aCoroaEpub.url,
  },
  {
    id: "24", title: "A Condessa Ensanguentada", author: "Valentine Penrose", category: "romance",
    rating: 4.3, cover: "from-rose-900 via-red-950 to-black", accent: "red",
    synopsis: "A história real e perturbadora de Erzsébet Báthory, a condessa húngara que se tornou lenda — entre o desejo de eternidade, o poder e os limites tênues entre amor e crueldade.",
    tags: ["new"],
    epubUrl: condessaEpub.url,
  },
  {
    id: "25", title: "A Cinco Passos de Você", author: "Rachael Lippincott", category: "romance",
    rating: 4.9, cover: "from-pink-300 via-rose-400 to-pink-500", accent: "pink",
    synopsis: "Stella e Will se conhecem no hospital e se apaixonam — só que precisam manter, no mínimo, cinco passos de distância um do outro. Uma história sobre o amor que desafia até as regras mais impossíveis.",
    tags: ["top", "trending", "favorites"],
    epubUrl: cincoPassosEpub.url,
  },
  {
    id: "26", title: "A Casa dos Espíritos", author: "Isabel Allende", category: "romance",
    rating: 4.9, cover: "from-amber-700 via-rose-700 to-rose-950", accent: "amber",
    synopsis: "Três gerações da família Trueba vivem amores intensos, paixões proibidas e encontros sobrenaturais em uma casa onde os espíritos do passado se recusam a partir.",
    tags: ["top", "favorites"],
    epubUrl: casaEspiritosEpub.url,
  },
  {
    id: "27", title: "A Carne", author: "Rosa Montero", category: "romance",
    rating: 4.4, cover: "from-rose-700 via-red-800 to-rose-950", accent: "red",
    synopsis: "Soledad contrata um acompanhante para vingar-se do amante casado que a abandonou. O que era para ser uma noite torna-se uma obsessão que a fará repensar tudo o que sabia sobre desejo e identidade.",
    tags: ["trending"],
    epubUrl: aCarneEpub.url,
  },
  {
    id: "28", title: "Amante Sombrio", author: "J. R. Ward", category: "dark-romance",
    rating: 4.7, cover: "from-zinc-900 via-rose-950 to-black", accent: "rose",
    synopsis: "Wrath, o último vampiro de sangue puro, jurou nunca amar uma humana. Até conhecer Beth — e descobrir que algumas regras existem só para serem quebradas.",
    tags: ["top", "trending"],
    mobiUrl: amanteSombrioMobi.url,
  },
  {
    id: "29", title: "Amante Eterno", author: "J. R. Ward", category: "dark-romance",
    rating: 4.6, cover: "from-stone-900 via-rose-900 to-black", accent: "rose",
    synopsis: "Rhage carrega uma maldição que ameaça destruí-lo. Mary é a única capaz de acalmar a fera — mesmo sabendo que talvez não tenha tempo suficiente.",
    tags: ["favorites"],
    mobiUrl: amanteEternoMobi.url,
  },
  {
    id: "30", title: "Amante Liberto", author: "J. R. Ward", category: "dark-romance",
    rating: 4.6, cover: "from-rose-900 via-stone-900 to-black", accent: "rose",
    synopsis: "Mais um capítulo da Irmandade da Adaga Negra: paixão, lealdade e batalhas em meio à noite eterna.",
    tags: ["new"],
    mobiUrl: amanteLibertoMobi.url,
  },
  {
    id: "31", title: "Amante Libertada", author: "J. R. Ward", category: "dark-romance",
    rating: 4.5, cover: "from-rose-950 via-zinc-900 to-black", accent: "rose",
    synopsis: "Um amor proibido entre mundos opostos coloca à prova tudo o que a Irmandade jurou proteger.",
    mobiUrl: amanteLibertadaMobi.url,
  },
  {
    id: "32", title: "Amanhecer", author: "Stephenie Meyer", category: "fantasia-romantica",
    rating: 4.8, cover: "from-rose-300 via-pink-500 to-rose-900", accent: "rose",
    synopsis: "Bella e Edward selam seu destino em uma união que mudará para sempre o equilíbrio entre vampiros, lobos e humanos.",
    tags: ["top", "favorites"],
    mobiUrl: amanhecerMobi.url,
  },
  {
    id: "33", title: "Amada Imortal", author: "Cate Tiernan", category: "fantasia-romantica",
    rating: 4.4, cover: "from-purple-800 via-rose-800 to-black", accent: "purple",
    synopsis: "Nastasya viveu por séculos sem se importar com nada. Quando o passado a alcança, ela precisa decidir o que está disposta a sacrificar pelo amor.",
    tags: ["new"],
    mobiUrl: amadaImortalMobi.url,
  },
  {
    id: "34", title: "Amor Cruel", author: "Reyes Monforte", category: "dark-romance",
    rating: 4.5, cover: "from-rose-800 via-red-900 to-black", accent: "red",
    synopsis: "Inspirado em fatos reais, a história de uma mulher que descobre que o homem por quem se apaixonou esconde segredos capazes de destruí-la.",
    tags: ["trending"],
    mobiUrl: amorCruelMobi.url,
  },
  {
    id: "35", title: "Amante da Fantasia", author: "Sherrilyn Kenyon", category: "fantasia-romantica",
    rating: 4.5, cover: "from-fuchsia-800 via-rose-800 to-purple-950", accent: "fuchsia",
    synopsis: "Um deus do sono. Uma mortal que ousou sonhar com o impossível. E uma paixão que pode incendiar dois mundos.",
    tags: ["favorites"],
    mobiUrl: amanteFantasiaMobi.url,
  },
  ...driveBooks,
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