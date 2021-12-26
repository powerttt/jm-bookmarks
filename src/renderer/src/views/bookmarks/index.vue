<template>
    <div class="bookmarks-page row">
        <div class="two columns bg">
            <div class="left-menu">
                <n-scrollbar>
                    <div class="left-menu-top">LOGO</div>
                    <div class="left-menu-center">
                        <n-layout has-sider>
                            <n-layout-sider
                                bordered
                                collapse-mode="width"
                                :collapsed-width="64"
                                :width="240"
                                :root-indent="100"
                                :collapsed="collapsed"
                                show-trigger
                                @collapse="collapsed = true"
                                @expand="collapsed = false"
                            >
                                <n-menu
                                    :collapsed="collapsed"
                                    :collapsed-width="64"
                                    :collapsed-icon-size="22"
                                    :options="bookmarksTreeMenu"
                                    key-field="uuid"
                                    label-field="name"
                                    children-field="children"
                                />
                            </n-layout-sider>
                            <n-layout />
                        </n-layout>
                    </div>
                    <h5 class="left-menu-bottom">设置</h5>
                </n-scrollbar>
            </div>
        </div>

        <div class="ten columns bg">
            <!-- <ul v-for="(item,index) in bookmarksTreeItem" :key="index">
                <li>{{ item.name }}</li>
                <ul v-if="item.children && item.children.length > 0">
                    <ul v-for="(cItem,cIndex) in item.children" :key="cIndex">
                        <li>{{ cItem.name }}</li>
                    </ul>
                </ul>
            </ul>-->
            <div v-for="(item,index) in bookmarksTreeItem" :key="index">
                <n-divider> <h5>{{ item.name }}</h5></n-divider>
                <div v-if="item.category == 1">
                    <n-grid
                        :x-gap="12"
                        :y-gap="12"
                        cols="2 s:3 m:4 l:5 xl:6 2xl:7"
                        responsive="screen"
                    >
                        <n-grid-item>
                            <div class="bookmarks-item">{{ item.name }}</div>
                        </n-grid-item>
                    </n-grid>
                </div>

                <n-grid :x-gap="12" :y-gap="12" cols="2 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen">
                    <n-grid-item v-for="(cItem,cIndex) in item.children" :key="cIndex">
                        <div v-if="cItem.category == 0" class="dir bookmarks-item">
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
                        <div v-else class="bookmarks-item">{{ cItem.name }}</div>
                    </n-grid-item>
                </n-grid>
            </div>

            <h4># 设置</h4>
            <h5># 导入</h5>
            <!-- <n-button>naive-ui</n-button> -->

            <n-upload @change="handleChange" :default-upload="false" ref="upload">
                <n-button>选择文件</n-button>
            </n-upload>
            <!-- :disabled="!file" -->
            <n-button @click="uploadSubmit">上传文件</n-button>
            <n-button @click="clearBookmarksDb">清空书签数据</n-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';

import type { Ref } from 'vue'
import { readBookmarks, bookmarksArray2Tree } from '../../utils'
import { useMessage } from 'naive-ui';
import type { JmDatastore, BookMarksItem, BookMarksItemCategory } from '../../types';
import type { Nullable } from '@qvant/qui-max/dist/types/helpers';

// 折叠
const collapsed = ref(false)


const message = useMessage()
const uploadFile: any = ref({})
const { proxy } = getCurrentInstance()
let db: JmDatastore = proxy.$db
const bookmarksList: Ref<BookMarksItem | any> = ref([])
const bookmarksTree: Ref<BookMarksItem | any> = ref([])
const bookmarksTreeMenu: Ref<BookMarksItem | any> = ref([])
const bookmarksTreeItem: Ref<BookMarksItem | any> = ref([])
onMounted(() => {
    getBookmarksData()
})
const handleSelect = (key) => {
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

const options2 = [
    {
        "name": "IDEA",
        "label": "IDEA",

        "uuid": "e337be97-1c0d-98cd-a837-367d621ae0b3",
        "key": "e337be97-1c0d-98cd-a837-367d621ae0b3",
        "parentUuid": "cc3d8a47-bc2f-8de0-be1b-d24afd838078",
        "_id": "BbACtgJGwHws1VWM",
        children: [
            {
                label: "123",
                key: '1233',
                "name": "IntelliJ IDEA 2020.2.3永久破解激活教程",
                "uuid": "6bdebf2f-e8c8-cc63-00cf-0cfa6b23fc76",
                "parentUuid": "e337be97-1c0d-98cd-a837-367d621ae0b3",
                "url": "https://shimo.im/docs/VYTcjGWCCPvXYqGy/read",
                "_id": "2FrzyZdHnkrCJQ3h"
            },
            {
                label: "123",
                key: '1233',
                "name": "IntelliJ IDEA 2020.2.3永久破解激活教程",
                "uuid": "6bdebf2f-e8c8-cc63-00cf-0cfa6b23fc76",
                "parentUuid": "e337be97-1c0d-98cd-a837-367d621ae0b3",
                "url": "https://shimo.im/docs/VYTcjGWCCPvXYqGy/read",
                "_id": "2FrzyZdHnkrCJQ3h"
            }
        ]
    }
]
const options = [
    {
        label: '杰·盖茨比',
        key: 'jay gatsby'
    },
    {
        label: '黛西·布坎南',
        key: 'daisy buchanan'
    },
    {
        type: 'divider',
        key: 'd1'
    },
    {
        label: '尼克·卡拉威',
        key: 'nick carraway'
    },
    {
        label: '其他',
        key: 'others1',
        children: [
            {
                label: '乔丹·贝克',
                key: 'jordan baker'
            },
            {
                label: '汤姆·布坎南',
                key: 'tom buchanan'
            },
            {
                label: '其他',
                key: 'others2',
                disabled: true,
                children: [
                    {
                        label: '鸡肉',
                        key: 'chicken'
                    },
                    {
                        label: '牛肉',
                        key: 'beef'
                    }
                ]
            }
        ]
    }
]

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

<style lang="less" scoped>
.bookmarks-page {
    height: 100%;
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
}
.dir {
    background-color: rgba(0, 128, 0, 0.24);
}
</style>