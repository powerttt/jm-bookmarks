<template>
  <div v-for="(itemTree, indexTree) in bookmarksTree" :key="indexTree">
    <!-- 标题 -->
    <div
      v-for="(itemCategory, indexCategory) in itemTree.children"
      :key="indexCategory"
      :id="itemCategory.uuid"
    >
      <!-- 标题 -->
      <n-divider>{{ itemCategory.name }}</n-divider>
      <n-grid :x-gap="12" :y-gap="8" cols="2 xs:2 s:2 m:3 l:4 xl:6 2xl:7" responsive="screen">
        <!-- DIR ADD -->
        <n-grid-item @contextmenu="handleContextMenu($event, itemCategory)">
          <BookmarksListCard
            :modal="bookmarksIsDir(itemCategory) ? 'add' : 'bookmarks'"
            :bookmarks="itemCategory"
            @click="handleCardAdd(itemCategory)"
          />
        </n-grid-item>
        <!-- 文件夹的子标签 -->
        <n-grid-item
          v-for="(cItem, cIndex) in itemCategory.children"
          :key="cIndex"
          @contextmenu="handleContextMenu($event, cItem)"
        >
          <template v-if="bookmarksIsDir(cItem)">
            <n-dropdown
              @select="handleSelect"
              trigger="hover"
              key-field="uuid"
              label-field="name"
              children-field="children"
              :options="cItem.children"
            >
              <BookmarksListCard modal="bookmarks" :bookmarks="cItem" />
            </n-dropdown>
          </template>
          <template v-else>
            <BookmarksListCard modal="bookmarks" :bookmarks="cItem" />
          </template>
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
  <n-dropdown
    placement="bottom-start"
    @select="handleClickContentMenuDropdown"
    trigger="manual"
    :x="contentMenuShowX"
    :y="contentMenuShowY"
    :options="contentMenuOption"
    :show="contentMenuShowDropdown"
    :on-clickoutside="handleClickoutsideContentMenuDropdown"
  />
</template>

<script lang="ts" setup>
  import BookmarksListCard from './BookmarksListCard.vue';
  import BookmarksForm from './BookmarksForm.vue';
  import type { Ref } from 'vue';
  import { uuid, bookmarksIsDir } from '../../utils';
  import { BookMarksItem, BookMarksItemCategory } from '../../types';
  import { ChevronDown28Regular, DocumentEdit16Regular, Add28Regular } from '@vicons/fluent';

  import { NIcon, useMessage } from 'naive-ui';
  import type { DropdownOption } from 'naive-ui';
  import { h, ref, nextTick } from 'vue';
  import useClipboard from 'vue-clipboard3';
  // 复制到剪贴板
  const { toClipboard } = useClipboard();

  const selectBookmarks: Ref<BookMarksItem | any> = ref({});
  const selectBookmarksOption: Ref<string | any> = ref('');
  const optionalShowModal = ref(false);
  // 右键
  const contentMenuShowDropdown = ref(false);
  const contentMenuShowX = ref(0);
  const contentMenuShowY = ref(0);
  const message = useMessage();
  // 监控变化，获取第一个分类？
  const props = defineProps<{
    bookmarksTree: BookMarksItem[];
  }>();
  const contentMenuOption = ref([]);
  // const bookmarksIsDir = (bookmarks: BookMarksItem) => {
  //   console.log(bookmarks.category);
  //   console.log(bookmarksIsDir(bookmarks));
  //   return String(bookmarks.category) === BookMarksItemCategory.DIR;
  // };
  /**
   * 点击折叠的书签
   */
  const handleSelect = (key: string) => {
    message.info(key);
  };
  const handleContextMenu = (e, option: BookMarksItem) => {
    console.log(option);
    e.preventDefault();
    contentMenuShowDropdown.value = false;
    nextTick().then(() => {
      let _contentMenuOption = [
        {
          label: '编辑',
          key: 'update',
          param: option,
        },
      ];
      if (!bookmarksIsDir(option) && option.url != '') {
        _contentMenuOption.push({
          label: '复制链接',
          key: 'copyUrl',
          param: option.url,
        });
      }
      contentMenuOption.value = _contentMenuOption;
      contentMenuShowDropdown.value = true;
      contentMenuShowX.value = e.clientX;
      contentMenuShowY.value = e.clientY;
      // 禁止页面滚动
      touchmoveController('add');
    });
  };
  const defferScroll = (e) => e.preventDefault();
  /**
   * 点击右键中的菜单
   */
  const handleClickContentMenuDropdown = (key: string, option: DropdownOption) => {
    // 移除页面滚动
    touchmoveController('remove');

    if (key === 'update') {
      handleCategoryNameDropdownSelect(key, option);
    } else if (key === 'copyUrl') {
      toClipboard(option.param)
        .then(() => {
          message.info('已复制到剪贴板');
        })
        .catch((err) => {
          console.error(err);
        });
    }
    console.log(key, option);
    contentMenuShowDropdown.value = false;
  };
  /**
   * 点击别处，右键菜单失焦
   */
  const handleClickoutsideContentMenuDropdown = (e) => {
    message.info('click content menu');
    console.log(e);
    contentMenuShowDropdown.value = false;
    // 移除页面滚动
    touchmoveController('remove');
  };
  /**
   * 添加或移除页面滚动
   */
  const touchmoveController = (option = 'remove'): void => {
    if (option === 'add') {
      document.body.addEventListener('touchmove', defferScroll, { passive: false });
      document.body.addEventListener('wheel', defferScroll, { passive: false });
    } else {
      document.body.removeEventListener('touchmove', defferScroll);
      document.body.removeEventListener('wheel', defferScroll);
    }
  };
  /**
   * 点击 修改分类信息
   */
  const handleCategoryNameDropdownSelect = (key: string, option: DropdownOption) => {
    selectBookmarksOption.value = key;
    console.log('option', option);
    selectBookmarks.value = option.param;
    console.log('selectBookmarks.value', selectBookmarks.value);
    // 弹出模态框/或者抽屉
    optionalShowModal.value = true;
  };
  /**
   * 添加书签
   */
  const handleCardAdd = (parent: BookMarksItem) => {
    if (String(parent.category) !== BookMarksItemCategory.DIR) {
      message.info('它不是一个文件夹，他不应该有添加');
      return;
    }
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
