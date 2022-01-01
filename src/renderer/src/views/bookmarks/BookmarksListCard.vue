<template>
    <div v-if="bookmarks.category === BookMarksItemCategory.DIR">
        <n-space justify="space-between">
            <n-icon size="28">
                <Folder28Regular v-if="bookmarks.children && bookmarks.children.length > 0" />
                <FolderProhibited28Regular v-else />
            </n-icon>
            <n-button @click="clickEdit" v-show="bookmarks.showEditBtn" secondary size="medium">编辑</n-button>
        </n-space>
        <div class="bookmarks-name text-break">{{ bookmarks.name }}</div>
        <div class="bookmarks-desc text-break">{{ bookmarks.desc }}</div>
    </div>
    <div v-else>
        <n-space justify="space-between">
            <n-avatar
                round
                size="small"
                :src="bookmarks.logo"
                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
            <n-button @click="clickEdit" v-show="bookmarks.showEditBtn" secondary size="small">编辑</n-button>
        </n-space>

        <div class="bookmarks-name text-break">{{ bookmarks.name }}</div>
        <div class="bookmarks-desc text-break">{{ bookmarks.desc }}</div>
    </div>
</template>

<script lang="ts" setup>

import { defineProps, ref, onMounted, defineEmits } from 'vue'
import { Folder28Regular, FolderProhibited28Regular } from '@vicons/fluent'
import { BookMarksItem, BookMarksItemCategory } from '../../types'
const props = defineProps<{
    bookmarks: BookMarksItem,
}>()
const emits = defineEmits<{
    (event: 'clickEdit'): void
}>()

onMounted(() => {

})
/**
 * 点击编辑
 */
const clickEdit = () => {
    emits('clickEdit')
}

</script>

<style scoped lang="less">
.bookmarks-item {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}
.dir {
    background-color: rgba(0, 128, 0, 0.24);
}

.text-break {
    word-wrap: break-word;
}

.bookmarks-name {
    margin-top: 10px;
    font-size: 18px;
    line-height: 20px;
    height: 20px;
    text-transform: capitalize;
    overflow: hidden;
}
.bookmarks-desc {
    overflow: hidden;
    margin-top: 10px;
}
</style>