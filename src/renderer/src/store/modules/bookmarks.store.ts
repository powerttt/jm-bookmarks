import { defineStore } from 'pinia';
import { store } from '../';
import { BookMarksItem } from '../../types';
import { bookmarksArray2Tree } from '../../utils';

interface BookmarksStoreState {
  // 树
  bookmarksTree: BookMarksItem;
}

export const useBookmarksStore = defineStore({
  id: 'bookmarks-store',
  state: (): any | BookmarksStoreState => ({
    bookmarksTree: [],
  }),
  getters: {
    getBookmarksTree(): BookmarksStoreState {
      return this.bookmarksTree;
    },
  },
  actions: {
    /**
     * set tree
     * @param list list
     */
    setArray2Tree(list: BookMarksItem[], concat: false) {
      if (!list || list.length === 0) {
        this.bookmarksTree = [];
      } else {
        const array2Tree = bookmarksArray2Tree(list) || [];
        if (concat) {
          this.bookmarksTree = this.bookmarksTree.concat(array2Tree);
        } else {
          this.bookmarksTree = array2Tree;
        }
      }
    },
  },
});
// Need to be used outside the setup
export function useBookmarksStoreWidthOut() {
  return useBookmarksStore(store);
}
