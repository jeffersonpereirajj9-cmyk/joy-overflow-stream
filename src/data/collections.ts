import { coverFor, type Book } from "./books";

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
        cover: coverFor("9") ?? "",
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
        cover: coverFor("10") ?? "",
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
        cover: coverFor("11") ?? "",
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
        cover: coverFor("12") ?? "",
        accent: "rose",
      },
    ],
  },
];

export const findCollection = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);