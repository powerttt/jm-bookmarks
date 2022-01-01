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
         * @param list list
         */
        setArray2Tree(list: BookMarksItem[]) {
            if (!list || list.length === 0) {
                this.bookmarksTree = []
            } else {
                this.bookmarksTree = bookmarksArray2Tree(list)
            }
        },
        /**
         * set tree
         * @param tree tree
         */
        setTree(tree: BookMarksItem[]) {
            this.bookmarksTree = tree
        },
    },
})
// Need to be used outside the setup
export function useBookmarksStoreWidthOut() {
    return useBookmarksStore(store);
}