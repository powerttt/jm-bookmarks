<template>
    <h5># 快速编辑</h5>
    <n-grid :x-gap="10" :y-gap="5" :cols="8">
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
            <OptionalModal :optionModal="selectBookmarksOption" :bookmarks="selectBookmarks" />
        </n-grid-item>
    </n-grid>
</template>
<script lang="ts" setup>
import { BookMarksItem, BookMarksItemCategory, getBookMarksItemDefaultValue } from '../../types'
import { defineProps, ref, h, Ref } from 'vue'
import OptionalModal from './OptionalModal.vue'
import { bookmarksIsDir, uuid } from '../../utils'
import { Folder28Regular, FolderProhibited28Regular, Add24Regular } from '@vicons/fluent'
import { BookmarksSharp } from '@vicons/ionicons5'
import { NButton, NIcon } from 'naive-ui'
// TODO 发送拖拽后，需要有保存按钮，全量入库
// TODO BUG 
const props = defineProps<{
    bookmarksTree: BookMarksItem[]
}>()
// OptionalModal update/add
const OPTION_MODAL_ENUM = {
    UPDATE: 'update',
    ADD: 'add',
}
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
            h(NIcon,
                { size: 14, onClick: () => clickAddSuffix(option),style:{marginRight:'15px'} },
                { default: () => h(Add24Regular) }
            )

        )
    } else {
        return h('div')
    }

}

const clickLabel = (bookmarks: BookMarksItem) => {
    selectBookmarksOption.value = OPTION_MODAL_ENUM.UPDATE
    // 不处理 children, tree 会卡顿
    let { children, ..._bookmarksNotChildren } = bookmarks
    let bookmarksDefaultValue = getBookMarksItemDefaultValue()
    selectBookmarks.value = Object.assign(bookmarksDefaultValue, _bookmarksNotChildren)
    // 展示 OptionalModal
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

const renderPrefix = ({ option }) => {

    // 是否是文件夹
    if (bookmarksIsDir(option)) {
        console.log(option)
        return h(
            NIcon,
            { size: 14 },
            h(option.children && option.children.length > 0
                ? Folder28Regular : FolderProhibited28Regular
            )
        )
    } else {
        return h(
            NIcon, { size: 14 }, { default: () => h(BookmarksSharp) }
        )
    }


}
const findSiblingsAndIndex = (node, nodes) => {
    if (!nodes) return [null, null]
    for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i]
        if (siblingNode.uuid === node.uuid) return [nodes, i]
        const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
        if (siblings) return [siblings, index]
    }
    return [null, null]
}

const handleDrop = ({ node, dragNode, dropPosition }) => {
    const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
        dragNode,
        props.bookmarksTree
    )
    dragNodeSiblings.splice(dragNodeIndex, 1)

    console.log(dragNodeSiblings)
    console.log(dragNodeIndex)

    if (dropPosition === 'inside') {
        if (node.children) {
            node.children.unshift(dragNode)
        } else {
            node.children = [dragNode]
        }
    } else if (dropPosition === 'before') {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
            node,
            props.bookmarksTree
        )
        nodeSiblings.splice(nodeIndex, 0, dragNode)
    } else if (dropPosition === 'after') {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
            node,
            props.bookmarksTree
        )
        nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
    }
}



</script>