<template>
  <NConfigProvider
    :theme-overrides="getThemeOverrides"
    :theme="getDarkTheme"
    style="box-shadow: 1px -1px 5px 0px #e1e1e1"
  >
    <div class="card-item" @click="click">
      <template v-if="MODAL_ENUM.ADD === modal">
        <div class="card-header-content-box">
          <div class="card-content-add">
            <n-icon size="30">
              <Add28Regular />
            </n-icon>
          </div>
        </div>
      </template>
      <template v-else-if="MODAL_ENUM.BOOKMARKS === modal">
        <div class="card-header">
          {{ bookmarks.name }}
        </div>
        <div class="card-content-box">
          <div class="card-content-box-content">
            {{ bookmarks.desc }}
          </div>
          <div v-if="bookmarks.logo">
            <n-image :src="bookmarks.logo" width="50" />
          </div>
        </div>

        <div class="card-tags-box" v-if="bookmarks.tags && bookmarks.tags.length > 0">
          <div class="card-tags" v-for="(tag, i) in bookmarks.tags" :key="i">{{ tag }}</div>
        </div>
      </template>
    </div>
    <div class="card-footer">
      <div class="card-footer-row card-footer-right">
        <!-- <n-time :time="bookmarks.uTime" /> -->
        <div class="card-update-time">2021-01-01</div>
        <n-icon class="card-category-icon">
          <template v-if="String(bookmarks.category) === BookMarksItemCategory.DIR">
            <Folder28Regular
              v-if="bookmarks && bookmarks.children && bookmarks.children.length > 0"
            />
            <FolderProhibited28Regular v-else />
          </template>
          <template v-else>
            <BookmarkOutline />
          </template>
        </n-icon>
      </div>
    </div>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import { zhCN, dateZhCN, createTheme, inputDark, datePickerDark, darkTheme } from 'naive-ui';

  import { Folder28Regular, FolderProhibited28Regular, Add28Regular } from '@vicons/fluent';
  import { BookmarkOutline } from '@vicons/ionicons5';
  import { computed } from 'vue';
  import { BookMarksItem, getBookMarksItemDefaultValue, BookMarksItemCategory } from '../../types';
  import { bookmarksIsDir } from '../../utils';
  import { useDesignSettingStore } from '../../store/modules/design.setting.store';
  import { NIcon, useMessage } from 'naive-ui';
  const message = useMessage();
  interface Props {
    bookmarks: BookMarksItem;
    // add bookmarks
    modal: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    bookmarks: () => getBookMarksItemDefaultValue(),
    // add bookmarks
    modal: 'add',
  });

  const emits = defineEmits<{
    (event: 'click'): void;
  }>();
  const MODAL_ENUM = {
    ADD: 'add',
    BOOKMARKS: 'bookmarks',
  };
  const click = () => {
    emits('click');
  };
  const designStore = useDesignSettingStore();
  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));

  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => designStore.globalTheme);

  /**
   * 点击折叠的书签
   */
  const handleSelect = (key: string) => {
    message.info(key);
  };
</script>
<style lang="less" scoped>
  @padding: 10px;
  .card-item {
    height: 115px;
    background-color: #fff;
    border-radius: 5px 5px 0 0;
    padding: @padding;
    position: relative;
  }
  .card-header {
    max-height: 40px;
    font-size: 13px;
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    // margin-bottom: 4px;
  }
  .card-content-box {
    display: flex;
    align-items: center;
    max-height: 50px;
    &-content {
      flex: 2;
      font-size: 11px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    &-img {
    }
  }

  .card-content-add {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 105px;
  }
  .card-footer {
    height: 25px;
    font-size: 12px;
    display: flex;
    align-items: center;
    padding: 0px @padding;
    background-color: #dfdfdf;
    border-radius: 0 0 5px 5px;
    &-row {
      display: flex;
      align-items: center;
    }
    &-left {
      flex: 2;
      width: 60%;
      overflow: hidden;
    }
    &-right {
      flex: 1;
      // flex-flow: row wrap;
      justify-content: end;
    }
  }
  .card-tags-box {
    display: flex;
    position: absolute;
    bottom: 6px;

    .card-tags {
      background: #f1f1f1;
      padding: 0 4px;
      border-radius: 4px;
      margin: 0 4px 0 0;
      font-size: 9px;
    }
  }
  .card-tags {
    background: #f1f2f3;
    padding: 0 4px;
    border-radius: 4px;
    margin: 0 4px 0 0;
    font-size: 10px;
  }
  .card-update-time {
    font-size: 11px;
    margin-right: 2px;
  }
  .card-category-icon {
    font-size: 15px;
  }
</style>
