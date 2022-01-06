<template>
  <h5 id="setting#主题设置"># 主题设置</h5>
  <div>
    主题：
    <n-switch v-model:value="designStore.darkTheme" class="dark-theme-switch">
      <template #checked>
        <n-icon size="14" color="#ffd93b">
          <SunnySharp />
        </n-icon>
      </template>
      <template #unchecked>
        <n-icon size="14" color="#ffd93b">
          <Moon />
        </n-icon>
      </template>
    </n-switch>
  </div>
</template>

<script lang="ts" setup>
  import { useDesignSettingStore } from '../../store/modules/design.setting.store';
  import { Moon, SunnySharp } from '@vicons/ionicons5';

  const designStore = useDesignSettingStore();
</script>
