<template>
  <n-form :label-width="80" :model="bookmarks" :rules="rules" size="small" ref="formRef">
    <n-grid :cols="12" :x-gap="12">
      <n-form-item-gi :span="6" label="标题" path="name">
        <n-input placeholder="Ta有好听的名字" v-model:value="bookmarks.name" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="图标" path="logo">
        <n-input
          placeholder="Ta的图标呢"
          type="textarea"
          :autosize="{
            minRows: 1,
            maxRows: 3
          }"
          v-model:value="bookmarks.logo"
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
          v-model:value="bookmarks.url"
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
          v-model:value="bookmarks.desc"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="标签" path="tag">
        <n-dynamic-tags v-model:value="bookmarks.tags" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="类型" path="category">
        <!-- <n-input placeholder="category" v-model:value="bookmarks.category" /> -->
        <n-radio-group v-model:value="bookmarks.category" name="categoryRadio">
          <n-space>
            <n-radio :value="0" default-checked>文件夹</n-radio>
            <n-radio :value="1">书签</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>

      <n-form-item-gi :span="6" label="排序" path="sortNum">
        <n-input placeholder="一个排序" v-model:value="bookmarks.sortNum" />
      </n-form-item-gi>
      <n-form-item-gi :span="6"></n-form-item-gi>
      <n-form-item-gi :span="6" label="打开次数" path="openTime">
        <n-input placeholder="你好，你多久没点我了" v-model:value="bookmarks.openTime" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="打开次数" path="openCount">
        <n-input placeholder="你好，你点了我这么多次" v-model:value="bookmarks.openCount" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="UUID" path="uuid">
        <n-input placeholder="勿动" v-model:value="bookmarks.uuid" disabled />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="P_UUID" path="parentUuid">
        <n-input placeholder="勿动" v-model:value="bookmarks.parentUuid" disabled />
      </n-form-item-gi>
      <n-form-item-gi :span="12">
        <n-button @click="clickSave" attr-type="button">保存</n-button>
      </n-form-item-gi>
    </n-grid>
  </n-form>

  <pre>
    {{ JSON.stringify(bookmarks) }}
  </pre>
</template>

<script lang="ts" setup>
import { defineComponent, ref, defineProps, withDefaults, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { BookMarksItemCategory } from '../../types'
import type { BookMarksItem } from '../../types'
const rules = {

  name: {
    required: true,
    message: 'Ta有好听的名字',
    trigger: 'blur'
  },
  age: {
    required: true,
    message: '请输入年龄',
    trigger: ['input', 'blur']
  },
  uuid: {
    required: true,
    message: '请输入uuid',
    trigger: ['input']
  }
}

interface OptionModalProps {
  bookmarks?: any | BookMarksItem,
  optionModal?: string,
}

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
onMounted(() => {

  console.log("onMounted")
  console.log("bookmarks", props)
  console.log("bookmarks", props.bookmarks)
})
// const props = defineProps<OptionModalProps>()

const message = useMessage()

const clickSave = () => {

}







</script>