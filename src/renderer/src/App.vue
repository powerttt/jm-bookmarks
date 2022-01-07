<template>
  <div class="app-drag-div"></div>
  <NConfigProvider
    :theme-overrides="getThemeOverrides"
    :locale="zhCN"
    :theme="getDarkTheme"
    :date-locale="dateZhCN"
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </NConfigProvider>
  <n-back-top />
</template>
<script lang="ts" setup>
  import { zhCN, dateZhCN, createTheme, inputDark, datePickerDark, darkTheme } from 'naive-ui';
  import { computed, onMounted } from 'vue';
  import { useDesignSettingStore } from './store/modules/design.setting.store';
  import { ipcRenderer } from 'electron';

  import { lighten } from './utils';

  const designStore = useDesignSettingStore();

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));

  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => designStore.globalTheme);
  const getIpcRendererDarkTheme = () => {
    ipcRenderer.invoke('dark-mode:getThemeSource').then((res: any) => {
      console.log('dark-mode:getThemeSource ', res);
    });
  };
  onMounted(() => {
    getIpcRendererDarkTheme();
    console.log('getDarkTheme', designStore.darkTheme);
  });
</script>
<style lang="less">
  @import './styles';

  body {
    /* 禁用文本选择 */
    -webkit-user-select: none;
    -webkit-app-region: drag;
  }
  .app-drag-div {
    /* electron 可拖动区域 */
    -webkit-app-region: drag;
    height: 30px;
    width: 100%;
  }
</style>
