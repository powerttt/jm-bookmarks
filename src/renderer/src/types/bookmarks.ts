import type { Nullable, Optional } from './helper'


export type BookMarksItem = {
    url: Nullable<string>,
    logo: Nullable<string>,
    desc: Nullable<string>,
    uuid: string,
    name: Nullable<string>,
    tag: Nullable<string>,
    sortNum: number | 0,
    // 打开时间
    openTime: Nullable<number> | 0,
    // 打开时间
    openCount: Nullable<number> | 0,
    // type 文件夹，书签
    type: BookMarksItemCategory,
    category: BookMarksItemCategory,
    parentUuid: string,
    children: BookMarksItem[],
}
export enum BookMarksItemCategory {
    DIR=0,
    BOOK_MARKS=1,
}