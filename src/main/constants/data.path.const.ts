import { app } from 'electron';

const DB_FS_PATH = `${app.getPath('home')}/.jm`;
const WEBDAV_BASE_PATH = import.meta.env.VITE_WEDAV_BASE_DIR;

export const TABLE_NAME = {
  BOOKMARKS: 'bookmarks.txt',
  CONFIGS: 'configs.txt',
};

export const DB_PATH_CONFIG = {
  LOCAL: {
    BASE_PATH: DB_FS_PATH,
    //CONFIG
    CONFIGS: `${DB_FS_PATH}/${TABLE_NAME.CONFIGS}`,
    BOOKMARKS: `${DB_FS_PATH}/${TABLE_NAME.BOOKMARKS}`,
  },
  WEBDAV: {
    BASE_PATH: WEBDAV_BASE_PATH,
    //CONFIG
    CONFIGS: `${WEBDAV_BASE_PATH}/${TABLE_NAME.CONFIGS}`,
    BOOKMARKS: `${WEBDAV_BASE_PATH}/${TABLE_NAME.BOOKMARKS}`,
  },
  TABLE_NAME: {
    BOOKMARKS: 'bookmarks.txt',
    CONFIGS: 'configs.txt',
  },
};
