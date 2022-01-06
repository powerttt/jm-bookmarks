<template>
  <div v-for="(itemTree, indexTree) in bookmarksTree" :key="indexTree">
    <!-- 标题 -->
    <div v-for="(item, index) in itemTree.children" :key="index" :id="item.uuid">
      <!-- 标题 -->
      <n-divider>
        <template #default>
          <n-dropdown
            size="small"
            trigger="hover"
            placement="bottom-end"
            :show-arrow="true"
            :options="[
              {
                label: '编辑',
                key: 'update',
                item,
                icon() {
                  return editIconH();
                },
              },
            ]"
            @select="handleCategoryNameDropdownSelect"
          >
            <div style="display: flex; align-items: center">
              <span>{{ item.name }}</span>
              <n-icon size="15" style="margin-left: 10px">
                <ChevronDown28Regular />
              </n-icon>
            </div>
          </n-dropdown>
        </template>
      </n-divider>
      <!-- ADD -->
      <n-grid :x-gap="12" :y-gap="12" cols="2 s:2 m:3 l:4 xl:6 2xl:7" responsive="screen">
        <n-grid-item>
          <n-card class="bookmarks-card bookmarks-add-card" hoverable @click="handleCardAdd(item)">
            <n-icon size="30">
              <Add28Regular />
            </n-icon>
          </n-card>
        </n-grid-item>

        <!-- 单个书签 -->
        <n-grid-item v-if="item.category == BookMarksItemCategory.BOOK_MARKS">
          <n-card
            class="bookmarks-card"
            embedded
            hoverable
            @mouseenter="item.showEditBtn = true"
            @mouseleave="item.showEditBtn = false"
          >
            <BookmarksListCard @clickEdit="handleCardEdit(item)" :bookmarks="item" />
          </n-card>
        </n-grid-item>

        <!-- 文件夹的子标签 -->
        <n-grid-item v-for="(cItem, cIndex) in item.children" :key="cIndex">
          <n-card
            class="bookmarks-card"
            embedded
            hoverable
            @mouseenter="cItem.showEditBtn = true"
            @mouseleave="cItem.showEditBtn = false"
          >
            <!-- 文件夹 -->
            <n-dropdown
              v-if="cItem.category === BookMarksItemCategory.DIR"
              @select="handleSelect"
              trigger="hover"
              key-field="uuid"
              label-field="name"
              children-field="children"
              :options="cItem.children"
            >
              <BookmarksListCard @clickEdit="handleCardEdit(cItem)" :bookmarks="cItem" />
            </n-dropdown>
            <!-- 书签 -->

            <BookmarksListCard @clickEdit="handleCardEdit(cItem)" v-else :bookmarks="cItem" />
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
  <n-modal v-model:show="optionalShowModal" preset="card" style="width: 600px">
    <BookmarksForm
      @close="optionalShowModal = false"
      :bookmarks="selectBookmarks"
      :optionModal="selectBookmarksOption"
    />
  </n-modal>
</template>

<script lang="ts" setup>
  // import Logo from "./logo.vue"
  import BookmarksListCard from './BookmarksListCard.vue';
  import BookmarksForm from './BookmarksForm.vue';
  import { defineProps } from 'vue';
  import type { Ref } from 'vue';
  import { uuid } from '../../utils';
  import { BookMarksItem, BookMarksItemCategory } from '../../types';
  import {
    ChevronDown28Regular,
    DocumentEdit16Regular,
    Folder28Regular,
    FolderProhibited28Regular,
    Add28Regular,
  } from '@vicons/fluent';

  import { NIcon, useMessage } from 'naive-ui';
  import type { DropdownOption } from 'naive-ui';
  import { h, ref, reactive, getCurrentInstance, onMounted } from 'vue';

  const selectBookmarks: Ref<BookMarksItem | any> = ref([]);
  const selectBookmarksOption: Ref<string | any> = ref('');
  const optionalShowModal = ref(false);
  const message = useMessage();
  // 监控变化，获取第一个分类？
  const props = defineProps<{
    bookmarksTree: BookMarksItem[];
  }>();

  const editIconH = () => {
    return h(NIcon, null, {
      default: () => h(DocumentEdit16Regular),
    });
  };
  /**
   * 点击折叠的书签
   */
  const handleSelect = (key: string) => {
    message.info(key);
  };
  /**
   * 修改分类信息
   */
  const handleCategoryNameDropdownSelect = (key: number, option: DropdownOption) => {
    selectBookmarksOption.value = key;
    selectBookmarks.value = option.item;
    // 弹出模态框/或者抽屉
    optionalShowModal.value = true;
  };
  /**
   * 编辑书签
   */
  const handleCardEdit = (item: BookMarksItem) => {
    selectBookmarksOption.value = 'update';
    selectBookmarks.value = item;
    // 弹出模态框/或者抽屉
    optionalShowModal.value = true;
  };

  /**
   * 添加书签
   */
  const handleCardAdd = (parent: BookMarksItem) => {
    selectBookmarksOption.value = 'add';
    selectBookmarks.value = {
      uuid: uuid(),
      parentUuid: parent.uuid,
      category: 1,
    };
    // 弹出模态框/或者抽屉
    optionalShowModal.value = true;
  };
</script>

<style lang="less">
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
