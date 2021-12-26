<template>
    <h1>WEBDAV TEST</h1>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted } from 'vue';
import { DB_PATH_CONFIG } from '../../datastore'
import type { JmDatastore } from '../../types'
import fs from 'fs'
const { proxy } = getCurrentInstance()
const { createClient } = require("webdav");
const mainBaseDir = import.meta.env.VITE_JIANGUOYUN_DAV_BASE_DIR
console.log(import.meta.env)
// return
// /dav/ 做代理，开发会跨域，需要使用生产环境和本地环境

onMounted(() => {
    // let stream = fs.createReadStream(DB_PATH_CONFIG.LOCAL.BOOKMARKS);
    // console.log(stream)
    // test2()
    // getUploadUrl()
    // 
    // is OK
    // putFileContents()
    // is OK
    // getFileContents()
    // getStat()
    // getLocalData()
    //initCloudData()
    // getNotExistsFileContents()
})
// return Error: Invalid response: 409 Conflict 读取一个不存在的文件夹中的文件
const getNotExistsFileContents = () => {
    const client = getWebDAVClient()
    client.getFileContents("jm-test/jm.txt", { format: "text" }).then((result: any) => {
        console.log("getNotExistsFileContents result", result)
    })
}
const initCloudData = async () => {

    const client = getWebDAVClient()
    await client.createDirectory(DB_PATH_CONFIG.WEBDAV.BASE_PATH+"/jm3").then(res=>{
        console.log("res ")
    })
    
    // 一定要先判断是否有文件夹，有文件夹，再判断是否有文件
    // client.exists(DB_PATH_CONFIG.WEBDAV.BOOKMARKS).then((remoteStats: any) => {
    //     console.log("remote stats", remoteStats)
    //     // 直接对未创建的文件进行写入
    //     putFileContents()

    // })


}
const getLocalData = () => {
    let db: JmDatastore = proxy.$db
    db.bookmarks.find({}, (err, data) => {
        console.log(data)
    })
}
const getStat = () => {
    // getStat()
    const client = getWebDAVClient()
    // basename: "bookmarks.txt"
    // etag: "lok4pXA_zWSWMXiN6MlP4w"
    // filename: "/jm-dev/bookmarks.txt"
    // lastmod: "Sun, 26 Dec 2021 11:50:31 GMT"
    // mime: "text/plain"
    // size: 114630
    // type: "file"
    client.stat(DB_PATH_CONFIG.WEBDAV.CONFIGS).then((result: any) => {
        console.log("getStat result", result)
    })
}
const getQuota = () => {
    // const client = getWebDAVClient()

}
const getFileContents = () => {
    const client = getWebDAVClient()
    client.getFileContents(DB_PATH_CONFIG.WEBDAV.BOOKMARKS, { format: "text" }).then((result: any) => {
        console.log("getFileContents result", result)
    })
}
const putFileContents = () => {

    const client = getWebDAVClient()
    let db: JmDatastore = proxy.$db
    db.bookmarks.find({}, (err, data) => {
        console.log(data)
        client.putFileContents(DB_PATH_CONFIG.WEBDAV.BOOKMARKS, JSON.stringify(data), { overwrite: true }).then((result: any) => {
            console.log("write result", result)
        })
    })
}

