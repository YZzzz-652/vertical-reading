export type BookCover = {
  title: string;
  author: string;
  year: number;
  region: string;
  zh: string;
  cover: string;
};

export const BOOKS: BookCover[] = [
  {
    title: "Don Quixote",
    author: "Cervantes",
    year: 1605,
    region: "Spain",
    zh: "堂吉诃德",
    cover: "/covers/don-quixote.jpg",
  },
  {
    title: "Alice in Wonderland",
    author: "L. Carroll",
    year: 1865,
    region: "England",
    zh: "爱丽丝梦游仙境",
    cover: "/covers/alice.jpg",
  },
  {
    title: "David Copperfield",
    author: "Dickens",
    year: 1850,
    region: "England",
    zh: "大卫·科波菲尔",
    cover: "/covers/david-copperfield.jpg",
  },
  {
    title: "Les Miserables",
    author: "Hugo",
    year: 1862,
    region: "France",
    zh: "悲惨世界",
    cover: "/covers/les-miserables.jpg",
  },
  {
    title: "The Trial",
    author: "Kafka",
    year: 1925,
    region: "Germany",
    zh: "审判",
    cover: "/covers/the-trial.jpg",
  },
  {
    title: "Dream of the Red Chamber",
    author: "Cao Xueqin",
    year: 1791,
    region: "Asia",
    zh: "红楼梦",
    cover: "/covers/red-chamber.jpg",
  },
];
