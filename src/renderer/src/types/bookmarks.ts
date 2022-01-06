import type { Nullable } from './helper'
export function getBookMarksItemDefaultValue() {
    return {
        url: "",
        logo: "",
        desc: "",
        uuid: "",
        name: "",
        tags: [],
        sortNum: '0',
        openTime: '0',
        openCount: '0',
        category: BookMarksItemCategory.BOOK_MARKS,
        parentUuid: "",
        children: [],
    }
}
export type BookMarksItem = {
    url: Nullable<string>,
    logo: Nullable<string>,
    desc: Nullable<string>,
    uuid: string,
    name: Nullable<string>,
    tags: Nullable<string[]>,
    sortNum: string | number | '0',
    // 打开时间
    openTime: Nullable<string | number> | '0',
    // 打开时间
    openCount: Nullable<string | number> | '0',
    // category 文件夹，书签
    category: string | number,
    parentUuid: string,
    children: BookMarksItem[],
    // 组件需要
    showEditBtn: false,
}
export enum BookMarksItemCategory {
    DIR = 0,
    BOOK_MARKS = 1,
}