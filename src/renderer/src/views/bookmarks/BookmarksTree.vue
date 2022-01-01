<template>
    <h5># 快速编辑</h5>

    <n-tree
        block-line
        draggable
        key-field="uuid"
        label-field="name"
        children-field="children"
        :data="bookmarksTree"
        :render-prefix="renderPrefix"
        :render-suffix="renderSuffix"
        @drop="handleDrop"
    />
</template>
<script lang="ts" setup>
import { BookMarksItem, BookMarksItemCategory, JmDatastore } from '../../types'
import { defineProps, ref, h, withDefaults, onMounted, defineEmits, getCurrentInstance, computed, Ref } from 'vue'
// import { useBookmarksStore } from '../../store/modules'

import { Folder28Regular, FolderProhibited28Regular, Options16Filled, Add24Regular, Edit24Regular, Delete24Regular } from '@vicons/fluent'
import { BookmarksSharp } from '@vicons/ionicons5'
import { NButton, NIcon, NSpace } from 'naive-ui'

const props = defineProps<{
    bookmarksTree: BookMarksItem[]
}>()
// const bookmarksTree: Ref<BookMarksItem[]> | any = ref({})
onMounted(() => {
    // console.log("onMounted ",props.bookmarksTree)
    // bookmarksTree.value = JSON.parse(JSON.stringify(props.bookmarksTree))
})
// <n-icon size="28">
//     <Folder28Regular v-if="bookmarks.children && bookmarks.children.length > 0" />
//     <FolderProhibited28Regular v-else />
// </n-icon>
/**
 * 判断是否是文件夹
 */
function isDir(bookmarks: BookMarksItem): boolean {
    return bookmarks.category === BookMarksItemCategory.DIR
}
/**
 * 判断文件夹是否为空
 */

function dirIsNotEmpty(bookmarks: BookMarksItem): boolean {
    return bookmarks.children && bookmarks.children.length > 0
}
function renderSuffix({ option }) {
    // 如果是文件夹，返回添加按钮，
    // 编辑，删除
    // let h
    // NSpace
    let btn = [
        h(NIcon,
            { size: 14, onClick: editClick(option) },
            { default: () => h(Edit24Regular) }
        ),
        h(NIcon,
            { size: 14, onClick: delClick(option) },
            { default: () => h(Delete24Regular) }
        ),
    ]
    if (isDir(option)) {
        btn.unshift(h(NIcon,
            { size: 14, onClick: addClick(option) },
            { default: () => h(Add24Regular) }
        ))
    }
    return h(
        NSpace,
        {},
        btn
    )
}
// TODO 最终树转换成list 全量入库

function delClick(bookmarks: BookMarksItem) {
    // 确认是否删除
    console.log("delClick", bookmarks)
}
function editClick(bookmarks: BookMarksItem) {
    // 展示 OptionalModal

    console.log("editClick", bookmarks)
}
function addClick(bookmarks: BookMarksItem) {
    // 展示 OptionalModal，初始化父值
    console.log("addClick", bookmarks)
}
function renderPrefix({ option }) {

    // 是否是文件夹
    if (isDir(option)) {
        return h(
            NIcon,
            { size: 14 },
            h(dirIsNotEmpty(option) ? Folder28Regular : FolderProhibited28Regular
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
    // console.log(
    //     "目标 node",node
    // )
    // console.log(
    //     "拖动 dragNode",dragNode
    // )
    // console.log(
    //     "往前还是往后，还是在同一级 dropPosition",dropPosition
    // )
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
    // props.bookmarksTree = Array.from(props.bookmarksTree)
}



</script>