import type { App, Plugin } from 'vue';
import { install as dataNedbInstall, TABLE_NAME, DB_PATH_CONFIG } from './data.nedb'
import {
    createWebDAVClient,
    basicDirIfNonPresentMkdir,
    putFileContents,
    getFileContents,
    getFileStat,
} from './data.webdav';
export {
    TABLE_NAME,
    DB_PATH_CONFIG,

    createWebDAVClient,
    basicDirIfNonPresentMkdir,
    putFileContents,
    getFileContents,
    getFileStat,
}
// 项目启动的时候，加载文件数据
// 暂时，将webDav 设置为手动模式

export default {
    install: (vue_app: App, options: Plugin) => {
        dataNedbInstall(vue_app, options)
    }
}