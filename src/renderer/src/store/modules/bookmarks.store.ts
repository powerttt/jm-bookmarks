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
    },
})
// Need to be used outside the setup
export function useBookmarksStoreWidthOut() {
    return useBookmarksStore(store);
}