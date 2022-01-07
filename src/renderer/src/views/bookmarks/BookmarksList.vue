<template>
  <VirtualList :size="50" :remain="20" :variable="true">
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
        <n-grid :x-gap="12" :y-gap="8" cols="2 xs:2 s:2 m:3 l:4 xl:6 2xl:7" responsive="screen">
          <n-grid-item>
            <BookmarksListCard modal="add" :bookmarks="item" @click="handleCardAdd(item)" />
          </n-grid-item>

          <!-- 单个书签 -->
          <n-grid-item v-if="item.category == BookMarksItemCategory.BOOK_MARKS">
            <BookmarksListCard modal="bookmarks" :bookmarks="item" />
          </n-grid-item>

          <!-- 文件夹的子标签 -->
          <n-grid-item v-for="(cItem, cIndex) in item.children" :key="cIndex">
            <BookmarksListCard modal="bookmarks" :bookmarks="cItem" />
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </VirtualList>
  <n-modal v-model:show="optionalShowModal" preset="card" style="width: 600px">
    <BookmarksForm
      @close="optionalShowModal = false"
      :bookmarks="selectBookmarks"
      :optionModal="selectBookmarksOption"
    />
  </n-modal>
</template>

<script lang="ts" setup>
  import VirtualList from '@supertiger/vue-3-virtual-scroll-list/src/virtual-list.vue';

  // import Logo from "./logo.vue"
  import BookmarksListCard from './BookmarksListCard.vue';
  import BookmarksForm from './BookmarksForm.vue';
  import BookmarksListCardFooter from './BookmarksListCardFooter.vue';
  import type { Ref } from 'vue';
  import { uuid } from '../../utils';
  import { BookMarksItem, BookMarksItemCategory } from '../../types';
  import { ChevronDown28Regular, DocumentEdit16Regular, Add28Regular } from '@vicons/fluent';

  import { NIcon, useMessage } from 'naive-ui';
  import type { DropdownOption } from 'naive-ui';
  import { h, ref } from 'vue';

  const selectBookmarks: Ref<BookMarksItem | any> = ref({});
  const selectBookmarksOption: Ref<string | any> = ref('');
  const optionalShowModal = ref(false);
  const message = useMessage();
  // 监控变化，获取第一个分类？
  const props = defineProps<{
    bookmarksTree: BookMarksItem[];
  }>();
  const cardContentStyle = {
    height: '20px',
  };
  const cardFooterStyle = {
    border: 'none',
    padding: '4px',
    background: '#F6F7F9',
  };
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
    console.log('selectBookmarks.value', selectBookmarks.value);
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
    height: 130px;
  }

  .text-break {
    word-wrap: break-word;
  }

  .bookmarks-name {
    margin-top: 10px;
    // font-size: 14px;
    line-height: 20px;
    height: 20px;
    text-transform: capitalize;
    // overflow: hidden;
  }
  .bookmarks-desc {
    // overflow: hidden;
    height: 40px;
    margin-top: 10px;
    color: var(--title-text-color);
  }
</style>
