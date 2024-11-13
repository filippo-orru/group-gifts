<script setup lang="ts">
const props = defineProps<{
  class?: string,
  disablePadding?: boolean
}>();

const propsClasses: string = props.class || '';

type ClassesType = {
  [key: string]: boolean;
};

const classes: ClassesType = {
  [propsClasses]: true,
  'px-5 py-3 md:py-7': !props.disablePadding
};

</script>

<template>
  <div class="max-w-4xl mx-auto w-full" :class="classes">
    <slot />
  </div>
</template>
