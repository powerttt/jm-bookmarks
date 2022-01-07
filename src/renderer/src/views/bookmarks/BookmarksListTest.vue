<template>
  <n-grid :x-gap="12" :y-gap="8" cols="2 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen">
    <n-grid-item v-for="(item, i) in 200" :key="i" class="card-item">
      <div class="header-content-box">
        <div class="header">
          这是一段伤心的往事伤心的往事伤心的往事伤心的往事这是一段伤心的往事伤心的往事伤心的往事伤心的往事
        </div>
        <div class="content">
          这是一段伤心的往事伤心的往事伤心的往事伤心的往事这是一段伤心的往事伤心的往事伤心的往事伤心的往事这是一段伤心的往事伤心的往事伤心的往事伤心的往事这是一段伤心的往事伤心的往事伤心的往事伤心的往事
        </div>
      </div>
      <div class="footer"> footer </div>
    </n-grid-item>
  </n-grid>
</template>
<style scoped lang="less">
  .card-box {
    display: flex;
    flex-wrap: wrap;
  }
  .card-item {
    // min-width: 240px;
    //   display: inline-block;
    // margin: 10px;
    //   border: 1px solid #e3e3e3;
    background-color: #f1f2f3;
    border-radius: 5px;
  }
  .header-content-box {
    padding: 5px;
  }
  .header {
    font-weight: 500;
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .content {
    font-size: 11px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .footer {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    padding: 0px 0px 0px 5px;
    background-color: #ebe1e1;
    border-radius: 0 0 5px 5px;
  }
</style>
