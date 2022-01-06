import type { App, Plugin } from 'vue';
import path from 'path'
const { app } = require('@electron/remote')

// const nedb = require('nedb');
const Datastore = require('nedb')

const DB_FS_PATH = `${app.getPath('home')}/.jm`

const WEBDAV_BASE_PATH = `${import.meta.env.VITE_WEDAV_BASE_DIR}`

export const TABLE_NAME = {
    BOOKMARKS: "bookmarks.txt",
    CONFIGS: "configs.txt",
}

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

    }

}
console.log(DB_PATH_CONFIG)


/**
 * 实例化连接对象
 * https://www.w3cschool.cn/nedbintro/nedbintro-jtcy27mn.html
 * @param databasename 数据库名称
 * @returns 数据库实例
 */
const initDatastore = (tablename: string): any => {
    const _path = path.join(DB_FS_PATH, `${tablename}`)
    const datastore = new Datastore(_path);
    datastore.loadDatabase((err: any) => {
        if (err) {
            console.error(`nedb loadDatabase err  ${_path}`, err)
        }
    });
    return datastore
}

export const install = (vue_app: App, options: Plugin) => {
    vue_app.config.globalProperties.$db = {
        bookmarks: initDatastore(TABLE_NAME.BOOKMARKS),
        configs: initDatastore(TABLE_NAME.CONFIGS),
    }
}


