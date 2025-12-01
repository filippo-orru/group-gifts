<script lang="ts" setup>
const props = defineProps<{
  text: string;
}>();

type Section = {
  text: string;
  isLink: boolean;
};

const sections = computed<Section[]>(() => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = props.text.split(urlRegex);
  return parts.map(part => {
    if (urlRegex.test(part)) {
      return { text: part, isLink: true };
    } else {
      return { text: part, isLink: false };
    }
  });
});
</script>
<template>
  <template v-for="section in sections" :key="section.text">
    <a v-if="section.isLink" :href="section.text" class="link" target="_blank" rel="noopener noreferrer">
      {{ section.text }}
    </a>
    <span v-else>{{ section.text }}</span>
  </template>
</template>



<style></style>
