<template>
    <h5># 快速编辑</h5>
    <n-switch v-model:value="showEdit">
        <template #checked>开启编辑</template>
        <template #unchecked>关闭编辑</template>
    </n-switch>
    <n-grid :x-gap="10" :y-gap="5" :cols="8" v-if="showEdit">
        <n-grid-item :span="4">
            <n-scrollbar style="max-height: 550px;">
                <n-tree
                    block-line
                    draggable
                    key-field="uuid"
                    label-field="name"
                    children-field="children"
                    :data="bookmarksTree"
                    :render-label="renderLabel"
                    :render-prefix="renderPrefix"
                    :render-suffix="renderSuffix"
                    @drop="handleDrop"
                />
            </n-scrollbar>
        </n-grid-item>
        <n-grid-item :span="4">
            <BookmarksForm :optionModal="selectBookmarksOption" :bookmarks="selectBookmarks" />
        </n-grid-item>
    </n-grid>
</template>
<script lang="ts" setup>
import { BookMarksItem, BookMarksItemCategory, getBookMarksItemDefaultValue } from '../../types'
import { defineProps, ref, h, Ref, getCurrentInstance } from 'vue'
import BookmarksForm from './BookmarksForm.vue'
import { bookmarksIsDir, uuid, bookmarksFindSiblingsAndIndex } from '../../utils'
import { Folder28Regular, FolderProhibited28Regular, Add24Regular } from '@vicons/fluent'
import { BookmarksSharp } from '@vicons/ionicons5'
import { NButton, NIcon, useMessage } from 'naive-ui'

const props = defineProps<{
    bookmarksTree: BookMarksItem[]
}>()
// BookmarksForm update/add
const OPTION_MODAL_ENUM = {
    UPDATE: 'update',
    ADD: 'add',
}
const showEdit = ref(false)
const active = ref(true)
const { proxy } = getCurrentInstance()
const db: JmDatastore = proxy.$db

const message = useMessage()

const selectBookmarksOption: Ref<string> = ref(OPTION_MODAL_ENUM.UPDATE)
const selectBookmarks: Ref<BookMarksItem | any> = ref({})

const renderLabel = ({ option }) => {
    return h(
        "div",
        { onClick: () => clickLabel(option) },
        { default: () => option.name }
    )
}

const renderSuffix = ({ option }) => {
    if (bookmarksIsDir(option)) {
        return h(NButton,
            { text: true, type: 'primary' },
            {
                default: () => h(NIcon,
                    { size: 14, onClick: () => clickAddSuffix(option), style: { marginRight: '15px' } },
                    { default: () => h(Add24Regular) }
                )
            }

        )
    } else {
        return h('div')
    }

}

const renderPrefix = ({ option }) => {

    // 是否是文件夹
    if (bookmarksIsDir(option)) {
        return h(
            NIcon,
            { size: 14 },
            {
                default: () => h(option.children && option.children.length > 0
                    ? Folder28Regular : FolderProhibited28Regular
                )
            }
        )
    } else {
        return h(
            NIcon, { size: 14 }, { default: () => h(BookmarksSharp) }
        )
    }


}

const clickLabel = (bookmarks: BookMarksItem) => {
    selectBookmarksOption.value = OPTION_MODAL_ENUM.UPDATE
    // 不处理 children, tree 会卡顿
    // let { children, ..._bookmarksNotChildren } = bookmarks
    // let bookmarksDefaultValue = getBookMarksItemDefaultValue()
    // selectBookmarks.value = Object.assign(bookmarksDefaultValue, _bookmarksNotChildren)
    
    let bookmarksDefaultValue = getBookMarksItemDefaultValue()
    selectBookmarks.value = Object.assign(bookmarksDefaultValue, bookmarks)
    
    // 展示 BookmarksForm
    console.log("editClick", selectBookmarks.value)
}
const clickAddSuffix = (bookmarks: BookMarksItem) => {

    selectBookmarksOption.value = OPTION_MODAL_ENUM.ADD
    let { children, ..._bookmarksNotChildren } = bookmarks
    let value = getBookMarksItemDefaultValue()
    value.category = BookMarksItemCategory.BOOK_MARKS
    value.uuid = uuid()
    value.parentUuid = bookmarks.uuid
    selectBookmarks.value = value
}

const handleDrop = ({ node, dragNode, dropPosition }) => {

    // 去除拖动的元素
    const [dragNodeSiblings, dragNodeIndex] = bookmarksFindSiblingsAndIndex(
        dragNode,
        props.bookmarksTree
    )
    dragNodeSiblings.splice(dragNodeIndex, 1)



    if (dropPosition === 'inside') {
        // 目标不是文件夹，不接收
        if (!bookmarksIsDir(node)) {
            return
        }
        // 拖动到某个标签里面
        dragNode.parentUuid = node.uuid

        if (node.children) {
            node.children.unshift(dragNode)
        } else {
            node.children = [dragNode]
        }
    } else if (dropPosition === 'before') {
        const [nodeSiblings, nodeIndex] = bookmarksFindSiblingsAndIndex(
            node,
            props.bookmarksTree
        )
        // 拖动到某个标签后面
        dragNode.parentUuid = node.parentUuid
        nodeSiblings.splice(nodeIndex, 0, dragNode)
    } else if (dropPosition === 'after') {
        const [nodeSiblings, nodeIndex] = bookmarksFindSiblingsAndIndex(
            node,
            props.bookmarksTree
        )
        // 拖动到某个标签前面
        dragNode.parentUuid = node.parentUuid
        nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
    }
    // 入库修改，uuid
    updateDragNodeUuid(dragNode)

}
const updateDragNodeUuid = (dragNode: BookMarksItem) => {
    let setValue = { parentUuid: dragNode.parentUuid }
    let loadingMessage = message.loading("正在保存")

    // 写入数据库
    db.bookmarks.update(
        { _id: dragNode._id },
        { $set: setValue },
        {},
        (err: any, numReplaced: number) => {
            loadingMessage.destroy()
            if (numReplaced !== 0) {
                message.success(`保存成功`)
            } else {
                message.error(`保存失败`)
            }
        }
    )
}



</script>