<template>
  <div class="bigdata">
    <VirtualList :size="50" :remain="20" :variable="true">
      <div class="item" v-for="(item, i) in 55" :key="item" style="height: 20px">
        {{ item }}
      </div>
    </VirtualList>
  </div>
</template>

<script lang="ts" setup>
  import BigDataListItem from './BigDataListItem.vue';
  //   import VirtualList from 'vue-virtual-scroll-list';
  import VirtualList from '@supertiger/vue-3-virtual-scroll-list/src/virtual-list.vue';

  let items: any = [];
  for (let i = 0; i < 1000; i++) {
    items.push({
      id: i,
      name: 'name ' + i,
    });
  }
</script>
<style>
  .bigdata {
    display: flex;
    flex-direction: column;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
  }
  .item {
    background-color: #f1f2f3;
    margin: 50px;
    padding: 20px;
  }
</style>
