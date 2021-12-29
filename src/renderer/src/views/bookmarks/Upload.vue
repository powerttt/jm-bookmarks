<template>
    <h4 id="setting"># 设置</h4>
    <h5># 导入</h5>
    <n-upload @change="handleChange" :default-upload="false" ref="upload">
        <n-button>选择文件</n-button>
    </n-upload>
    <n-button @click="uploadSubmit">上传文件</n-button>
    <n-button @click="clearBookmarksDb">清空书签数据</n-button>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue';
import { readBookmarks, bookmarksArray2Tree } from '../../utils'
import type { JmDatastore, BookMarksItem } from '../../types';
import { useBookmarksStore } from '../../store/modules'
import { useMessage } from 'naive-ui';
const uploadFile: any = ref({})
const { proxy } = getCurrentInstance()
const db: JmDatastore = proxy.$db
const message = useMessage()
const handleChange = ({ file }) => {
    if (file) {
        uploadFile.value = file.file
    }
}
const uploadSubmit = () => {
    let path = uploadFile.value.path
    console.log("file", uploadFile.value)

    if (!path || path == "") {
        message.warning("文件路径为空")
        return
    }
    let _messageLoading = message.loading("正在导入")

    console.log("path", path)
    if (path) {
        let arr = readBookmarks(path, (errMsg, result: []) => {
            console.log(errMsg)
            console.log(result)
            console.log(message)
            if (result.length === 0) {
                _messageLoading.destroy()
                message.error("数据为空，请检查导入的文件格式")
                return
            }
            // 写入数据库
            db.bookmarks.insert(result, (err: any, resultDoc: any) => {
                console.log("resultDoc", resultDoc)
                _messageLoading.destroy()
                if (err) {
                    message.error("写入失败")
                    return
                }
                uploadFile.value = null
                message.success("导入成功")
                console.log("导入成功 ")
                // 重新加载数据
                useBookmarksStore.loadTree(db)
            })

        })
    }



}
const clearBookmarksDb = () => {
    db.bookmarks.remove({}, { multi: true }, (err, msg) => {
        console.log("err", err)
        console.log("message", message)
        message.success("清空成功")
        // 重新加载数据 emits
        useBookmarksStore.loadTree(db)

    })
}

</script>