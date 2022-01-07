<template>
  <NConfigProvider :theme-overrides="getThemeOverrides" :theme="getDarkTheme">
    <div class="card-item">
      <template v-if="MODAL_ENUM.ADD === modal">
        <div class="header-content-box">
          <div class="content-add">
            <n-icon size="30">
              <Add28Regular />
            </n-icon>
          </div>
        </div>
      </template>
      <template v-else-if="MODAL_ENUM.BOOKMARKS === modal">
        <div class="header-content-box">
          <div class="header">
            {{ bookmarks.name }}
          </div>
          <div class="content">
            {{ bookmarks.name }}
          </div>
        </div>
      </template>
    </div>
    <div class="footer">
      <template v-if="bookmarksIdDirFlag">
        <div style="margin-right: 5px">文件夹</div>
        <n-icon>
          <Folder28Regular
            v-if="bookmarks && bookmarks.children && bookmarks.children.length > 0"
          />
          <FolderProhibited28Regular v-else />
        </n-icon>
      </template>
      <template v-else>
        <div>书签</div>
      </template>
    </div>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import { zhCN, dateZhCN, createTheme, inputDark, datePickerDark, darkTheme } from 'naive-ui';

  import { ChevronDown28Regular, DocumentEdit16Regular, Add28Regular } from '@vicons/fluent';
  import { onMounted, computed, defineEmits, ref } from 'vue';
  import { Folder28Regular, FolderProhibited28Regular } from '@vicons/fluent';
  import { BookMarksItem, getBookMarksItemDefaultValue } from '../../types';
  import { bookmarksIsDir } from '../../utils';

  import { useDesignSettingStore } from '../../store/modules/design.setting.store';

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
  const MODAL_ENUM = {
    ADD: 'add',
    BOOKMARKS: 'bookmarks',
  };
  const bookmarksIdDirFlag = (): boolean => {
    return bookmarksIsDir(props.bookmarks);
  };

  const designStore = useDesignSettingStore();

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));

  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => designStore.globalTheme);

  onMounted(() => {});
</script>

<style scoped lang="less">
  .card-item {
    height: 105px;
    background-color: #f1f2f3;
    border-radius: 5px 5px 0 0;
  }
  .header-content-box {
    padding: 5px;
  }
  .header {
    font-weight: var(--font-weight);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 4px;
  }
  .content {
    font-size: 11px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .content-add {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 105px;
  }
  .footer {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
    padding: 0px 5px;
    background-color: #ebe1e1;
    border-radius: 0 0 5px 5px;
  }
</style>
