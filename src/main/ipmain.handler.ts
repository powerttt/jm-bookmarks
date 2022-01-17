import { ipcMain, BrowserWindow } from 'electron';

import BookmarksManager from './datamanager/bookmarks.manager';

ipcMain.handle(
  'bookmarks-data',
  async (_evnet, methodSign: string, ...args: any) => {
    return (BookmarksManager as any)[methodSign](...args);
  }
);
