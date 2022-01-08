<template>
  <div class="logo">
    <!-- <img
            src="https://www.naiveui.com/assets/naivelogo.93278402.svg"
            alt
            :class="{ 'mr-2': !collapsed }"
        /> -->
    <h4 class="title">JM Bookmarks</h4>
  </div>
</template>
<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin-bottom: 0;
    }
  }
</style>
