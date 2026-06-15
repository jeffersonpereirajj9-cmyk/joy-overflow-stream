import { type Book } from "./books";
import offCampus1 from "@/assets/covers/off-campus-1.jpg";
import offCampus2 from "@/assets/covers/off-campus-2.jpg";
import offCampus3 from "@/assets/covers/off-campus-3.jpg";
import offCampus4 from "@/assets/covers/off-campus-4.jpg";
import ch1 from "@/assets/covers/ch-1.jpg";
import ch2 from "@/assets/covers/ch-2.jpg";
import ch3 from "@/assets/covers/ch-3.jpg";
import ch4 from "@/assets/covers/ch-4.jpg";
import ch5 from "@/assets/covers/ch-5.jpg";
import ch6 from "@/assets/covers/ch-6.jpg";
import ch7 from "@/assets/covers/ch-7.jpg";
import ch8 from "@/assets/covers/ch-8.jpg";

export type Collection = {
  slug: string;
  title: string;
  author: string;
  description: string;
  books: Book[];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "off-campus",
    title: "Série Off-Campus",
    author: "Elle Kennedy",
    description:
      "Amores improváveis no mundo do hóquei universitário — quatro romances cheios de tensão, humor e química.",
    books: [
      {
        id: "off-campus-1",
        title: "O Acordo",
        author: "Elle Kennedy",
        category: "romance",
        rating: 4.7,
        synopsis:
          "Hannah Wells nunca imaginou fechar um acordo com Garrett Graham, o astro do hóquei — aulas em troca de ciúmes calculados.",
        tags: ["new"],
        cover: offCampus1,
        accent: "rose",
      },
      {
        id: "off-campus-2",
        title: "O Erro",
        author: "Elle Kennedy",
        category: "romance",
        rating: 4.6,
        synopsis:
          "John Logan está prestes a se formar quando comete o pior erro possível: se apaixonar pela namorada do melhor amigo.",
        tags: ["new"],
        cover: offCampus2,
        accent: "rose",
      },
      {
        id: "off-campus-3",
        title: "O Jogo",
        author: "Elle Kennedy",
        category: "romance",
        rating: 4.7,
        synopsis:
          "Allie Hayes precisa de distração depois do término — Dean Di Laurentis é o tipo errado de cara, mas o jogo já começou.",
        tags: ["trending"],
        cover: offCampus3,
        accent: "rose",
      },
      {
        id: "off-campus-4",
        title: "A Conquista",
        author: "Elle Kennedy",
        category: "romance",
        rating: 4.8,
        synopsis:
          "Sabrina James não tem tempo para romance — até que Tucker, o tranquilão do time de hóquei, decide conquistá-la.",
        tags: ["top"],
        cover: offCampus4,
        accent: "rose",
      },
    ],
  },
  {
    slug: "colleen-hoover",
    title: "Destaques de Colleen Hoover",
    author: "Colleen Hoover",
    description:
      "Os romances mais marcantes da autora best-seller — histórias intensas sobre amor, dor e recomeços.",
    books: [
      {
        id: "ch-1",
        title: "É Assim que Acaba",
        author: "Colleen Hoover",
        category: "romance",
        rating: 4.8,
        synopsis:
          "Lily nunca achou que precisaria escolher entre o homem que ama e o passado que a moldou — até reencontrar Atlas.",
        tags: ["top"],
        cover: ch1,
        accent: "rose",
      },
      {
        id: "ch-2",
        title: "É Assim que Começa",
        author: "Colleen Hoover",
        category: "romance",
        rating: 4.7,
        synopsis:
          "A sequência de É Assim que Acaba: Lily e Atlas finalmente têm a chance de viver a história que sempre mereceram.",
        tags: ["new"],
        cover: ch2,
        accent: "rose",
      },
      {
        id: "ch-3",
        title: "Amor Cruel",
        author: "Colleen Hoover",
        category: "dark-romance",
        rating: 4.6,
        synopsis:
          "Tate e Miles fecham um pacto: sem perguntas sobre o passado, sem promessas sobre o futuro. Até o amor mudar as regras.",
        tags: ["trending"],
        cover: ch3,
        accent: "rose",
      },
      {
        id: "ch-4",
        title: "O Lado Feio do Amor",
        author: "Colleen Hoover",
        category: "romance",
        rating: 4.5,
        synopsis:
          "Tate quer começar do zero. Miles quer esquecer. Mas o que sentem um pelo outro não se deixa esquecer tão fácil.",
        tags: ["favorites"],
        cover: ch4,
        accent: "rose",
      },
      {
        id: "ch-5",
        title: "Todas as Suas (Im)Perfeições",
        author: "Colleen Hoover",
        category: "romance",
        rating: 4.7,
        synopsis:
          "Quinn e Graham viveram um casamento perfeito por fora — agora precisam decidir se conseguem se salvar por dentro.",
        tags: ["favorites"],
        cover: ch5,
        accent: "rose",
      },
      {
        id: "ch-6",
        title: "Talvez Um Dia",
        author: "Colleen Hoover",
        category: "romance",
        rating: 4.6,
        synopsis:
          "Sydney e Ridge compartilham a música — e descobrem que algumas conexões nascem antes mesmo do primeiro acorde.",
        tags: ["new"],
        cover: ch6,
        accent: "rose",
      },
      {
        id: "ch-7",
        title: "Talvez Agora",
        author: "Colleen Hoover",
        category: "romance",
        rating: 4.5,
        synopsis:
          "A continuação de Talvez Um Dia: Maggie precisa decidir se está pronta para abrir o coração outra vez.",
        tags: ["trending"],
        cover: ch7,
        accent: "rose",
      },
      {
        id: "ch-8",
        title: "Tudo Me Lembra de Ti",
        author: "Colleen Hoover",
        category: "romance",
        rating: 4.7,
        synopsis:
          "Morgan e Clara vivem em mundos opostos — mãe e filha tentando entender o amor, a perda e o que ficou para trás.",
        tags: ["top"],
        cover: ch8,
        accent: "rose",
      },
    ],
  },
];

export const findCollection = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);