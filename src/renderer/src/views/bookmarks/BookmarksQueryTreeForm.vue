<template>
    <n-form inline :label-width="80" :model="bookmarks" size="small" ref="queryFormRef">
        <n-form-item :label="isDirFlag ? '标题(文件夹)' : '标题'" path="name">
            <n-input placeholder="Ta有好听的名字" v-model:value="bookmarks.name" />
        </n-form-item>
        <n-form-item label="图标" path="logo">
            <n-input placeholder="Ta的图标呢" v-model:value="bookmarks.logo" />
        </n-form-item>
        <n-form-item label="描述" path="desc">
            <n-input placeholder="你需要短小精悍的描述" v-model:value="bookmarks.desc" />
        </n-form-item>
        <n-form-item>
            <n-space>
                <n-button
                    v-if="isDirFlag"
                    @click="addChildren"
                    type="primary"
                    :loading="btnLoading"
                    attr-type="button"
                >添加</n-button>

                <n-button
                    @click="clickSave"
                    type="primary"
                    :loading="btnLoading"
                    attr-type="button"
                >保存</n-button>
                <n-button @click="clickDel" type="error" :loading="btnLoading" attr-type="button">删除</n-button>
            </n-space>
        </n-form-item>
    </n-form>
    <div
        style="margin-left:30px;"
        v-if="bookmarks.category === BookMarksItemCategory.DIR && bookmarks.children && bookmarks.children.length > 0"
    >
        <div v-for="(item,index) in bookmarks.children">
            <BookmarksQueryTreeForm @delNotIdItem="delNotIdItem" :bookmarks="item"></BookmarksQueryTreeForm>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { defineProps, ref, withDefaults, onMounted, defineEmits, getCurrentInstance, computed } from 'vue'
import { Ref } from 'vue'
import { BookMarksItem, BookMarksItemCategory, JmDatastore } from '../../types'
import { useBookmarksStore } from '../../store/modules'
import { useMessage } from 'naive-ui'
import { uuid } from '../../utils'


interface OptionModalProps {
    bookmarks: any | BookMarksItem,
}
const emits = defineEmits<{
    // delNotIdItem 删除没有入库的书签，data is uuid
    (event: 'delNotIdItem', data: string): void
}>()
const props = withDefaults(defineProps<OptionModalProps>(), {
    bookmarks: {
        url: "",
        logo: "",
        desc: "",
        uuid: "",
        name: "",
        tags: [],
        sortNum: "",
        // 打开时间
        openTime: 0,
        // 打开时间
        openCount: 0,
        // category 文件夹，书签
        category: BookMarksItemCategory.DIR,
        parentUuid: "",
    },
    optionModal: 'update'
})
onMounted(() => {
    bookmarks.value = JSON.parse(JSON.stringify(props.bookmarks))
})

const bookmarks: BookMarksItem | any = ref({})
const isDirFlag: Ref<boolean> = computed(() => bookmarks.value.category === BookMarksItemCategory.DIR)
const queryFormRef: Ref = ref({})
const message = useMessage()
const bookmarksStore = useBookmarksStore()
const btnLoading = ref(false)
const { proxy } = getCurrentInstance()
const db: JmDatastore = proxy.$db

const dbResultCheck = (err: any, numReplaced: number, msg: string, successCallback: () => void) => {
    console.log("err ", err)
    console.log("numReplaced", numReplaced)
    if (numReplaced !== 0) {
        // 重新加载树
        db.bookmarks.find({}, (err: any, data = []) => {
            console.log("重新加载树", data)
            bookmarksStore.setTree(data)
            btnLoading.value = false
            message.success(`${msg}成功`)
            successCallback()
        })
    }
    // numReplaced === 0 
    else {
        message.error(`${msg}失败`)
    }
}
/**
 * 添加子书签或文件夹
 */
const addChildren = () => {
    // 在当前子中添加
    let _newBookmarks = {
        name: "",
        logo: "",
        desc: "",
        uuid: uuid(),
        parentUuid: bookmarks.value.uuid,
        category: 1
    }
    if (bookmarks.value.children) {
        bookmarks.value.children.unshift(_newBookmarks)
    } else {
        bookmarks.value.children = [_newBookmarks]
    }
}
/**
 * delNotIdItem 删除没有入库的书签，data is uuid
 */
const delNotIdItem = (uuid: string) => {
    console.log("执行  delNotIdItem uuid=", uuid)
    if (bookmarks.value.children && bookmarks.value.children.length > 0) {
        let index = bookmarks.value.children.findIndex((l: BookMarksItem) => l.uuid === uuid)
        if (index) {
            bookmarks.value.children.splice(index, 1)
        }
    }
}
const clickDel = () => {

    // 如果没有 _id 的就是刚刚增加的，销毁自己？向上级禀报
    if (!bookmarks.value._id) {
        emits('delNotIdItem', bookmarks.value.uuid)
        console.log("提交  delNotIdItem uuid=", uuid)
        return
    }

    btnLoading.value = true
    // upload
    // 写入数据库，重新刷新tree
    db.bookmarks.remove(
        { uuid: bookmarks.value.uuid },
        (err: any, numReplaced: number) => {
            dbResultCheck(err, numReplaced, '删除', () => {
                // emits('close')
            })
        })
}

const clickSave = () => {
    queryFormRef.value.validate((errors: string) => {
        if (errors) {
            message.error('请输入必填项目吧，没几个')
            console.log('errors', errors)
            return
        }
        save()
    })
}
const save = () => {

    btnLoading.value = true

    // UPDATE
    if (bookmarks.value._id) {
        // upload
        // 写入数据库，重新刷新tree
        db.bookmarks.update(
            { uuid: bookmarks.value.uuid },
            { $set: bookmarks.value },
            {},
            (err: any, numReplaced: number) => {
                dbResultCheck(err, numReplaced, '修改', () => {
                    console.log("修改成功")
                })
            })
    }
    // ADD
    else {
        // add
        // 写入数据库，重新刷新tree
        db.bookmarks.insert(
            bookmarks.value,
            (err: any, numReplaced: number) => {
                dbResultCheck(err, numReplaced, '新增', () => {
                    // 将当前新增改为编辑      
                })
            })
    }


}





</script>