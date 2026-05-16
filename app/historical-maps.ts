export type HistoricalMapId = "modern" | "1500" | "1650" | "1750" | "1880" | "1950";

export type HistoricalMapOption = {
  id: HistoricalMapId;
  labelZh: string;
  labelEn: string;
  yearRange: string;
  layers: string[];
};

export const HISTORICAL_MAPS: HistoricalMapOption[] = [
  {
    id: "modern",
    labelZh: "现代",
    labelEn: "Today",
    yearRange: "—",
    layers: [],
  },
  {
    id: "1500",
    labelZh: "16世纪初",
    labelEn: "Early 1500s",
    yearRange: "1492–1624",
    layers: [
      "https://wmts.oldmapsonline.org/tiles/72f8b3eb-7169-4b33-aff6-0fb3afbdef4f/2026-04-09T18:36:36.245839Z/tiles.json?key=lrETGYmRr771z5PFmpIU",
    ],
  },
  {
    id: "1650",
    labelZh: "17世纪",
    labelEn: "17th Century",
    yearRange: "1625–1724",
    layers: [
      "https://wmts.oldmapsonline.org/tiles/618a6e7a-59f5-481d-9715-3c37a084b7f8/2026-04-03T02:12:57.065262Z/tiles.json?key=lrETGYmRr771z5PFmpIU",
      "https://wmts.oldmapsonline.org/tiles/d6ab10ec-da87-4cc3-891c-62723e7f2674/2025-12-26T17:13:12.449408Z/tiles.json?key=lrETGYmRr771z5PFmpIU",
      "https://wmts.oldmapsonline.org/tiles/33c0f301-edaa-425d-908d-25a55d64d12d/2025-12-26T12:36:56.303401Z/tiles.json?key=lrETGYmRr771z5PFmpIU",
      "https://wmts.oldmapsonline.org/tiles/9841fa00-8a32-42b2-9afa-7e9df1965e2e/2025-12-23T17:09:03.413826Z/tiles.json?key=lrETGYmRr771z5PFmpIU",
    ],
  },
  {
    id: "1750",
    labelZh: "18世纪",
    labelEn: "18th Century",
    yearRange: "1725–1829",
    layers: [
      "https://wmts.oldmapsonline.org/tiles/3bd35d0e-95ca-4769-bbad-64c0e4074537/2026-01-27T19:24:22.659136Z/tiles.json?key=lrETGYmRr771z5PFmpIU",
    ],
  },
  {
    id: "1880",
    labelZh: "19世纪",
    labelEn: "19th Century",
    yearRange: "1830–1924",
    layers: [
      "https://wmts.oldmapsonline.org/tiles/5bbe5794-7ebb-4c0a-82b9-bce9d564d875/2026-02-26T10:05:35.775070Z/tiles.json?key=lrETGYmRr771z5PFmpIU",
    ],
  },
  {
    id: "1950",
    labelZh: "20世纪",
    labelEn: "20th Century",
    yearRange: "1925–1999",
    layers: [
      "https://wmts.oldmapsonline.org/tiles/9c5e9838-5e2e-5c1a-be48-785d09b3bed3/2017-02-20T14:25:19.132722Z/tiles.json?key=lrETGYmRr771z5PFmpIU",
    ],
  },
];

export function historicalMapById(id: HistoricalMapId) {
  return HISTORICAL_MAPS.find((option) => option.id === id) ?? HISTORICAL_MAPS[0];
}
