<template>
  <div>
    <n-space justify="end" class="card-footer-space">
      <template v-if="bookmarks.category === BookMarksItemCategory.DIR">
        <div>文件夹</div>
        <n-icon>
          <Folder28Regular v-if="bookmarks.children && bookmarks.children.length > 0" />
          <FolderProhibited28Regular v-else />
        </n-icon>
      </template>
      <template v-else>
        <div>书签</div>
      </template>
    </n-space>
  </div>
</template>
<script lang="ts" setup>
  import { Folder28Regular, FolderProhibited28Regular } from '@vicons/fluent';
  import { BookMarksItem, BookMarksItemCategory } from '../../types';

  defineProps<{
    bookmarks: BookMarksItem;
  }>();
</script>
<style lang="less" scoped>
  .card-footer-space {
    padding-left: var(--padding-left);
    padding-right: var(--padding-left);
  }
</style>
