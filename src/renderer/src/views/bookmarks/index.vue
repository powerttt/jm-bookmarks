<template>
  <n-layout class="layout" :position="'absolute'" has-sider>
    <n-layout-sider class="layout-sider">
      <Logo />
      <BookmarksLeftCategory :bookmarks-tree="bookmarksTree" />
    </n-layout-sider>

    <n-layout>
      <n-layout-content class="layout-content layout-default-background">
        <BookmarksList :bookmarks-tree="bookmarksTree" />
        <!-- <BookmarksListTest /> -->
        <h4 id="setting"># 设置</h4>
        <ThemeSetting />
        <Upload />
        <BookmarksTree :bookmarks-tree="bookmarksTree" />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<script lang="ts" setup>
  import { ref, getCurrentInstance, onMounted, computed } from 'vue';
  import Logo from './logo.vue';
  import ThemeSetting from './ThemeSetting.vue';
  import BookmarksTree from './BookmarksTree.vue';
  import BookmarksLeftCategory from './BookmarksLeftCategory.vue';
  import BookmarksList from './BookmarksList.vue';
  import type { JmDatastore, BookMarksItem } from '../../types';
  import { BookMarksItemCategory } from '../../types';
  import { useBookmarksStore } from '../../store/modules';
  import Upload from './Upload.vue';

  const bookmarksStore = useBookmarksStore();

  const bookmarksTree: BookMarksItem[] | any = computed(() => bookmarksStore.getBookmarksTree);

  const loading = ref(true);

  onMounted(async () => {
    db.bookmarks.find({}, (err: any, data = []) => {
      bookmarksStore.setArray2Tree(data);
      loading.value = false;
    });
  });
</script>
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
  }

  .layout {
    display: flex;
    flex-direction: row;
    flex: auto;

    &-default-background {
      // background: #f5f7f9;
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
