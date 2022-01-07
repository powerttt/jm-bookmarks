<template>
  <pre>
    {{ source }}
</pre
  >
</template>
<script lang="ts" setup>
  defineProps<{
    index: string;
    source: any;
  }>();
</script>
