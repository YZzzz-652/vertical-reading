export type IconSource = {
  label: string;
  artist: string;
  titleZh: string;
  titleOriginal: string;
  year: string;
  country: string;
  imagePath: string;
  aspectRatio: number;
};

export const CLASS_ICON_SOURCES: IconSource[] = [
  {
    label: "贵族",
    artist: "Élisabeth Louise Vigée Le Brun",
    titleZh: "穿薄纱裙的玛丽·安托瓦内特",
    titleOriginal: "Marie Antoinette en gaulle",
    year: "1783",
    country: "法国",
    imagePath: "/icon-sources/贵族.jpg",
    aspectRatio: 2500 / 3188,
  },
  {
    label: "平民",
    artist: "Jean-François Millet",
    titleZh: "拾穗者",
    titleOriginal: "Des glaneuses",
    year: "1857",
    country: "法国",
    imagePath: "/icon-sources/平民.jpg",
    aspectRatio: 5354 / 4006,
  },
  {
    label: "底层",
    artist: "Gustave Courbet",
    titleZh: "采石工人",
    titleOriginal: "Les Casseurs de pierres",
    year: "1849",
    country: "法国",
    imagePath: "/icon-sources/底层.jpg",
    aspectRatio: 1315 / 800,
  },
  {
    label: "知识分子",
    artist: "Constance Marie Charpentier",
    titleZh: "乔治·桑肖像",
    titleOriginal: "Portrait de George Sand",
    year: "约1830年代",
    country: "法国",
    imagePath: "/icon-sources/知识分子.jpg",
    aspectRatio: 3500 / 4511,
  },
  {
    label: "军人",
    artist: "Jacques-Louis David",
    titleZh: "拿破仑越过阿尔卑斯山",
    titleOriginal: "Bonaparte franchissant le Grand-Saint-Bernard",
    year: "1801",
    country: "法国",
    imagePath: "/icon-sources/军人.jpg",
    aspectRatio: 3394 / 4134,
  },
  {
    label: "资产阶级",
    artist: "Hans Holbein the Younger",
    titleZh: "商人乔治·吉泽",
    titleOriginal: "Georg Gisze, a German Merchant in London",
    year: "1532",
    country: "德国",
    imagePath: "/icon-sources/资产阶级.jpg",
    aspectRatio: 4096 / 4674,
  },
  {
    label: "宗教人士",
    artist: "Diego Velázquez",
    titleZh: "英诺森十世肖像",
    titleOriginal: "Ritratto di Innocenzo X",
    year: "1650",
    country: "西班牙",
    imagePath: "/icon-sources/宗教人士.jpg",
    aspectRatio: 491 / 600,
  },
  {
    label: "奴隶农奴",
    artist: "Ilya Repin",
    titleZh: "伏尔加河的纤夫",
    titleOriginal: "Бурлаки на Волге",
    year: "1870–1873",
    country: "俄国",
    imagePath: "/icon-sources/奴隶农奴.jpg",
    aspectRatio: 4586 / 2120,
  },
];

export const GENDER_ICON_SOURCES: IconSource[] = [
  {
    label: "女性角色",
    artist: "古希腊雕塑",
    titleZh: "雅典娜",
    titleOriginal: "Athena",
    year: "年代不详",
    country: "古希腊",
    imagePath: "/icon-sources/女性角色.jpg",
    aspectRatio: 1019 / 2638,
  },
  {
    label: "男性角色",
    artist: "Michelangelo Buonarroti",
    titleZh: "大卫",
    titleOriginal: "David",
    year: "1501–1504",
    country: "意大利",
    imagePath: "/icon-sources/男性角色.jpg",
    aspectRatio: 3840 / 5626,
  },
];
