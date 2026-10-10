<template>
  <div class="flex flex-col">
    <div v-for="(value, key) in content" :key="key" class="mb-2 ">
      <div class="font-semibold">{{ key }}:</div>
      <div v-if="typeof value === 'object'">
        <ContentDisplay :content="value" class="ml-4 border-l-2 pl-2" />
      </div>
      <div v-else class="text-gray-400">{{ value }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  content: Object
});
</script>
