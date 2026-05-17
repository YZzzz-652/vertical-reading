export type LiteraryEvent = {
  id: string;
  book: string;
  author: string;
  region: string;
  character: string;
  class: string;
  gender: string;
  tags: string;
  event: string;
  quote: string;
  position: string;
  year: number | null;
  timeType: string;
  timeNote: string;
  locationName: string;
  city: string;
  lng: number | null;
  lat: number | null;
  locationType: string;
  eventTypes: string[];
};

export type FilterState = {
  classes: Set<string>;
  genders: Set<string>;
  timeTypes: Set<string>;
  locationTypes: Set<string>;
  eventTypes: Set<string>;
};

export type WorldEvent = {
  year: number;
  label: string;
};

export type { HistoricalMapId as MapVersion } from "./historical-maps";

export const CLASS_OPTIONS = [
  "贵族",
  "平民",
  "底层",
  "知识分子",
  "军人",
  "资产阶级",
  "宗教人士",
  "奴隶农奴",
];

export const GENDER_OPTIONS = ["男", "女"];
export const TIME_TYPE_OPTIONS = ["历史锚定", "虚构映射", "创作年代"];
export const LOCATION_TYPE_OPTIONS = ["真实", "虚构映射", "虚构无对应"];
export const EVENT_TYPE_GROUPS = [
  ["死亡", "新生"],
  ["离散", "团聚"],
  ["背叛", "忠诚"],
  ["堕落", "救赎"],
  ["顿悟", "迷茫"],
  ["反抗", "屈服"],
  ["相遇", "决裂"],
  ["萌芽", "幻灭"],
  ["叩问", "笃定"],
] as const;

export const TIMELINE_START = 1700;
export const TIMELINE_END = 1930;

export function makeFilterState(): FilterState {
  return {
    classes: new Set(CLASS_OPTIONS),
    genders: new Set(GENDER_OPTIONS),
    timeTypes: new Set(TIME_TYPE_OPTIONS),
    locationTypes: new Set(LOCATION_TYPE_OPTIONS),
    eventTypes: new Set(),
  };
}

export function classIconSrc(className: string) {
  const safeClassName = CLASS_OPTIONS.includes(className) ? className : "平民";
  return `/icons/${encodeURIComponent(safeClassName)}.png`;
}
