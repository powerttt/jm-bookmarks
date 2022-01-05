<template>
    <div style="margin-left: 5px;">
        <n-anchor
            v-for="(item,index) in bookmarksTree"
            :key="index"
            :ignore-gap="true"
            :show-rail="false"
            :show-background="true"
            type="block"
        >
            <n-anchor-link :title="item.name" :key="item.uuid" :href="'#' + item.uuid">
                <n-anchor-link
                    class="bookmarks-anchor"
                    v-for="(cItem,cIndex) in item.children"
                    :title="cItem.name"
                    :key="cItem.uuid"
                    :href="'#' + cItem.uuid"
                ></n-anchor-link>
            </n-anchor-link>
        </n-anchor>

        <n-anchor :show-rail="true" :show-background="true" type="block">
            <n-anchor-link class="bookmarks-anchor" title="SETTING" href="#setting" />
        </n-anchor>
    </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
import { BookMarksItem } from '../../types'

// 监控变化，获取第一个分类？
const props = defineProps<{
    bookmarksTree: BookMarksItem[]
}>()

</script>

<style lang="less">
.bookmarks-anchor {
    margin: 0 10px !important;
    .n-anchor-link__title {
        border-radius: 8px !important;
        padding: 2px 4px !important;
    }
}
</style>