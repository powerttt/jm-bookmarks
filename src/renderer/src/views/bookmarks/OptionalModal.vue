<template>
  <n-form :label-width="80" :model="bookmarksCopy" :rules="rules" size="small" ref="formRef">
    <n-grid :cols="12" :x-gap="12">
      <n-form-item-gi :span="6" label="标题" path="name">
        <n-input placeholder="Ta有好听的名字" v-model:value="bookmarksCopy.name" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="图标" path="logo">
        <n-input
          placeholder="Ta的图标呢"
          type="textarea"
          :autosize="{
            minRows: 1,
            maxRows: 3
          }"
          v-model:value="bookmarksCopy.logo"
        />
      </n-form-item-gi>

      <n-form-item-gi :span="6" label="链接" path="url">
        <n-input
          placeholder="前方到站不迷路"
          type="textarea"
          :autosize="{
            minRows: 1,
            maxRows: 3
          }"
          v-model:value="bookmarksCopy.url"
        />
      </n-form-item-gi>

      <n-form-item-gi :span="6" label="描述" path="desc">
        <n-input
          placeholder="你需要短小精悍的描述"
          type="textarea"
          :autosize="{
            minRows: 1,
            maxRows: 3
          }"
          v-model:value="bookmarksCopy.desc"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="标签" path="tag">
        <n-dynamic-tags v-model:value="bookmarksCopy.tags" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="类型" path="category">
        <!-- <n-input placeholder="category" v-model:value="bookmarksCopy.category" /> -->
        <n-radio-group v-model:value="bookmarksCopy.category" name="categoryRadio">
          <n-space>
            <n-radio :value="0">文件夹</n-radio>
            <n-radio :value="1" :default-checked="true">书签</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>

      <n-form-item-gi :span="6" label="排序" path="sortNum">
        <n-input placeholder="一个排序" v-model:value="bookmarksCopy.sortNum" />
      </n-form-item-gi>
      <n-form-item-gi :span="6"></n-form-item-gi>
      <n-form-item-gi :span="6" label="打开次数" path="openTime">
        <n-input placeholder="你好，你多久没点我了" v-model:value="bookmarksCopy.openTime" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="打开次数" path="openCount">
        <n-input placeholder="你好，你点了我这么多次" v-model:value="bookmarksCopy.openCount" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="UUID" path="uuid">
        <n-input placeholder="勿动" v-model:value="bookmarksCopy.uuid" disabled />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="P_UUID" path="parentUuid">
        <n-input placeholder="勿动" v-model:value="bookmarksCopy.parentUuid" disabled />
      </n-form-item-gi>
      <n-form-item-gi :span="12">
        <n-space>
          <n-button
            @click="clickSave"
            type="primary"
            :loading="btnLoading"
            attr-type="button"
          >{{ optionModalCopy === OPTION_MODAL_ENUM.UPDATE ? '编辑' : '添加' }}</n-button>

          <n-button
            :disabled="optionModalCopy === OPTION_MODAL_ENUM.ADD && !bookmarksCopy._id"
            @click="clickDel"
            type="error"
            :loading="btnLoading"
            attr-type="button"
          >删除</n-button>
        </n-space>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import { defineComponent, ref, defineProps, defineEmits, withDefaults, onMounted, getCurrentInstance } from 'vue'
import { useMessage } from 'naive-ui'
import { BookMarksItemCategory } from '../../types'
import type { BookMarksItem } from '../../types'
import { bookmarksArray2Tree } from '../../utils'
import { useBookmarksStore } from '../../store/modules'
interface OptionModalProps {
  bookmarks: any | BookMarksItem,
  optionModal?: string,
}
// 从剪贴板获取，正则url
const OPTION_MODAL_ENUM = {
  UPDATE: 'update',
  ADD: 'add',
}
const rules = {
  name: {
    required: true,
    message: 'Ta应该有好听的名字', 
    trigger: ['input', 'blur']

  },
  uuid: {
    required: true,
    message: '这个不能少吧', trigger: 'blur'

  },
  parentUuid: {
    required: true,
    message: '这个也不能少吧', trigger: 'blur'

  },
}
const emits = defineEmits<{
  (event: 'close'): void
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
const bookmarksCopy: BookMarksItem = ref({})
const optionModalCopy: string = ref("")
onMounted(() => {
  bookmarksCopy.value = JSON.parse(JSON.stringify(props.bookmarks))
  optionModalCopy.value = props.optionModal
  console.log("optionModalCopy", optionModalCopy)
  console.log(JSON.parse(JSON.stringify(props.bookmarks)))
  console.log(bookmarksCopy.value.uuid)
})
// const props = defineProps<OptionModalProps>()
const { proxy } = getCurrentInstance()
const db: JmDatastore = proxy.$db
// 表单
const formRef = ref()
const message = useMessage()
const bookmarksStore = useBookmarksStore()
const btnLoading = ref(false)

const dbResultCheck = (err: any, numReplaced: number, msg: string, successCallback: () => void) => {
  console.log("err ", err)
  console.log("numReplaced", numReplaced)
  if (numReplaced !== 0) {
    // 重新加载树
    db.bookmarks.find({}, (err: any, data = []) => {
      console.log("重新加载树", data)
      let _tree = bookmarksArray2Tree(data)
      bookmarksStore.setTree(_tree)
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

const clickDel = () => {

  btnLoading.value = true
  // upload
  // 写入数据库，重新刷新tree
  db.bookmarks.remove(
    { uuid: bookmarksCopy.value.uuid },
    (err: any, numReplaced: number) => {
      dbResultCheck(err, numReplaced, '删除', () => {
        emits('close')
      })
    })
}

const clickSave = () => {
  formRef.value.validate((errors: string) => {
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
  if (optionModalCopy.value === OPTION_MODAL_ENUM.UPDATE) {
    // upload
    // 写入数据库，重新刷新tree
    db.bookmarks.update(
      { uuid: bookmarksCopy.value.uuid },
      { $set: bookmarksCopy.value },
      {},
      (err: any, numReplaced: number) => {
        dbResultCheck(err, numReplaced, '修改', () => {
          console.log("修改成功")
        })
      })
  }
  // ADD
  else if (optionModalCopy.value === OPTION_MODAL_ENUM.ADD) {
    // upload
    // 写入数据库，重新刷新tree
    db.bookmarks.insert(
      bookmarksCopy.value,
      (err: any, numReplaced: number) => {
        dbResultCheck(err, numReplaced, '新增', () => {
          // 将当前新增改为编辑
          optionModalCopy.value = OPTION_MODAL_ENUM.UPDATE
          console.log("新增成功 optionModalCopy", optionModalCopy.value)
        })
      })
  }


}





</script>