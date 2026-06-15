import { type Book } from "./books";
import offCampus1 from "@/assets/covers/off-campus-1.jpg";
import offCampus2 from "@/assets/covers/off-campus-2.jpg";
import offCampus3 from "@/assets/covers/off-campus-3.jpg";
import offCampus4 from "@/assets/covers/off-campus-4.jpg";

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
];

export const findCollection = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);