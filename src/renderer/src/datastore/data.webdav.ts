const { createClient } = require("webdav");

import { DB_PATH_CONFIG } from './data.nedb'


// {username: "powertn@126.com",password: ""}
const createWebDAVClient = (username: string, password: string) => {
    if (username && password) {
        return createClient(
            import.meta.env.VITE_JIANGUOYUN_DAV_URL,
            {
                username: username,
                password: password
            }
        )
    } else {
        return null
    }
}

/**
 *  是否存在根文件夹，没有将创建
 * @param client client
 * @param call 回调
 */
const basicDirIfNonPresentMkdir = (client: any, callback: () => void) => {
    client.exists(DB_PATH_CONFIG.WEBDAV.BASE_PATH).then((exists: Boolean) => {
        if (exists) {
            callback()
        }
        // not present 创建根目录
        else {
            client.createDirectory(DB_PATH_CONFIG.WEBDAV.BASE_PATH).then(() => {
                basicDirIfNonPresentMkdir(client, callback)
            })

        }
    })
}
/**
 * 全量写入文件
 * @param path 文件路径
 * @param data 数据 string 、Buffer
 * @param callback 回调
 */
const putFileContents = (path: string, data: string, callback: (result: Boolean) => void) => {
    const client = createClient()
    basicDirIfNonPresentMkdir(client, () => {
        client.putFileContents(path, data, { overwrite: true }).then((result: Boolean) => {
            callback(result)
        })
    })

}
/**
 * 读取文件
 * @param path 文件路径
 * @param callback 回调
 */
const getFileContents = (path: string, callback: (data: string) => void) => {
    const client = createClient()
    basicDirIfNonPresentMkdir(client, () => {
        client.getFileContents(path, { format: "txt" }).then((result: string) => {
            callback(result)
        })
    })
}
/**
 * 获取文件的统计
    {
    basename: "bookmarks.txt",
    etag: "lok4pXA_zWSWMXiN6MlP4w",
    filename: "/jm-dev/bookmarks.txt",
    lastmod: "Sun 26 Dec 2021 11:50:31 GMT",
    mime: "text/plain",
    size: 114630,
    type: "file",
    flag:"true"
}
 * @param path 
 * @param callback 
 * @returns { flag: false,...result } flag:(false)文件不存在
 */
const getFileStat = (path: string, callback: (stat: {}) => void) => {
    const client = createClient()
    basicDirIfNonPresentMkdir(client, () => {
        client.exists(path).then((exists: Boolean) => {
            // 存在文件 callback(stat)
            if (exists) {
                client.stat(path).then((result: any) => {
                    callback({ flag: true, ...result })
                })
            }
            // 不存在文件 callback({flag:false})
            else {
                callback({ flag: false })
            }
        })

    })
}
/**
 * 压 序列化数据
 * @param data 序列化前的数据
 * @returns 序列化后数据
 */
const serializableDecode = (data: string) => {
    return data
}
/**
 * 解 序列化数据
 * @param data 序列化后数据
 * @returns 序列化前的数据
 */
const serializableEncode = (data: string) => {
    return data
}



export {
    createWebDAVClient,
    basicDirIfNonPresentMkdir,
    putFileContents,
    getFileContents,
    getFileStat,
}

