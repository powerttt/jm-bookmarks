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
            maxRows: 3,
          }"
          v-model:value="bookmarksCopy.logo"
        />
      </n-form-item-gi>

      <n-form-item-gi :span="6" label="链接" path="url">
        <n-input-group>
          <n-input
            placeholder="前方到站不迷路"
            type="textarea"
            :style="{ width: '80%' }"
            :autosize="{
              minRows: 1,
              maxRows: 3,
            }"
            v-model:value="bookmarksCopy.url"
          />
          <n-button type="primary" @click="onClickUrl">访问</n-button>
        </n-input-group>
      </n-form-item-gi>

      <n-form-item-gi :span="6" label="描述" path="desc">
        <n-input
          placeholder="你需要短小精悍的描述"
          type="textarea"
          :autosize="{
            minRows: 1,
            maxRows: 3,
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
        <n-input placeholder="可有可无的一个排序" v-model:value="bookmarksCopy.sortNum" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" />
      <n-form-item-gi :span="6" label="添加时间" path="cTime">
        <n-input placeholder="去我的收藏夹吃灰吧" v-model:value="bookmarksCopy.cTime" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="修改时间" path="uTime">
        <n-input placeholder="精致的内容多次打磨才好" v-model:value="bookmarksCopy.uTime" />
      </n-form-item-gi>
      <n-form-item-gi :span="6" label="打开时间" path="oTime">
        <n-input placeholder="你好，你多久没点我了" v-model:value="bookmarksCopy.oTime" />
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
          <n-button @click="clickSave" type="primary" :loading="btnLoading" attr-type="button">{{
            optionModalCopy === OPTION_MODAL_ENUM.UPDATE ? '编辑' : '添加'
          }}</n-button>

          <n-popconfirm
            positive-text="删除"
            negative-text="点错了"
            :loading="btnLoading"
            @positive-click="clickDel"
          >
            <template #trigger>
              <n-button
                :disabled="optionModalCopy === OPTION_MODAL_ENUM.ADD && !bookmarksCopy._id"
                type="error"
                :loading="btnLoading"
                attr-type="button"
                >删除</n-button
              >
            </template>
            {{ `${bookmarksIsDir(bookmarksCopy) ? '会将当前文件夹下的书签全部删除' : ''}点错了吧` }}
          </n-popconfirm>
        </n-space>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
  import {
    ref,
    defineEmits,
    watch,
    withDefaults,
    onMounted,
    getCurrentInstance,
    computed,
  } from 'vue';
  import type { Ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BookMarksItemCategory, getBookMarksItemDefaultValue } from '../../types';
  import type { BookMarksItem, JmDatastore } from '../../types';
  import { bookmarksTree2Array, uuid, bookmarksIsDir, formatToDateTime } from '../../utils';
  import { useBookmarksStore } from '../../store/modules';
  import { shell } from 'electron';
  interface OptionModalProps {
    bookmarks: any | BookMarksItem;
    optionModal?: string;
  }
  // 从剪贴板获取，正则url
  const OPTION_MODAL_ENUM = {
    UPDATE: 'update',
    ADD: 'add',
  };
  const rules = {
    name: {
      required: true,
      message: 'Ta应该有好听的名字',
      trigger: ['input', 'blur'],
    },
    uuid: {
      required: true,
      message: '这个不能少吧',
      trigger: 'blur',
    },
  };
  const emits = defineEmits<{
    (event: 'close'): void;
  }>();
  const props = withDefaults(defineProps<OptionModalProps>(), {
    bookmarks: getBookMarksItemDefaultValue(),
    optionModal: 'update',
  });
  watch(
    () => props.bookmarks,
    (val) => {
      let defaultValue = getBookMarksItemDefaultValue();
      Object.assign(defaultValue, val);
      console.log('bookmarksCopy', defaultValue);
      bookmarksCopy.value = defaultValue;
    }
  );
  const bookmarksCopy: Ref<BookMarksItem | any> = ref(JSON.parse(JSON.stringify(props.bookmarks)));
  const optionModalCopy: Ref<string> = computed(() => props.optionModal);
  const { proxy } = getCurrentInstance();
  const db: JmDatastore = proxy.$db;
  // 表单
  const formRef = ref();
  const message = useMessage();
  const bookmarksStore = useBookmarksStore();
  const btnLoading = ref(false);

  const dbResultCheck = (
    err: any,
    numReplaced: number,
    msg: string,
    successCallback: () => void
  ) => {
    console.log('err ', err);
    console.log('numReplaced', numReplaced);
    if (err) throw err;
    if (numReplaced !== 0) {
      // 重新加载树
      db.bookmarks.find({}, (err: any, data = []) => {
        console.log('重新加载树', data);
        bookmarksStore.setArray2Tree(data);
        message.success(`${msg}成功`);
        successCallback();
      });
    }
    // numReplaced === 0
    else {
      message.error(`${msg}失败`);
    }
    btnLoading.value = false;
  };
  /**
   * 访问链接
   */
  const onClickUrl = () => {
    if (bookmarksCopy.value.url) {
      shell.openExternal(bookmarksCopy.value.url);
    }
  };
  const clickDel = () => {
    btnLoading.value = true;
    // 如果是文件夹，需要拿到下面的子节点，进行删除
    // upload
    // console.log(bookmarksTree2Array(bookmarksCopy.value))
    let removeWhere = {};
    if (bookmarksIsDir(bookmarksCopy.value)) {
      // 导出所有子节点的_id
      let uuidList = bookmarksTree2Array(bookmarksCopy.value).map((l) => l.uuid);
      // console.log("uuidList",uuidList)
      removeWhere = { uuid: { $in: uuidList } };
    } else {
      removeWhere = { uuid: bookmarksCopy.value.uuid };
    }
    console.log('removeWhere', removeWhere);

    // btnLoading.value = false
    // 写入数据库，重新刷新tree
    db.bookmarks.remove(removeWhere, { multi: true }, (err: any, numReplaced: number) => {
      dbResultCheck(err, numReplaced, '删除', () => {
        emits('close');
      });
    });
  };

  const clickSave = () => {
    btnLoading.value = true;
    formRef.value.validate((errors: string) => {
      if (errors) {
        message.error('请输入必填项目吧，没几个');
        console.log('errors', errors);
        return;
      }
      save();
    });
  };
  const save = () => {
    // tree 还是会出现 带children，就会显示展开icon
    btnLoading.value = true;
    setTimeout(() => (btnLoading.value = false), 5000);
    let { children, ...bookmarksNonChildren } = bookmarksCopy.value;
    let setValue = bookmarksNonChildren;

    // 设置时间
    let newDate: string = formatToDateTime(new Date());
    setValue.uTime = newDate;
    if (!setValue.cTime) {
      setValue.cTime = newDate;
    }
    console.log('newDate', newDate);
    // UPDATE
    if (optionModalCopy.value === OPTION_MODAL_ENUM.UPDATE) {
      console.log('uuid', setValue.uuid);
      console.log('setValue', setValue);
      // upload
      // 写入数据库，重新刷新tree
      db.bookmarks.update(
        { uuid: setValue.uuid },
        { $set: setValue },
        {},
        (err: any, numReplaced: number) => {
          dbResultCheck(err, numReplaced, '修改', () => {
            console.log('修改成功');
          });
        }
      );
    }
    // ADD
    else if (optionModalCopy.value === OPTION_MODAL_ENUM.ADD) {
      // upload
      // 写入数据库，重新刷新tree
      db.bookmarks.insert(setValue, (err: any, numReplaced: number) => {
        dbResultCheck(err, numReplaced, '添加', () => {
          // 将当前添加改为编辑
          optionModalCopy.value = OPTION_MODAL_ENUM.UPDATE;
          console.log('添加成功 optionModalCopy', optionModalCopy.value);
        });
      });
    }
  };

  /**
   * delNotIdItem 删除没有入库的书签，data is uuid
   */
  const delNotIdItem = (uuid: string) => {
    console.log('执行  delNotIdItem uuid=', uuid);
    if (bookmarksCopy.value.children && bookmarksCopy.value.children.length > 0) {
      let index = bookmarksCopy.value.children.findIndex((l: BookMarksItem) => l.uuid === uuid);
      if (index) {
        bookmarksCopy.value.children.splice(index, 1);
      }
    }
  };

  /**
   * 添加子书签或文件夹
   */
  const addChildren = () => {
    // 在当前子中添加
    let _newBookmarks = {
      url: '',
      logo: '',
      desc: '',
      uuid: uuid(),
      name: '',
      tags: [],
      sortNum: 0,
      oTime: 0,
      openCount: 0,
      category: BookMarksItemCategory.BOOK_MARKS,
      parentUuid: bookmarksCopy.value.uuid,
      children: [],
    };
    if (bookmarksCopy.value.children) {
      bookmarksCopy.value.children.unshift(_newBookmarks);
    } else {
      bookmarksCopy.value.children = [_newBookmarks];
    }
    console.log(bookmarksCopy.value.children);
  };
</script>