const getUploadUrl = () => {
    console.log("AAA")
    const client = createClient(
        import.meta.env.VITE_JIANGUOYUN_DAV_URL,
        {
            username: "powertn@126.com",
            password: ""
        }
    );
    console.log(client)

    let result: string = client.getFileUploadLink(DB_PATH_CONFIG.WEBDAV.BOOKMARKS,)
    console.log("upload url ", result)

}
const getWebDAVClient = () => {
    return createClient(
        import.meta.env.VITE_JIANGUOYUN_DAV_URL,
        {
            username: "powertn@126.com",
            password: ""
        }
    );
}
const test3 = () => {
    const client = createClient(
        import.meta.env.VITE_JIANGUOYUN_DAV_URL,
        {
            username: "powertn@126.com",
            password: ""
        }
    );
    const remote = client.createReadStream(DB_PATH_CONFIG.WEBDAV.BOOKMARKS);
    const someWriteStream = fs.createWriteStream("/Users/powertn/.jm/tttttt.txt");
    remote.pipe(someWriteStream);
    console.log(remote)
    //当流中有数据可供读取时就触发
    remote.on('close', function () {
        console.log('stream 文件流关闭，写入完成');
    });
    remote.on('error', () => console.log('写入数据错误'));

}
const test2 = () => {
    const client = createClient(
        import.meta.env.VITE_JIANGUOYUN_DAV_URL,
        {
            username: "powertn@126.com",
            password: ""
        }
    );
    client.exists(DB_PATH_CONFIG.WEBDAV.BOOKMARKS).then((remoteBookmarksExists: Boolean) => {
        if (!remoteBookmarksExists) {
            const remote = client.createWriteStream(DB_PATH_CONFIG.WEBDAV.BOOKMARKS);
            let stream = fs.createReadStream(DB_PATH_CONFIG.LOCAL.BOOKMARKS).pipe(remote);
            console.log("stream ", stream)
        } else {
            // 文件存在 判断 本地时间与云上时间 写入 并且对比大小
            fs.stat(DB_PATH_CONFIG.LOCAL.BOOKMARKS, (err, localStats) => {
                console.log("local stats", localStats)
                // localStats mtime size
                client.exists(DB_PATH_CONFIG.WEBDAV.BOOKMARKS).then((remoteStats: any) => {
                    console.log("remote stats", remoteStats)
                    // 对比时间 lastmod 

                })


            })
        }
    })
    // return true/false
    // let remoteBookmarksExists = await client.exists(DB_PATH_CONFIG.WEBDAV.BOOKMARKS) || Boolean
    // if (!remoteBookmarksExists) {
    //     const remote = client.createWriteStream(DB_PATH_CONFIG.WEBDAV.BOOKMARKS);
    //     let stream = fs.createReadStream(DB_PATH_CONFIG.LOCAL.BOOKMARKS).pipe(remote);
    //     console.log("stream ", stream)
    // } else {
    //     // 文件存在 判断 本地时间与云上时间 写入
    //     fs.stat(DB_PATH_CONFIG.LOCAL.BOOKMARKS, (err, localStats) => {
    //         console.log("local stats", localStats)
    //         let remoteStats = await client.exists(DB_PATH_CONFIG.WEBDAV.BOOKMARKS)
    //     })
    //     console.log()

    // }
}
const test = async () => {
    const client = createClient(
        import.meta.env.VITE_JIANGUOYUN_DAV_URL,
        {
            username: "powertn@126.com",
            password: ""
        }
    );

    let remoteBookmarksExists = await client.stat(DB_PATH_CONFIG.WEBDAV.BOOKMARKS) || Boolean
    if (remoteBookmarksExists) {

    }


    // basename: "..",etag: null,filename: "/..",lastmod: "Sun, 26 Dec 2021 05:37:33 GMT",size: 0,type: "directory"
    //  const remote = client.createWriteStream("/data.zip");
    //  fs.createReadStream("~/myData.zip").pipe(remote);
    const directoryList = await client.getDirectoryContents("/") || [];
    console.log("directoryItems ", directoryList)
    let mainBaseDirExists = await client.exists(DB_PATH_CONFIG.WEBDAV.BOOKMARKS)
    console.log("mainBaseDirExists ", mainBaseDirExists)
    let mainBaseDirItem = directoryList.find((item: any) => item.basename === mainBaseDir && item.type === "directory")
    if (mainBaseDirItem) {
        console.log("exit ")
        const remote = client.createWriteStream(DB_PATH_CONFIG.WEBDAV.BOOKMARKS);
        let stream = fs.createReadStream(DB_PATH_CONFIG.LOCAL.BOOKMARKS).pipe(remote);
        stream.on('close', () => {
            console.log("stream close")
        })
        stream.on('error', (err: Error) => {
            console.log("stream error", err)
        })
    } else {
        // create 
        console.log("create ")
        let createDirResult = await client.createDirectory(mainBaseDir)
        console.log("createDirResult ", createDirResult)
    }

}
</script>