export function getBookmarksDefaultValue() {
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
    category: BookmarksCategory.BOOK_MARKS,
    parentUuid: '',
    children: [],
  };
}
export type Bookmarks = {
  url: string;
  logo: string;
  desc: string;
  uuid: string;
  name: string;
  tags: string[];
  // 搜索权重
  searchRate: number;
  sortNum: string | number | '0';
  // 添加时间 2022-01-01 12:00:15
  cTime: string | '';
  // 添加时间 2022-01-01 12:00:15
  uTime: string | '';
  // 打开时间 2022-01-01 12:00:15
  oTime: string | '';
  // 打开时间
  openCount: string | number | '0';
  // category 文件夹，书签
  category: string | number;
  parentUuid: string;
  children: Bookmarks[];
};
export enum BookmarksCategory {
  DIR = '0',
  BOOK_MARKS = '1',
}
