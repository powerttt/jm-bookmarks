<template>
    <n-layout class="layout" :position="'absolute'" has-sider>
        <n-layout-sider class="layout-sider">
            <Logo></Logo>

            <n-anchor :show-rail="true" :show-background="true" type="block">
                <div v-if="bookmarksTree.length > 0 && bookmarksTree[0].children.length > 0">
                    <n-anchor-link
                        class="bookmarks-anchor"
                        v-for="(item,index) in bookmarksTree[0].children"
                        :title="item.name"
                        :key="index"
                        :href="'#' + item.uuid"
                    ></n-anchor-link>
                    <n-anchor-link class="bookmarks-anchor" title="setting" href="#setting" />
                </div>
            </n-anchor>
        </n-layout-sider>

        <n-layout>
            <n-layout-content class="layout-content layout-default-background">
                <n-dropdown
                    size="small"
                    trigger="hover"
                    placement="left-start"
                    :show-arrow="true"
                    :options="categoryNameOptions"
                    @select="handleCategoryNameDropdownSelect"
                >
                    <div style="display: flex;align-items: center;">
                        <span>TEST</span>
                        <n-icon size="15" style="margin-left: 10px;">
                            <ChevronDown28Regular />
                        </n-icon>
                    </div>
                </n-dropdown>
                <!-- 标题 -->
                <div v-for="(item,index) in bookmarksTreeItem" :key="index" :id="item.uuid">
                    <!-- 标题 -->
                    <n-divider>
                        <template #default>
                            <n-dropdown
                                size="small"
                                trigger="hover"
                                placement="bottom-end"
                                :show-arrow="true"
                                :options="categoryNameOptions"
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
                    <n-grid
                        :x-gap="12"
                        :y-gap="12"
                        cols="2 s:3 m:4 l:5 xl:6 2xl:7"
                        responsive="screen"
                    >
                        <n-grid-item>
                            <div class="bookmarks-item">ADD</div>
                        </n-grid-item>

                        <!-- 单个书签就成为分类了 -->
                        <n-grid-item v-if="item.category == BookMarksItemCategory.BOOK_MARKS">
                            <div class="bookmarks-item">{{ item.name }}</div>
                        </n-grid-item>

                        <!-- 分类下的子标签 -->
                        <n-grid-item v-for="(cItem,cIndex) in item.children" :key="cIndex">
                            <!-- 分类下的文件夹 -->
                            <div
                                v-if="cItem.category == BookMarksItemCategory.DIR"
                                class="dir bookmarks-item"
                            >
                                <n-dropdown
                                    @select="handleSelect"
                                    trigger="hover"
                                    key-field="uuid"
                                    label-field="name"
                                    children-field="children"
                                    :options="cItem.children"
                                >
                                    <n-button>{{ cItem.name }}</n-button>
                                </n-dropdown>
                            </div>
                            <!-- 分类下的子标签 -->
                            <div v-else class="bookmarks-item">{{ cItem.name }}</div>
                        </n-grid-item>
                    </n-grid>
                </div>
                <h4 id="setting"># 设置</h4>
                <h5># 导入</h5>
                <n-upload @change="handleChange" :default-upload="false" ref="upload">
                    <n-button>选择文件</n-button>
                </n-upload>
                <n-button @click="uploadSubmit">上传文件</n-button>
                <n-button @click="clearBookmarksDb">清空书签数据</n-button>
            </n-layout-content>
        </n-layout>
    </n-layout>

    <n-modal v-model:show="showModal">
        <n-card style="width: 600px;" title="模态框" :bordered="false" size="huge">
            <template #header-extra>噢！</template>
            内容
            <template #footer>尾部</template>
        </n-card>
    </n-modal>
</template>
<script lang="ts" setup>
import { ChevronDown28Regular, DocumentEdit16Regular } from '@vicons/fluent'
import { h, ref, reactive, getCurrentInstance, onMounted } from 'vue';
import Logo from './logo.vue'
import type { Ref } from 'vue'
import { readBookmarks, bookmarksArray2Tree } from '../../utils'
import { NIcon, useMessage } from 'naive-ui';
import type { JmDatastore, BookMarksItem } from '../../types';
import { BookMarksItemCategory } from '../../types'
import type { Nullable } from '@qvant/qui-max/dist/types/helpers';
const showModal = ref(true)
const categoryNameOptions: any = [
    {
        label: '编辑',
        key: 'update',
        icon() {
            return h(NIcon, null, {
                default: () => h(DocumentEdit16Regular)
            })
        },
    }
]
// 折叠
const collapsed = ref(false)
const bookmarksCategory = BookMarksItemCategory

