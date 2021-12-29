import { defineStore } from 'pinia';
import { BookMarksItem, BookMarksItemCategory, JmDatastore } from '../../types';
import { bookmarksArray2Tree } from '../../utils'
import { store } from '../';

interface BookmarksStoreState {
    // 树
    bookmarksTree: BookMarksItem;
}

export const useBookmarksStore = defineStore({
    id: "bookmarks-store",
    state: (): any | BookmarksStoreState => ({
        bookmarksTree: []
    }),
    getters: {
        getBookmarksTree(): BookmarksStoreState {
            return this.bookmarksTree
        }
    },
    actions: {

        /**
         * set tree
         * @param tree tree
         */
        async setTree(tree: BookMarksItem[]) {
            this.bookmarksTree = tree
        },
        /**
         * 加载树
         * @param $db nedb
         */
        async loadTree($db: JmDatastore) {
            $db.bookmarks.find({}, (err: any, data = []) => {
                console.log(" bookmarks.store 加载树", data)
                this.bookmarksTree = bookmarksArray2Tree(data)
            })
        },
        /**
         * 修改书签
         * @param $db nedb
         * @param _bookmarksItem 修改的数据对象
         * @param reloadTreeFlag 是否重新加载树
         */
        uploadBookmarks($db: JmDatastore, _bookmarksItem: BookMarksItem, reloadTreeFlag: boolean) {
            // 写入数据库，重新刷新tree
            $db.bookmarks.update(
                { uuid: _bookmarksItem.uuid },
                { $set: _bookmarksItem },
                {},
                (err: any, numReplaced: number) => {
                    console.log("err ", err)
                    console.log("numReplaced", numReplaced)
                    if (numReplaced != 0 && reloadTreeFlag) {
                        // 重新加载树
                        this.localStorage($db)
                    }
                })
        }
    },
})
// Need to be used outside the setup
export function useBookmarksStoreWidthOut() {
    return useBookmarksStore(store);
}