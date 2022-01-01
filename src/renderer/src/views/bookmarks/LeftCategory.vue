<template>
    <n-anchor
        v-for="(item,index) in bookmarksTree"
        :key="index"
        :show-rail="true"
        :show-background="true"
        type="block"
    >
        <n-anchor-link
            class="bookmarks-anchor"
            v-for="(item,index) in item.children"
            :title="item.name"
            :key="index"
            :href="'#' + item.uuid"
        ></n-anchor-link>
        <n-anchor-link class="bookmarks-anchor" title="SETTING" href="#setting" />
    </n-anchor>
</template>
<script lang="ts" setup>
// import Logo from "./logo.vue"
import { defineProps } from 'vue'
import { BookMarksItem } from '../../types'


// 监控变化，获取第一个分类？
const props = defineProps<{
    bookmarksTree: BookMarksItem[]
}>()









</script>