const message = useMessage()
const uploadFile: any = ref({})
const { proxy } = getCurrentInstance()
let db: JmDatastore = proxy.$db
const bookmarksList: Ref<BookMarksItem | any> = ref([])
const bookmarksTree: Ref<BookMarksItem | any> = ref([])
const bookmarksTreeMenu: Ref<BookMarksItem | any> = ref([])
const bookmarksTreeItem: Ref<BookMarksItem | any> = ref([])


onMounted(() => {
    console.log("onMounted")
    getBookmarksData()
})
/**
 * 修改分类信息
 */
const handleCategoryNameDropdownSelect = (key: string) => {
    if (key === 'update') {
        // 弹出模态框/或者抽屉
        showModal.value = true
    }
}
/**
 * 点击折叠的书签
 */
const handleSelect = (key: string) => {
    message.info(key)
}
/**
 * 获取浏览器书签本地数据
 */
const getBookmarksData = () => {
    console.log("db", db)
    db.bookmarks.find({}, (err: any, data = []) => {
        console.log("db.bookmarks.find data ", data)
        bookmarksList.value = data
        // if (data.length !== 0) {
        bookmarksTree.value = bookmarksArray2Tree(data)
        if (bookmarksTree.value.length === 1) {
            let _menu = bookmarksTree.value[0].children
            //  省略层级
            bookmarksTreeItem.value = bookmarksTree.value[0].children
            console.log("TREE", bookmarksTreeItem.value)
            bookmarksTreeMenu.value = bookmarksTree.value[0].children.map(l => {
                const { children, ...obj } = l
                return obj
            })
        } else {

            bookmarksTreeItem.value = bookmarksTree.value
            //  省略层级
            bookmarksTreeMenu.value = bookmarksTree.value.map(item => {
                item.children = item.children.map(l => {
                    const { children, ...obj } = l
                    return obj
                })
                return item
            })
        }
        // }
    })
}

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
                getBookmarksData()
            })

        })
    }



}
const clearBookmarksDb = () => {
    db.bookmarks.remove({}, { multi: true }, (err, msg) => {
        console.log("err", err)
        console.log("message", message)
        message.success("清空成功")
        // 重新加载数据
        getBookmarksData()

    })
}
</script>
<style lang="less">
.bookmarks-anchor {
    margin: 0 10px !important;
    .n-anchor-link__title {
        border-radius: 5px !important;
        padding: 10px 20px !important;
    }
}
</style>
<style lang="less" scoped>
.bookmarks-page {
    height: 100%;
    min-height: 500px;
    padding: 10px;
    .left-menu {
        text-align: left;
        margin: 5px 0px;
        height: 100%;
        // line-height: 30px;
        // font-size: 16px;
        .left-menu-top {
            min-height: 10%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .left-menu-center {
            height: 100%;
        }
        .left-menu-bottom {
        }
    }
    .bg {
        // background-color: #6667ab;
        overflow: auto;
        // color: #fff;
        height: auto;
        height: 100%;
    }
}
.upload-submit {
    margin-left: 20px;
}

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
.layout {
    display: flex;
    flex-direction: row;
    flex: auto;

    &-default-background {
        background: #f5f7f9;
    }

    .layout-sider {
        min-height: 100vh;
        box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
        position: relative;
        z-index: 13;
        transition: all 0.2s ease-in-out;
    }

    .layout-sider-fix {
        position: fixed;
        top: 0;
        left: 0;
    }

    .ant-layout {
        overflow: hidden;
    }

    .layout-right-fix {
        overflow-x: hidden;
        padding-left: 200px;
        min-height: 100vh;
        transition: all 0.2s ease-in-out;
    }

    .layout-content {
        flex: auto;
        min-height: 100vh;
        min-width: 500px;
        padding: 2rem;
        transition: all 0.2s ease-in-out;
    }
}
</style>