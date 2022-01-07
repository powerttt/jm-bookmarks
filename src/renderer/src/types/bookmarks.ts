import type { Nullable } from './helper';
export function getBookMarksItemDefaultValue() {
  return {
    url: '',
    logo: '',
    desc: '',
    uuid: '',
    name: '',
    tags: [],
    sortNum: '',
    oTime: '',
    cTime: '',
    uTime: '',
    openCount: '',
    category: BookMarksItemCategory.BOOK_MARKS,
    parentUuid: '',
    children: [],
  };
}
export type BookMarksItem = {
  url: Nullable<string>;
  logo: Nullable<string>;
  desc: Nullable<string>;
  uuid: string;
  name: Nullable<string>;
  tags: Nullable<string[]>;
  sortNum: string | number | '0';
  // 添加时间 2022-01-01 12:00:15
  cTime: Nullable<string> | '';
  // 添加时间 2022-01-01 12:00:15
  uTime: Nullable<string> | '';
  // 打开时间 2022-01-01 12:00:15
  oTime: Nullable<string> | '';
  // 打开时间
  openCount: Nullable<string | number> | '0';
  // category 文件夹，书签
  category: string | number;
  parentUuid: string;
  children: BookMarksItem[];
};
export enum BookMarksItemCategory {
  DIR = 0,
  BOOK_MARKS = 1,
}
