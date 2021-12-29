<template>
    <div v-for="(itemTree,indexTree) in bookmarksTree" :key="indexTree">
        <!-- 标题 -->
        <div v-for="(item,index) in itemTree.children" :key="index" :id="item.uuid">
            <!-- 标题 -->
            <n-divider>
                <template #default>
                    <n-dropdown
                        size="small"
                        trigger="hover"
                        placement="bottom-end"
                        :show-arrow="true"
                        :options="[
                            { label: '编辑', key: 'update', item, icon() { return editIconH() } }
                        ]"
                        @select="handleCategoryNameDropdownSelect"
                    >
                        <div style="display: flex;align-items: center;">
                            <span>{{ item.name }}</span>
                            <n-icon size="15" style="margin-left: 10px;">
                                <ChevronDown28Regular />
                            </n-icon>
                        </div>
                    </n-dropdown>
                </template>
            </n-divider>
            <n-grid :x-gap="12" :y-gap="12" cols="2 s:2 m:3 l:4 xl:6 2xl:7" responsive="screen">
                <n-grid-item>
                    <n-card class="bookmarks-card bookmarks-add-card" hoverable @click="clickAdd(item)">
                        <n-icon size="30">
                            <Add28Regular />
                        </n-icon>
                    </n-card>
                </n-grid-item>

                <!-- 单个书签就成为分类了 -->
                <n-grid-item v-if="item.category == BookMarksItemCategory.BOOK_MARKS">
                    <n-card class="bookmarks-card" embedded hoverable>
                        <div>
                            <n-avatar
                                round
                                size="small"
                                src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                            />
                            <div class="bookmarks-name text-break">{{ item.name }}</div>
                            <div class="bookmarks-desc text-break">这是描述</div>
                        </div>
                    </n-card>
                </n-grid-item>

                <!-- 分类下的子标签 -->
                <n-grid-item v-for="(cItem,cIndex) in item.children" :key="cIndex">
                    <!-- 分类下的文件夹 -->
                    <n-card
                        class="bookmarks-card"
                        v-if="cItem.category == BookMarksItemCategory.DIR"
                        embedded
                        hoverable
                    >
                        <n-dropdown
                            @select="handleSelect"
                            trigger="hover"
                            key-field="uuid"
                            label-field="name"
                            children-field="children"
                            :options="cItem.children"
                        >
                            <div>
                                <n-icon size="28">
                                    <Folder28Regular
                                        v-if="cItem.children && cItem.children.length > 0"
                                    />
                                    <FolderProhibited28Regular v-else />
                                </n-icon>

                                <div class="bookmarks-name text-break">{{ cItem.name }}</div>
                                <div class="bookmarks-desc text-break">这是描述</div>
                            </div>
                        </n-dropdown>
                    </n-card>
                    <n-card v-else class="bookmarks-card" embedded hoverable>
                        <div>
                            <n-avatar
                                round
                                size="small"
                                src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                            />
                            <div class="bookmarks-name text-break">{{ cItem.name }}</div>
                            <div class="bookmarks-desc text-break">这是描述</div>
                        </div>
                    </n-card>
                </n-grid-item>
            </n-grid>
        </div>
    </div>
    <n-modal v-model:show="optionalShowModal" preset="card" style="width: 600px;">
        <OptionalModal
            @close="optionalShowModal = false"
            :bookmarks="selectBookmarks"
            :optionModal="selectBookmarksOption"
        ></OptionalModal>
    </n-modal>
</template>

<script lang="ts" setup>
// import Logo from "./logo.vue"
import OptionalModal from './OptionalModal.vue'
import { defineProps } from 'vue'
import type { Ref } from 'vue'
import { uuid } from '../../utils'
import { BookMarksItem, BookMarksItemCategory } from '../../types'
import { ChevronDown28Regular, DocumentEdit16Regular, Folder28Regular, FolderProhibited28Regular, Add28Regular } from '@vicons/fluent'

import { NIcon, useMessage } from 'naive-ui'
import { h, ref, reactive, getCurrentInstance, onMounted } from 'vue';

const selectBookmarks: Ref<BookMarksItem | any> = ref([])
const selectBookmarksOption: Ref<string> = ref('')
const optionalShowModal = ref(false)
const message = useMessage()
// 监控变化，获取第一个分类？
const props = defineProps<{
    bookmarksTree: BookMarksItem[]
}>()

const editIconH = () => {
    return h(NIcon, null, {
        default: () => h(DocumentEdit16Regular)
    })
}
const clickAdd = (parent:BookMarksItem) => {
    console.log("clickAdd")

    selectBookmarksOption.value = "add"
    selectBookmarks.value = {
        uuid: uuid(),
        parentUuid:parent.uuid,
        category:1
    }
    // 弹出模态框/或者抽屉
    optionalShowModal.value = true
}
/**
 * 点击折叠的书签
 */
const handleSelect = (key: string) => {
    message.info(key)
}
/**
 * 修改分类信息
 */
const handleCategoryNameDropdownSelect = (key: number, option: DropdownOption) => {
    selectBookmarksOption.value = key
    selectBookmarks.value = option.item
    // 弹出模态框/或者抽屉
    optionalShowModal.value = true

}











</script>

<style  lang="less">
.bookmarks-add-card > .n-card__content {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
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
.bookmarks-card {
    height: 150px;

    .img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
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
}
</style>